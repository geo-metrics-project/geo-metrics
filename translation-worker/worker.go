package main

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"log"
	"net/http"
	"strings"
	"time"

	"github.com/google/uuid"
	"github.com/nats-io/nats.go"
)

type translationWorker struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	stream         string
	durable        string
	consumeSubject string
	resultSubject  string
	errorSubject   string
	libreURL       string
	libreSource    string
	libreAPIKey    string
	httpClient     *http.Client
}

func newTranslationWorker(cfg config) (*translationWorker, error) {
	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("translation-worker"),
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

	return &translationWorker{
		conn:           conn,
		js:             js,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		consumeSubject: cfg.NATSConsumeSubject,
		resultSubject:  cfg.NATSResultSubject,
		errorSubject:   cfg.NATSErrorSubject,
		libreURL:       strings.TrimRight(cfg.LibreURL, "/"),
		libreSource:    cfg.LibreSourceLang,
		libreAPIKey:    cfg.LibreAPIKey,
		httpClient: &http.Client{
			Timeout: 20 * time.Second,
		},
	}, nil
}

func (w *translationWorker) Run(ctx context.Context) error {
	sub, err := w.js.PullSubscribe(
		w.consumeSubject,
		w.durable,
		nats.BindStream(w.stream),
		nats.ManualAck(),
		nats.AckExplicit(),
	)
	if err != nil {
		return fmt.Errorf("create pull subscription: %w", err)
	}

	log.Printf("translation-worker started stream=%s subject=%s durable=%s", w.stream, w.consumeSubject, w.durable)

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
			if err := w.handleMessage(msg); err != nil {
				log.Printf("message handling error: %v", err)
			}
		}
	}
}

func (w *translationWorker) handleMessage(msg *nats.Msg) error {
	var evt translationJobCreatedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	if strings.TrimSpace(evt.ReportID) == "" || strings.TrimSpace(evt.JobID) == "" {
		msg.Ack()
		return errors.New("invalid event: report_id and job_id are required")
	}

	translatedText, err := w.translate(evt.Payload.SourceText, evt.Payload.TargetLanguage)
	if err != nil {
		if publishErr := w.publishFailure(evt, err); publishErr != nil {
			msg.Nak()
			return fmt.Errorf("publish failure event: %w", publishErr)
		}
		msg.Ack()
		return nil
	}

	if err := w.publishSuccess(evt, translatedText); err != nil {
		msg.Nak()
		return fmt.Errorf("publish success event: %w", err)
	}

	msg.Ack()
	return nil
}

func (w *translationWorker) translate(sourceText, targetLanguage string) (string, error) {
	reqBody := libreTranslateRequest{
		Q:      sourceText,
		Source: w.libreSource,
		Target: targetLanguage,
		Format: "text",
		APIKey: w.libreAPIKey,
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("encode libretranslate request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, w.libreURL+"/translate", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("create libretranslate request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := w.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("call libretranslate: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read libretranslate response: %w", err)
	}

	if resp.StatusCode >= http.StatusBadRequest {
		return "", fmt.Errorf("libretranslate status %d: %s", resp.StatusCode, string(respBody))
	}

	var out libreTranslateResponse
	if err := json.Unmarshal(respBody, &out); err != nil {
		return "", fmt.Errorf("decode libretranslate response: %w", err)
	}

	if strings.TrimSpace(out.Error) != "" {
		return "", errors.New(out.Error)
	}

	if strings.TrimSpace(out.TranslatedText) == "" {
		return "", errors.New("libretranslate returned empty translation")
	}

	return out.TranslatedText, nil
}

func (w *translationWorker) publishSuccess(job translationJobCreatedEvent, translatedText string) error {
	now := time.Now().UTC().Format(time.RFC3339)
	evt := translationCompletedEvent{
		EventID:       uuid.NewString(),
		EventType:     "report.translation.completed",
		OccurredAt:    now,
		Source:        "translation-worker",
		CorrelationID: job.CorrelationID,
		ReportID:      job.ReportID,
		JobID:         job.JobID,
		SourceEventID: job.EventID,
		Payload: translationCompletedPayload{
			TargetLanguage: job.Payload.TargetLanguage,
			SourceText:     job.Payload.SourceText,
			TranslatedText: translatedText,
		},
	}

	body, err := json.Marshal(evt)
	if err != nil {
		return fmt.Errorf("encode completion event: %w", err)
	}

	if _, err := w.js.Publish(w.resultSubject, body); err != nil {
		return fmt.Errorf("publish completion event: %w", err)
	}

	return nil
}

func (w *translationWorker) publishFailure(job translationJobCreatedEvent, jobErr error) error {
	now := time.Now().UTC().Format(time.RFC3339)
	evt := translationFailedEvent{
		EventID:       uuid.NewString(),
		EventType:     "report.translation.failed",
		OccurredAt:    now,
		Source:        "translation-worker",
		CorrelationID: job.CorrelationID,
		ReportID:      job.ReportID,
		JobID:         job.JobID,
		SourceEventID: job.EventID,
		Payload: translationFailedPayload{
			TargetLanguage: job.Payload.TargetLanguage,
			SourceText:     job.Payload.SourceText,
			ErrorMessage:   jobErr.Error(),
		},
	}

	body, err := json.Marshal(evt)
	if err != nil {
		return fmt.Errorf("encode failure event: %w", err)
	}

	if _, err := w.js.Publish(w.errorSubject, body); err != nil {
		return fmt.Errorf("publish failure event: %w", err)
	}

	return nil
}

func (w *translationWorker) Close() {
	if w.conn != nil {
		w.conn.Close()
	}
}
