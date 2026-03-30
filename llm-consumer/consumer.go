package main

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"
	"time"

	"github.com/nats-io/nats.go"
)

type consumer struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	repo           *repository
	stream         string
	durable        string
	subject        string
	retryDelay     time.Duration
	messageTimeout time.Duration
}

func newConsumer(cfg config, repo *repository) (*consumer, error) {
	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("llm-consumer"),
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

	return &consumer{
		conn:           conn,
		js:             js,
		repo:           repo,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		subject:        cfg.NATSConsumeSubject,
		retryDelay:     cfg.NATSRetryDelay,
		messageTimeout: cfg.MessageProcessTimeout,
	}, nil
}

func (c *consumer) Close() error {
	if c.conn != nil {
		c.conn.Close()
	}
	return nil
}

func (c *consumer) Run(ctx context.Context) error {
	sub, err := c.js.PullSubscribe(
		c.subject,
		c.durable,
		nats.BindStream(c.stream),
		nats.AckExplicit(),
	)
	if err != nil {
		return fmt.Errorf("create pull subscription: %w", err)
	}

	log.Printf("llm-consumer started stream=%s subject=%s durable=%s", c.stream, c.subject, c.durable)

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

func (c *consumer) handleMessage(ctx context.Context, msg *nats.Msg) error {
	msgCtx, cancel := context.WithTimeout(ctx, c.messageTimeout)
	defer cancel()

	var evt llmResponseEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	// Validate event
	if strings.TrimSpace(evt.EventID) == "" || strings.TrimSpace(evt.ReportID) == "" {
		msg.Ack()
		return errors.New("invalid event: event_id and report_id are required")
	}

	alreadyCompleted, err := c.repo.registerEventProcessing(msgCtx, evt, c.stream, c.subject)
	if err != nil {
		log.Printf("error registering processed_event: %v", err)
		msg.NakWithDelay(c.retryDelay)
		return err
	}
	if alreadyCompleted {
		msg.Ack()
		return nil
	}

	// Check if report exists before inserting
	reportExists, err := c.repo.reportExists(msgCtx, evt.ReportID)
	if err != nil {
		log.Printf("error checking report existence: %v", err)
		c.markEventFailedBestEffort(msgCtx, evt.EventID, err)
		msg.NakWithDelay(c.retryDelay)
		return err
	}

	if !reportExists {
		err := fmt.Errorf("report %s not found", evt.ReportID)
		log.Printf("%v, retrying later", err)
		c.markEventFailedBestEffort(msgCtx, evt.EventID, err)
		msg.NakWithDelay(c.retryDelay)
		return err
	}

	// Insert the LLM response
	if err := c.repo.insertLLMResponse(msgCtx, evt); err != nil {
		log.Printf("error inserting llm response: %v", err)
		c.markEventFailedBestEffort(msgCtx, evt.EventID, err)
		msg.NakWithDelay(c.retryDelay)
		return err
	}

	// Update report status if all tasks are done
	if err := c.repo.updateReportStatusIfAllProcessed(msgCtx, evt.ReportID); err != nil {
		log.Printf("error updating report status for report=%s: %v", evt.ReportID, err)
		c.markEventFailedBestEffort(msgCtx, evt.EventID, err)
		msg.NakWithDelay(c.retryDelay)
		return err
	}

	if err := c.repo.markEventCompleted(msgCtx, evt.EventID); err != nil {
		log.Printf("error marking processed_event completed for event_id=%s: %v", evt.EventID, err)
		c.markEventFailedBestEffort(msgCtx, evt.EventID, err)
		msg.NakWithDelay(c.retryDelay)
		return err
	}

	msg.Ack()
	return nil
}

func (c *consumer) markEventFailedBestEffort(ctx context.Context, eventID string, cause error) {
	if cause == nil {
		return
	}
	if err := c.repo.markEventFailed(ctx, eventID, cause.Error()); err != nil {
		log.Printf("error marking processed_event failed for event_id=%s: %v", eventID, err)
	}
}
