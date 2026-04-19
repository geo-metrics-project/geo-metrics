package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	_ "github.com/lib/pq"
	"github.com/nats-io/nats.go"
)

type llmResponseConsumer struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	db             *sql.DB
	stream         string
	durable        string
	consumeSubject string
}

func newLLMResponseConsumer(cfg config) (*llmResponseConsumer, error) {
	if strings.TrimSpace(cfg.PostgresPassword) == "" {
		return nil, errors.New("POSTGRES_PASSWORD is required")
	}

	dsn := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=%s",
		cfg.PostgresHost,
		cfg.PostgresPort,
		cfg.PostgresDB,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresSSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("llm-response-consumer"),
		nats.Timeout(5*time.Second),
		nats.ReconnectWait(2*time.Second),
		nats.MaxReconnects(-1),
	)
	if err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("connect to nats: %w", err)
	}

	js, err := conn.JetStream()
	if err != nil {
		conn.Close()
		_ = db.Close()
		return nil, fmt.Errorf("jetstream context: %w", err)
	}

	return &llmResponseConsumer{
		conn:           conn,
		js:             js,
		db:             db,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		consumeSubject: cfg.NATSConsumeSubject,
	}, nil
}

func (c *llmResponseConsumer) Run(ctx context.Context) error {
	sub, err := c.js.PullSubscribe(
		c.consumeSubject,
		c.durable,
		nats.BindStream(c.stream),
		nats.ManualAck(),
		nats.AckExplicit(),
	)
	if err != nil {
		return fmt.Errorf("create pull subscription: %w", err)
	}

	log.Printf("llm-response-consumer started stream=%s subject=%s durable=%s", c.stream, c.consumeSubject, c.durable)

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
			if err := c.handleMessage(ctx, msg); err != nil {
				log.Printf("message handling error: %v", err)
			}
		}
	}
}

func (c *llmResponseConsumer) handleMessage(ctx context.Context, msg *nats.Msg) error {
	var envelope struct {
		EventType string `json:"event_type"`
	}
	if err := json.Unmarshal(msg.Data, &envelope); err != nil {
		msg.Ack()
		return fmt.Errorf("decode envelope: %w", err)
	}

	switch envelope.EventType {
	case "report.llm.completed":
		if err := c.persistCompleted(ctx, msg.Data); err != nil {
			msg.Nak()
			return err
		}
		msg.Ack()
		return nil
	case "report.llm.failed":
		// Current failed event payload does not include enough fields to satisfy
		// llm_responses required columns. We skip persistence for now.
		msg.Ack()
		return nil
	default:
		msg.Ack()
		return nil
	}
}

func (c *llmResponseConsumer) persistCompleted(ctx context.Context, raw []byte) error {
	var evt llmCompletedEvent
	if err := json.Unmarshal(raw, &evt); err != nil {
		return fmt.Errorf("decode completed event: %w", err)
	}

	if strings.TrimSpace(evt.ReportID) == "" || strings.TrimSpace(evt.SourceEventID) == "" {
		return errors.New("invalid completed event: report_id and source_event_id are required")
	}

	occurredAt, err := time.Parse(time.RFC3339, evt.OccurredAt)
	if err != nil {
		return fmt.Errorf("parse occurred_at: %w", err)
	}

	_, err = c.db.ExecContext(ctx, `
		INSERT INTO llm_responses (
			report_id,
			source_event_id,
			prompt_template,
			region,
			language_code,
			keyword,
			model,
			prompt_text,
			response,
			status,
			error_message,
			occurred_at,
			completed_at,
			retry_count
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'completed',NULL,$10,CURRENT_TIMESTAMP,0)
		ON CONFLICT (report_id, prompt_template, region, language_code, keyword, model)
		DO UPDATE SET
			source_event_id = EXCLUDED.source_event_id,
			prompt_text = EXCLUDED.prompt_text,
			response = EXCLUDED.response,
			status = 'completed',
			error_message = NULL,
			retry_count = 0,
			occurred_at = EXCLUDED.occurred_at,
			completed_at = CURRENT_TIMESTAMP
	`,
		evt.ReportID,
		evt.SourceEventID,
		evt.Payload.PromptTemplate,
		evt.Payload.Region,
		evt.Payload.TargetLanguage,
		evt.Payload.Keyword,
		evt.Payload.Model,
		evt.Payload.PromptText,
		evt.Payload.Response,
		occurredAt,
	)
	if err != nil {
		return fmt.Errorf("upsert llm_response: %w", err)
	}

	return nil
}

func (c *llmResponseConsumer) Close() {
	if c.conn != nil {
		c.conn.Close()
	}
	if c.db != nil {
		_ = c.db.Close()
	}
}
