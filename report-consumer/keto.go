package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	openapiclient "github.com/ory/keto-client-go/v26"
)

type ketoTupleWriter struct {
	client    *openapiclient.APIClient
	namespace string
}

func newKetoTupleWriter(baseURL, namespace string) *ketoTupleWriter {
	baseURL = strings.TrimSpace(strings.TrimSuffix(baseURL, "/"))
	if baseURL == "" {
		return nil
	}
	if strings.TrimSpace(namespace) == "" {
		namespace = "Report"
	}

	cfg := openapiclient.NewConfiguration()
	cfg.Servers = openapiclient.ServerConfigurations{openapiclient.ServerConfiguration{URL: baseURL, Description: "geo-metrics keto"}}
	cfg.HTTPClient = &http.Client{Timeout: 5 * time.Second}

	return &ketoTupleWriter{
		client:    openapiclient.NewAPIClient(cfg),
		namespace: namespace,
	}
}

func (k *ketoTupleWriter) upsertReportOwner(ctx context.Context, reportID, userID string) error {
	if strings.TrimSpace(userID) == "" {
		return nil
	}

	body := openapiclient.NewCreateRelationshipBody()
	body.SetNamespace(k.namespace)
	body.SetObject("report:" + reportID)
	body.SetRelation("owner")
	body.SetSubjectId(userID)

	_, _, err := k.client.RelationshipAPI.CreateRelationship(ctx).CreateRelationshipBody(*body).Execute()
	if err != nil {
		return fmt.Errorf("keto create owner relationship: %w", err)
	}

	return nil
}
