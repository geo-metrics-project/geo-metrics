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
	"strconv"
	"strings"
	"time"
)

type huggingFaceClient struct {
	apiKey              string
	model               string
	httpClient          *http.Client
	maxRetries          int
	initialBackoff      time.Duration
	maxResponseBodySize int64
}

func newHuggingFaceClient(cfg config) *huggingFaceClient {
	return &huggingFaceClient{
		apiKey: cfg.HuggingFaceAPIKey,
		model:  cfg.HuggingFaceModel,
		httpClient: &http.Client{
			Timeout: 30 * time.Second,
		},
		maxRetries:          cfg.HFMaxRetries,
		initialBackoff:      cfg.HFRetryInitialBackoff,
		maxResponseBodySize: cfg.HFMaxResponseBytes,
	}
}

// inferBrandAwareness calls HuggingFace API to determine if the model knows about a brand
func (c *huggingFaceClient) inferBrandAwareness(ctx context.Context, prompt string) (string, error) {
	url := fmt.Sprintf("https://api-inference.huggingface.co/models/%s", c.model)

	reqBody := huggingFaceRequest{
		Inputs: prompt,
	}

	payloadBytes, err := json.Marshal(reqBody)
	if err != nil {
		return "", fmt.Errorf("marshal request: %w", err)
	}

	backoff := c.initialBackoff
	if backoff <= 0 {
		backoff = 2 * time.Second
	}

	var lastErr error
	for attempt := 0; attempt <= c.maxRetries; attempt++ {
		req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(payloadBytes))
		if err != nil {
			return "", fmt.Errorf("create request: %w", err)
		}

		req.Header.Set("Authorization", fmt.Sprintf("Bearer %s", c.apiKey))
		req.Header.Set("Content-Type", "application/json")
		req.Header.Set("User-Agent", "geo-metrics-llm-worker/1.0")

		log.Printf("calling HuggingFace API for model=%s attempt=%d", c.model, attempt+1)

		resp, err := c.httpClient.Do(req)
		if err != nil {
			if ctx.Err() != nil {
				return "", ctx.Err()
			}
			lastErr = fmt.Errorf("api call failed: %w", err)
		} else {
			body, readErr := io.ReadAll(io.LimitReader(resp.Body, c.maxResponseBodySize))
			_ = resp.Body.Close()
			if readErr != nil {
				return "", fmt.Errorf("read response: %w", readErr)
			}

			if resp.StatusCode == http.StatusOK {
				var responses []huggingFaceResponse
				if err := json.Unmarshal(body, &responses); err != nil {
					return "", fmt.Errorf("unmarshal response: %w", err)
				}
				if len(responses) == 0 {
					return "", fmt.Errorf("empty response from API")
				}
				return responses[0].GeneratedText, nil
			}

			lastErr = fmt.Errorf("api returned status %d: %s", resp.StatusCode, string(body))
			if !isRetryableStatus(resp.StatusCode) {
				return "", lastErr
			}

			delay := retryDelayFromHeader(resp.Header.Get("Retry-After"), backoff)
			if attempt == c.maxRetries {
				break
			}
			if err := sleepWithContext(ctx, delay); err != nil {
				return "", err
			}
			backoff *= 2
			continue
		}

		if attempt == c.maxRetries {
			break
		}
		if err := sleepWithContext(ctx, backoff); err != nil {
			return "", err
		}
		backoff *= 2
	}

	if lastErr == nil {
		lastErr = errors.New("huggingface inference failed")
	}
	return "", lastErr
}
func isRetryableStatus(status int) bool {
	return status == http.StatusTooManyRequests || status == http.StatusServiceUnavailable
}

func retryDelayFromHeader(header string, fallback time.Duration) time.Duration {
	trimmed := strings.TrimSpace(header)
	if trimmed == "" {
		return fallback
	}
	sec, err := strconv.Atoi(trimmed)
	if err != nil || sec <= 0 {
		return fallback
	}
	return time.Duration(sec) * time.Second
}

func sleepWithContext(ctx context.Context, d time.Duration) error {
	t := time.NewTimer(d)
	defer t.Stop()
	select {
	case <-ctx.Done():
		return ctx.Err()
	case <-t.C:
		return nil
	}
}
