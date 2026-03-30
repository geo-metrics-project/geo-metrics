package main

import (
	"errors"
	"os"
	"strconv"
	"strings"
	"time"
)

type config struct {
	// NATS configuration
	NATSURL            string
	NATSStream         string
	NATSDurable        string
	NATSConsumeSubject string
	NATSPublishSubject string
	NATSNakDelay       time.Duration

	// HuggingFace configuration
	HuggingFaceAPIKey string
	HuggingFaceModel  string

	// Service configuration
	MaxConcurrency        int
	HFMaxRetries          int
	HFRetryInitialBackoff time.Duration
	HFMaxResponseBytes    int64
}

func loadConfig() (config, error) {
	cfg := config{
		NATSURL:               getEnv("NATS_URL", "nats://localhost:4222"),
		NATSStream:            getEnv("NATS_STREAM", "REPORTS"),
		NATSDurable:           getEnv("NATS_DURABLE", "llm-service-consumer"),
		NATSConsumeSubject:    getEnv("NATS_CONSUME_SUBJECT", "reports.created"),
		NATSPublishSubject:    getEnv("NATS_PUBLISH_SUBJECT", "llm.response"),
		NATSNakDelay:          parseDurationOrDefault(getEnv("NATS_NAK_DELAY", "5s"), 5*time.Second),
		HuggingFaceAPIKey:     getEnv("HUGGINGFACE_API_KEY", ""),
		HuggingFaceModel:      getEnv("HUGGINGFACE_MODEL", "meta-llama/Llama-2-7b-chat-hf"),
		MaxConcurrency:        getEnvInt("MAX_CONCURRENCY", 5),
		HFMaxRetries:          getEnvInt("HF_MAX_RETRIES", 3),
		HFRetryInitialBackoff: parseDurationOrDefault(getEnv("HF_RETRY_INITIAL_BACKOFF", "2s"), 2*time.Second),
		HFMaxResponseBytes:    int64(getEnvInt("HF_MAX_RESPONSE_BYTES", 1048576)),
	}

	if cfg.MaxConcurrency <= 0 {
		cfg.MaxConcurrency = 5
	}
	if cfg.HFMaxRetries < 0 {
		cfg.HFMaxRetries = 0
	}

	if strings.TrimSpace(cfg.HuggingFaceAPIKey) == "" {
		return cfg, errors.New("HUGGINGFACE_API_KEY is required")
	}

	return cfg, nil
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvInt(key string, defaultValue int) int {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	parsed, err := strconv.Atoi(value)
	if err != nil {
		return defaultValue
	}
	return parsed
}

func parseDurationOrDefault(value string, fallback time.Duration) time.Duration {
	d, err := time.ParseDuration(value)
	if err != nil || d <= 0 {
		return fallback
	}
	return d
}
