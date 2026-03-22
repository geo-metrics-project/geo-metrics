package main

import (
	"encoding/json"
	"time"

	"github.com/google/uuid"
)

func createReport(userID string, req analyzeRequest, publisher *natsPublisher) (analyzeResponse, error) {
	reportID := "rpt_" + uuid.NewString()
	now := time.Now().UTC().Format(time.RFC3339)

	evt := reportCreationRequestedEvent{
		EventID:    uuid.NewString(),
		EventType:  "report.creation.requested",
		OccurredAt: now,
		Source:     "report-service",
		UserID:     userID,
		ReportID:   reportID,
		Payload:    req,
	}

	body, err := json.Marshal(evt)
	if err != nil {
		return analyzeResponse{}, err
	}

	if err := publisher.Publish(body); err != nil {
		return analyzeResponse{}, err
	}

	return analyzeResponse{
		ReportID:  reportID,
		BrandName: req.BrandName,
		Timestamp: now,
	}, nil
}
