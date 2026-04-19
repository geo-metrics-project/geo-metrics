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

type llmPlanner struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	stream         string
	durable        string
	consumeSubject string
	jobSubject     string
}

func newLLMPlanner(cfg config) (*llmPlanner, error) {
	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("llm-planner"),
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

	return &llmPlanner{
		conn:           conn,
		js:             js,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		consumeSubject: cfg.NATSConsumeSubject,
		jobSubject:     cfg.NATSJobSubject,
	}, nil
}

func (p *llmPlanner) Run(ctx context.Context) error {
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

	log.Printf("llm-planner started stream=%s subject=%s durable=%s", p.stream, p.consumeSubject, p.durable)

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

func (p *llmPlanner) handleMessage(msg *nats.Msg) error {
	var evt translationCompletedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	if strings.TrimSpace(evt.ReportID) == "" || strings.TrimSpace(evt.JobID) == "" {
		msg.Ack()
		return errors.New("invalid event: report_id and job_id are required")
	}

	models := normalizeList(evt.Payload.Models)
	regions := normalizeList(evt.Payload.Regions)
	if len(models) == 0 || len(regions) == 0 {
		msg.Ack()
		return errors.New("invalid event: models and regions are required for llm planning")
	}

	now := time.Now().UTC().Format(time.RFC3339)
	for _, model := range models {
		for _, region := range regions {
			jobEvent := llmJobCreatedEvent{
				EventID:       uuid.NewString(),
				EventType:     "report.llm.job.created",
				OccurredAt:    now,
				Source:        "llm-planner",
				CorrelationID: evt.CorrelationID,
				ReportID:      evt.ReportID,
				JobID:         makeLLMJobID(evt.ReportID, evt.JobID, model, region),
				SourceEventID: evt.EventID,
				Payload: llmJobPayload{
					TranslationJobID: evt.JobID,
					PromptTemplate:   evt.Payload.PromptTemplate,
					Keyword:          evt.Payload.Keyword,
					TargetLanguage:   evt.Payload.TargetLanguage,
					SourceText:       evt.Payload.SourceText,
					TranslatedText:   evt.Payload.TranslatedText,
					Model:            model,
					Region:           region,
				},
			}

			body, err := json.Marshal(jobEvent)
			if err != nil {
				msg.Nak()
				return fmt.Errorf("encode llm job event: %w", err)
			}

			if _, err := p.js.Publish(p.jobSubject, body); err != nil {
				msg.Nak()
				return fmt.Errorf("publish llm job event: %w", err)
			}
		}
	}

	msg.Ack()
	return nil
}

func (p *llmPlanner) Close() {
	if p.conn != nil {
		p.conn.Close()
	}
}

func makeLLMJobID(reportID, translationJobID, model, region string) string {
	raw := reportID + "|" + translationJobID + "|" + model + "|" + region
	h := sha1.Sum([]byte(raw))
	return "llm_" + hex.EncodeToString(h[:])
}

func normalizeList(values []string) []string {
	items := make([]string, 0, len(values))
	for _, value := range values {
		trimmed := strings.TrimSpace(value)
		if trimmed == "" {
			continue
		}
		items = append(items, trimmed)
	}

	return items
}
