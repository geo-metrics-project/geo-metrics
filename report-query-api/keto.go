package main

import (
	"context"
	"fmt"
	"net/http"
	"strings"
	"time"

	openapiclient "github.com/ory/keto-client-go/v26"
)

type ketoClient struct {
	client    *openapiclient.APIClient
	namespace string
}

func newKetoClient(baseURL, namespace string) *ketoClient {
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

	return &ketoClient{
		client:    openapiclient.NewAPIClient(cfg),
		namespace: namespace,
	}
}

func (k *ketoClient) checkAnyRelation(ctx context.Context, reportID, userID string, relations []string) (bool, error) {
	for _, relation := range relations {
		body := openapiclient.NewPostCheckPermissionBody()
		body.SetNamespace(k.namespace)
		body.SetObject("report:" + reportID)
		body.SetRelation(relation)
		body.SetSubjectId(userID)

		resp, _, err := k.client.PermissionAPI.PostCheckPermission(ctx).PostCheckPermissionBody(*body).Execute()
		if err != nil {
			return false, fmt.Errorf("keto check permission: %w", err)
		}
		if resp.GetAllowed() {
			return true, nil
		}
	}

	return false, nil
}

func (k *ketoClient) createOwnerRelation(ctx context.Context, reportID, userID string) error {
	body := openapiclient.NewCreateRelationshipBody()
	body.SetNamespace(k.namespace)
	body.SetObject("report:" + reportID)
	body.SetRelation("owner")
	body.SetSubjectId(userID)

	_, _, err := k.client.RelationshipAPI.CreateRelationship(ctx).CreateRelationshipBody(*body).Execute()
	if err != nil {
		return fmt.Errorf("keto create relationship: %w", err)
	}
	return nil
}

func (k *ketoClient) listAccessibleReportIDs(ctx context.Context, userID string) ([]string, error) {
	if k == nil {
		return nil, fmt.Errorf("keto client is not configured")
	}

	var (
		pageToken string
		ids       = make([]string, 0)
	)

	for {
		request := k.client.RelationshipAPI.GetRelationships(ctx).
			Namespace(k.namespace).
			SubjectId(userID)

		if pageToken != "" {
			request = request.PageToken(pageToken)
		}

		resp, _, err := request.Execute()
		if err != nil {
			return nil, fmt.Errorf("keto list relationships: %w", err)
		}

		for _, relation := range resp.GetRelationTuples() {
			if relation.GetNamespace() != k.namespace {
				continue
			}
			if relation.GetRelation() != "owner" && relation.GetRelation() != "viewer" && relation.GetRelation() != "editor" {
				continue
			}
			object := relation.GetObject()
			if !strings.HasPrefix(object, "report:") {
				continue
			}
			ids = append(ids, strings.TrimPrefix(object, "report:"))
		}

		if next := strings.TrimSpace(resp.GetNextPageToken()); next != "" {
			pageToken = next
			continue
		}

		return uniqueStrings(ids), nil
	}
}

func uniqueStrings(values []string) []string {
	seen := make(map[string]struct{}, len(values))
	result := make([]string, 0, len(values))
	for _, value := range values {
		if _, ok := seen[value]; ok {
			continue
		}
		seen[value] = struct{}{}
		result = append(result, value)
	}
	return result
}
