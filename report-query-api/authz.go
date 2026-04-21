package main

import (
	"context"
	"fmt"
)

type reportAuthorizer struct {
	store *store
	keto  *ketoClient
}

func newReportAuthorizer(store *store, keto *ketoClient) *reportAuthorizer {
	return &reportAuthorizer{store: store, keto: keto}
}

func (a *reportAuthorizer) canReadReport(ctx context.Context, userID, reportID string) (bool, error) {
	if a.keto != nil {
		allowed, err := a.keto.checkAnyRelation(ctx, reportID, userID, []string{"owner", "viewer", "editor"})
		if err != nil {
			return false, fmt.Errorf("keto authorization check failed: %w", err)
		}
		return allowed, nil
	}

	rep, found, err := a.store.getReport(ctx, reportID)
	if err != nil {
		return false, err
	}
	if !found || rep.UserID == nil {
		return false, nil
	}

	return *rep.UserID == userID, nil
}
