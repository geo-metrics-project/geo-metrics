package main

import (
	"context"
	"crypto/sha1"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/nats-io/nats.go"
)

type translationPlanner struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	stream         string
	durable        string
	consumeSubject string
	jobSubject     string
	planSubject    string
}

func newTranslationPlanner(cfg config) (*translationPlanner, error) {
	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("translation-planner"),
		nats.Timeout(5*time.Second),
		nats.ReconnectWait(2*time.Second),
		nats.MaxReconnects(-1),
	)
	if err != nil {
		return nil, fmt.Errorf("connect to nats: %w", err)
	}

	js, err := conn.JetStream()
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("jetstream context: %w", err)
	}

	return &translationPlanner{
		conn:           conn,
		js:             js,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		consumeSubject: cfg.NATSConsumeSubject,
		jobSubject:     cfg.NATSJobSubject,
		planSubject:    cfg.NATSPlanSubject,
	}, nil
}

func (p *translationPlanner) Run(ctx context.Context) error {
	sub, err := p.js.PullSubscribe(
		p.consumeSubject,
		p.durable,
		nats.BindStream(p.stream),
		nats.ManualAck(),
		nats.AckExplicit(),
	)
	if err != nil {
		return fmt.Errorf("create pull subscription: %w", err)
	}

	log.Printf("translation-planner started stream=%s subject=%s durable=%s", p.stream, p.consumeSubject, p.durable)

	for {
		select {
		case <-ctx.Done():
			return nil
		default:
		}

		msgs, err := sub.Fetch(10, nats.MaxWait(2*time.Second))
		if err != nil {
			if errors.Is(err, nats.ErrTimeout) {
				continue
			}
			if ctx.Err() != nil {
				return nil
			}
			log.Printf("fetch error: %v", err)
			time.Sleep(time.Second)
			continue
		}

		for _, msg := range msgs {
			if err := p.handleMessage(msg); err != nil {
				log.Printf("message handling error: %v", err)
			}
		}
	}
}

func (p *translationPlanner) handleMessage(msg *nats.Msg) error {
	var evt reportCreationRequestedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	if strings.TrimSpace(evt.ReportID) == "" {
		msg.Ack()
		return errors.New("invalid event: report_id is required")
	}

	totalJobs := 0
	now := time.Now().UTC().Format(time.RFC3339)

	for _, tmpl := range evt.Payload.PromptTemplates {
		template := strings.TrimSpace(tmpl)
		if template == "" {
			continue
		}
		for _, kw := range evt.Payload.Keywords {
			keyword := strings.TrimSpace(kw)
			if keyword == "" {
				continue
			}
			for _, lang := range evt.Payload.Languages {
				targetLanguage := strings.TrimSpace(lang)
				if targetLanguage == "" {
					continue
				}

				jobID := makeJobID(evt.ReportID, template, keyword, targetLanguage)
				sourceText := strings.ReplaceAll(template, "{keyword}", keyword)

				jobEvent := translationJobCreatedEvent{
					EventID:       uuid.NewString(),
					EventType:     "report.translation.job.created",
					OccurredAt:    now,
					Source:        "translation-planner",
					Correlation:   evt.ReportID,
					ReportID:      evt.ReportID,
					JobID:         jobID,
					SourceEventID: evt.EventID,
					Payload: translationJobPayload{
						PromptTemplate: template,
						Keyword:        keyword,
						TargetLanguage: targetLanguage,
						SourceLanguage: "en",
						SourceText:     sourceText,
					},
				}

				body, err := json.Marshal(jobEvent)
				if err != nil {
					msg.Nak()
					return fmt.Errorf("encode job event: %w", err)
				}

				if _, err := p.js.Publish(p.jobSubject, body); err != nil {
					msg.Nak()
					return fmt.Errorf("publish job event: %w", err)
				}

				totalJobs++
			}
		}
	}

	plannedEvent := translationJobsPlannedEvent{
		EventID:       uuid.NewString(),
		EventType:     "report.translation.jobs.planned",
		OccurredAt:    now,
		Source:        "translation-planner",
		Correlation:   evt.ReportID,
		ReportID:      evt.ReportID,
		TotalJobs:     totalJobs,
		SourceEventID: evt.EventID,
	}

	body, err := json.Marshal(plannedEvent)
	if err != nil {
		msg.Nak()
		return fmt.Errorf("encode planned event: %w", err)
	}

	if _, err := p.js.Publish(p.planSubject, body); err != nil {
		msg.Nak()
		return fmt.Errorf("publish planned event: %w", err)
	}

	msg.Ack()
	return nil
}

func (p *translationPlanner) Close() {
	if p.conn != nil {
		p.conn.Close()
	}
}

func makeJobID(reportID, promptTemplate, keyword, targetLanguage string) string {
	raw := reportID + "|" + promptTemplate + "|" + keyword + "|" + targetLanguage
	h := sha1.Sum([]byte(raw))
	return "job_" + hex.EncodeToString(h[:])
}
