package main

import (
	"fmt"
	"time"

	"github.com/nats-io/nats.go"
)

type natsPublisher struct {
	conn    *nats.Conn
	js      nats.JetStreamContext
	subject string
}

func newNATSPublisher(url, subject string) (*natsPublisher, error) {
	conn, err := nats.Connect(
		url,
		nats.Name("report-service-publisher"),
		nats.Timeout(5*time.Second),
		nats.ReconnectWait(2*time.Second),
		nats.MaxReconnects(-1),
	)
	if err != nil {
		return nil, fmt.Errorf("connect to nats: %w", err)
	}

	js, err := conn.JetStream()
	if err != nil {
		return nil, fmt.Errorf("jetstream context: %w", err)
	}

	return &natsPublisher{conn: conn, js: js, subject: subject}, nil
}

func (p *natsPublisher) Publish(payload []byte) error {
	_, err := p.js.Publish(p.subject, payload)
	if err != nil {
		return fmt.Errorf("publish to nats: %w", err)
	}
	return nil
}

func (p *natsPublisher) Close() {
	if p.conn != nil {
		p.conn.Close()
	}
}
