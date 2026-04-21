package main

import (
	"context"
	"fmt"
)

type reportAuthorizer struct {
	keto *ketoClient
}

func newReportAuthorizer(_ *store, keto *ketoClient) *reportAuthorizer {
	return &reportAuthorizer{keto: keto}
}

func (a *reportAuthorizer) canReadReport(ctx context.Context, userID, reportID string) (bool, error) {
	if a.keto == nil {
		return false, fmt.Errorf("keto client is not configured")
	}

	allowed, err := a.keto.checkAnyRelation(ctx, reportID, userID, []string{"owner", "viewer", "editor"})
	if err != nil {
		return false, fmt.Errorf("keto authorization check failed: %w", err)
	}

	return allowed, nil
}
