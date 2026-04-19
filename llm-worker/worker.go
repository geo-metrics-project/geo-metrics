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

type llmWorker struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	stream         string
	durable        string
	consumeSubject string
	resultSubject  string
	errorSubject   string
	apiURL         string
	apiKey         string
	httpClient     *http.Client
}

func newLLMWorker(cfg config) (*llmWorker, error) {
	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("llm-worker"),
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

	return &llmWorker{
		conn:           conn,
		js:             js,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		consumeSubject: cfg.NATSConsumeSubject,
		resultSubject:  cfg.NATSResultSubject,
		errorSubject:   cfg.NATSErrorSubject,
		apiURL:         strings.TrimSpace(cfg.LLMAPIURL),
		apiKey:         strings.TrimSpace(cfg.LLMAPIKey),
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
	}, nil
}

func (w *llmWorker) Run(ctx context.Context) error {
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

	log.Printf("llm-worker started stream=%s subject=%s durable=%s", w.stream, w.consumeSubject, w.durable)

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

func (w *llmWorker) handleMessage(msg *nats.Msg) error {
	var evt llmJobCreatedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	if strings.TrimSpace(evt.ReportID) == "" || strings.TrimSpace(evt.JobID) == "" {
		msg.Ack()
		return errors.New("invalid event: report_id and job_id are required")
	}

	promptText := evt.Payload.TranslatedText
	responseText, err := w.callLLM(evt)
	if err != nil {
		if publishErr := w.publishFailure(evt, err); publishErr != nil {
			msg.Nak()
			return fmt.Errorf("publish failure event: %w", publishErr)
		}
		msg.Ack()
		return nil
	}

	if err := w.publishSuccess(evt, promptText, responseText); err != nil {
		msg.Nak()
		return fmt.Errorf("publish success event: %w", err)
	}

	msg.Ack()
	return nil
}

func (w *llmWorker) callLLM(job llmJobCreatedEvent) (string, error) {
	systemPrompt := fmt.Sprintf("You are a market analysis assistant. Use region context '%s' and answer in language '%s'.", job.Payload.Region, job.Payload.TargetLanguage)

	reqBody := llmAPIRequest{
		Prompt:       job.Payload.TranslatedText,
		SystemPrompt: systemPrompt,
		Model:        job.Payload.Model,
		Region:       job.Payload.Region,
		Language:     job.Payload.TargetLanguage,
		Metadata: map[string]any{
			"report_id":          job.ReportID,
			"llm_job_id":         job.JobID,
			"translation_job_id": job.Payload.TranslationJobID,
			"keyword":            job.Payload.Keyword,
			"prompt_template":    job.Payload.PromptTemplate,
		},
	}

	body, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("encode llm request: %w", err)
	}

	req, err := http.NewRequest(http.MethodPost, w.apiURL, bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("create llm request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")
	if w.apiKey != "" {
		req.Header.Set("Authorization", "Bearer "+w.apiKey)
	}

	resp, err := w.httpClient.Do(req)
	if err != nil {
		return "", fmt.Errorf("call llm api: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("read llm response: %w", err)
	}

	if resp.StatusCode >= http.StatusBadRequest {
		return "", fmt.Errorf("llm api status %d: %s", resp.StatusCode, string(respBody))
	}

	var out llmAPIResponse
	if err := json.Unmarshal(respBody, &out); err != nil {
		return "", fmt.Errorf("decode llm response: %w", err)
	}

	if strings.TrimSpace(out.Error) != "" {
		return "", errors.New(out.Error)
	}

	responseText := strings.TrimSpace(out.Response)
	if responseText == "" {
		responseText = strings.TrimSpace(out.Output)
	}
	if responseText == "" {
		responseText = strings.TrimSpace(out.Text)
	}
	if responseText == "" {
		return "", errors.New("llm api returned empty response")
	}

	return responseText, nil
}

func (w *llmWorker) publishSuccess(job llmJobCreatedEvent, promptText, responseText string) error {
	now := time.Now().UTC().Format(time.RFC3339)
	evt := llmCompletedEvent{
		EventID:       uuid.NewString(),
		EventType:     "report.llm.completed",
		OccurredAt:    now,
		Source:        "llm-worker",
		CorrelationID: job.CorrelationID,
		ReportID:      job.ReportID,
		JobID:         job.JobID,
		SourceEventID: job.EventID,
		Payload: llmCompletedPayload{
			TranslationJobID: job.Payload.TranslationJobID,
			PromptTemplate:   job.Payload.PromptTemplate,
			Keyword:          job.Payload.Keyword,
			TargetLanguage:   job.Payload.TargetLanguage,
			SourceText:       job.Payload.SourceText,
			TranslatedText:   job.Payload.TranslatedText,
			Model:            job.Payload.Model,
			Region:           job.Payload.Region,
			PromptText:       promptText,
			Response:         responseText,
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

func (w *llmWorker) publishFailure(job llmJobCreatedEvent, jobErr error) error {
	now := time.Now().UTC().Format(time.RFC3339)
	evt := llmFailedEvent{
		EventID:       uuid.NewString(),
		EventType:     "report.llm.failed",
		OccurredAt:    now,
		Source:        "llm-worker",
		CorrelationID: job.CorrelationID,
		ReportID:      job.ReportID,
		JobID:         job.JobID,
		SourceEventID: job.EventID,
		Payload: llmFailedPayload{
			TranslationJobID: job.Payload.TranslationJobID,
			Model:            job.Payload.Model,
			Region:           job.Payload.Region,
			ErrorMessage:     jobErr.Error(),
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

func (w *llmWorker) Close() {
	if w.conn != nil {
		w.conn.Close()
	}
}
