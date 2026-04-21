package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"strings"
	"time"
)

type ketoTupleWriter struct {
	baseURL    string
	namespace  string
	httpClient *http.Client
}

type ketoTuplePayload struct {
	Namespace string `json:"namespace"`
	Object    string `json:"object"`
	Relation  string `json:"relation"`
	SubjectID string `json:"subject_id"`
}

func newKetoTupleWriter(baseURL, namespace string) *ketoTupleWriter {
	baseURL = strings.TrimSpace(strings.TrimSuffix(baseURL, "/"))
	if baseURL == "" {
		return nil
	}
	if strings.TrimSpace(namespace) == "" {
		namespace = "Report"
	}
	return &ketoTupleWriter{
		baseURL:   baseURL,
		namespace: namespace,
		httpClient: &http.Client{
			Timeout: 5 * time.Second,
		},
	}
}

func (k *ketoTupleWriter) upsertReportOwner(ctx context.Context, reportID, userID string) error {
	if strings.TrimSpace(userID) == "" {
		return nil
	}

	payload := ketoTuplePayload{
		Namespace: k.namespace,
		Object:    "report:" + reportID,
		Relation:  "owner",
		SubjectID: "user:" + userID,
	}

	body, err := json.Marshal(payload)
	if err != nil {
		return fmt.Errorf("marshal keto tuple payload: %w", err)
	}

	endpoint := k.baseURL + "/relation-tuples"
	req, err := http.NewRequestWithContext(ctx, http.MethodPut, endpoint, bytes.NewReader(body))
	if err != nil {
		return fmt.Errorf("create keto tuple request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := k.httpClient.Do(req)
	if err != nil {
		return fmt.Errorf("keto tuple request failed: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated && resp.StatusCode != http.StatusNoContent {
		raw, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
		return fmt.Errorf("keto tuple returned %d: %s", resp.StatusCode, strings.TrimSpace(string(raw)))
	}

	return nil
}
