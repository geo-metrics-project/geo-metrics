package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

type ketoClient struct {
	baseURL    string
	namespace  string
	httpClient *http.Client
}

type ketoCheckResponse struct {
	Allowed bool `json:"allowed"`
}

func newKetoClient(baseURL, namespace string) *ketoClient {
	baseURL = strings.TrimSpace(strings.TrimSuffix(baseURL, "/"))
	if baseURL == "" {
		return nil
	}
	if strings.TrimSpace(namespace) == "" {
		namespace = "Report"
	}
	return &ketoClient{
		baseURL:   baseURL,
		namespace: namespace,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (k *ketoClient) checkRelation(ctx context.Context, reportID, relation, userID string) (bool, error) {
	q := url.Values{}
	q.Set("namespace", k.namespace)
	q.Set("object", "report:"+reportID)
	q.Set("relation", relation)
	q.Set("subject_id", "user:"+userID)

	endpoint := k.baseURL + "/relation-tuples/check/openapi?" + q.Encode()
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, endpoint, nil)
	if err != nil {
		return false, fmt.Errorf("create keto check request: %w", err)
	}

	resp, err := k.httpClient.Do(req)
	if err != nil {
		return false, fmt.Errorf("keto check request: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return false, fmt.Errorf("keto check returned %d: %s", resp.StatusCode, strings.TrimSpace(string(body)))
	}

	var payload ketoCheckResponse
	if err := json.NewDecoder(resp.Body).Decode(&payload); err != nil {
		return false, fmt.Errorf("decode keto check response: %w", err)
	}

	return payload.Allowed, nil
}

func (k *ketoClient) checkAnyRelation(ctx context.Context, reportID, userID string, relations []string) (bool, error) {
	for _, relation := range relations {
		allowed, err := k.checkRelation(ctx, reportID, relation, userID)
		if err != nil {
			return false, err
		}
		if allowed {
			return true, nil
		}
	}
	return false, nil
}
