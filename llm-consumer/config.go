package main

import (
	"errors"
	"os"
	"strings"
	"time"
)

type config struct {
	// NATS configuration
	NATSURL            string
	NATSStream         string
	NATSDurable        string
	NATSConsumeSubject string
	NATSRetryDelay     time.Duration

	// Database configuration
	PostgresHost     string
	PostgresPort     string
	PostgresDB       string
	PostgresUser     string
	PostgresPassword string
	PostgresSSLMode  string

	// Consumer behavior
	MessageProcessTimeout time.Duration
}

func loadConfig() (config, error) {
	cfg := config{
		NATSURL:               getEnv("NATS_URL", "nats://localhost:4222"),
		NATSStream:            getEnv("NATS_STREAM", "REPORTS"),
		NATSDurable:           getEnv("NATS_DURABLE", "llm-consumer"),
		NATSConsumeSubject:    getEnv("NATS_CONSUME_SUBJECT", "llm.response"),
		NATSRetryDelay:        parseDurationOrDefault(getEnv("NATS_RETRY_DELAY", "5s"), 5*time.Second),
		PostgresHost:          getEnv("POSTGRES_HOST", "localhost"),
		PostgresPort:          getEnv("POSTGRES_PORT", "5432"),
		PostgresDB:            getEnv("POSTGRES_DB", "geometrics"),
		PostgresUser:          getEnv("POSTGRES_USER", "geometrics"),
		PostgresPassword:      getEnv("POSTGRES_PASSWORD", ""),
		PostgresSSLMode:       getEnv("POSTGRES_SSLMODE", "disable"),
		MessageProcessTimeout: parseDurationOrDefault(getEnv("MESSAGE_PROCESS_TIMEOUT", "10s"), 10*time.Second),
	}

	if strings.TrimSpace(cfg.PostgresPassword) == "" {
		return cfg, errors.New("POSTGRES_PASSWORD is required")
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func parseDurationOrDefault(value string, fallback time.Duration) time.Duration {
	d, err := time.ParseDuration(value)
	if err != nil || d <= 0 {
		return fallback
	}
	return d
}
