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

	"github.com/lib/pq"
	"github.com/nats-io/nats.go"
)

type reportConsumer struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	db             *sql.DB
	keto           *ketoTupleWriter
	stream         string
	durable        string
	consumeSubject string
}

func newReportConsumer(cfg config) (*reportConsumer, error) {
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
		nats.Name("report-consumer"),
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

	ketoWriter := newKetoTupleWriter(cfg.KetoWriteURL, cfg.KetoNamespace)

	return &reportConsumer{
		conn:           conn,
		js:             js,
		db:             db,
		keto:           ketoWriter,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		consumeSubject: cfg.NATSConsumeSubject,
	}, nil
}

func (c *reportConsumer) Run(ctx context.Context) error {
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

	log.Printf("report-consumer started stream=%s subject=%s durable=%s", c.stream, c.consumeSubject, c.durable)

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

func (c *reportConsumer) handleMessage(ctx context.Context, msg *nats.Msg) error {
	var evt reportCreationRequestedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	if strings.TrimSpace(evt.EventID) == "" || strings.TrimSpace(evt.ReportID) == "" {
		msg.Ack()
		return errors.New("invalid event: event_id and report_id are required")
	}

	occurredAt, err := time.Parse(time.RFC3339, evt.OccurredAt)
	if err != nil {
		msg.Ack()
		return fmt.Errorf("parse occurred_at: %w", err)
	}

	tx, err := c.db.BeginTx(ctx, nil)
	if err != nil {
		msg.Nak()
		return fmt.Errorf("begin tx: %w", err)
	}
	defer func() {
		_ = tx.Rollback()
	}()

	_, err = tx.ExecContext(ctx, `
		INSERT INTO reports (
			id,
			source_event_id,
			brand_name,
			competitor_names,
			models,
			keywords,
			regions,
			languages,
			prompt_templates,
			status,
			user_id,
			occurred_at
		)
		VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'pending',$10,$11)
		ON CONFLICT (id) DO UPDATE
		SET
			source_event_id = EXCLUDED.source_event_id,
			brand_name = EXCLUDED.brand_name,
			competitor_names = EXCLUDED.competitor_names,
			models = EXCLUDED.models,
			keywords = EXCLUDED.keywords,
			regions = EXCLUDED.regions,
			languages = EXCLUDED.languages,
			prompt_templates = EXCLUDED.prompt_templates,
			user_id = EXCLUDED.user_id,
			occurred_at = EXCLUDED.occurred_at
	`,
		evt.ReportID,
		evt.EventID,
		evt.Payload.BrandName,
		pq.Array(evt.Payload.CompetitorNames),
		pq.Array(evt.Payload.Models),
		pq.Array(evt.Payload.Keywords),
		pq.Array(evt.Payload.Regions),
		pq.Array(evt.Payload.Languages),
		pq.Array(evt.Payload.PromptTemplates),
		nullableString(evt.UserID),
		occurredAt,
	)
	if err != nil {
		_ = tx.Rollback()
		msg.Nak()
		return fmt.Errorf("upsert report: %w", err)
	}

	if err := tx.Commit(); err != nil {
		msg.Nak()
		return fmt.Errorf("commit tx: %w", err)
	}

	if c.keto != nil {
		if err := c.keto.upsertReportOwner(ctx, evt.ReportID, evt.UserID); err != nil {
			msg.Nak()
			return fmt.Errorf("sync report ownership to keto: %w", err)
		}
	}

	msg.Ack()
	return nil
}

func (c *reportConsumer) Close() {
	if c.conn != nil {
		c.conn.Close()
	}
	if c.db != nil {
		_ = c.db.Close()
	}
}

func nullableString(v string) any {
	if strings.TrimSpace(v) == "" {
		return nil
	}
	return v
}
