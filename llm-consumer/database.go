package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/lib/pq"
)

type repository struct {
	db *sql.DB
}

func newRepository(cfg config) (*repository, error) {
	dsn := fmt.Sprintf(
		"host=%s port=%s dbname=%s user=%s password=%s sslmode=%s",
		cfg.PostgresHost,
		cfg.PostgresPort,
		cfg.PostgresDB,
		cfg.PostgresUser,
		cfg.PostgresPassword,
		cfg.PostgresSSLMode,
	)

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, fmt.Errorf("open postgres: %w", err)
	}

	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(30 * time.Minute)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := db.PingContext(ctx); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("ping postgres: %w", err)
	}

	return &repository{db: db}, nil
}

func (r *repository) Close() error {
	return r.db.Close()
}

// reportExists checks if a report with given ID exists
func (r *repository) reportExists(ctx context.Context, reportID string) (bool, error) {
	var exists bool
	err := r.db.QueryRowContext(
		ctx,
		"SELECT EXISTS(SELECT 1 FROM reports WHERE id = $1)",
		reportID,
	).Scan(&exists)

	if err != nil {
		return false, fmt.Errorf("check report exists: %w", err)
	}

	return exists, nil
}

// insertLLMResponse stores an LLM inference result
func (r *repository) insertLLMResponse(ctx context.Context, evt llmResponseEvent) error {
	occurredAt, err := time.Parse(time.RFC3339, evt.OccurredAt)
	if err != nil {
		return fmt.Errorf("parse time: %w", err)
	}

	query := `
		INSERT INTO llm_responses (
			report_id, source_event_id, prompt_template, region, language_code,
			keyword, model, prompt_text, response, status, error_message, occurred_at, created_at, completed_at
		) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
		ON CONFLICT (report_id, prompt_template, region, language_code, keyword, model)
		DO UPDATE SET
			response = EXCLUDED.response,
			status = EXCLUDED.status,
			error_message = EXCLUDED.error_message,
			completed_at = CASE
				WHEN EXCLUDED.status = 'completed' THEN CURRENT_TIMESTAMP
				ELSE NULL
			END,
			retry_count = CASE 
				WHEN EXCLUDED.status = 'failed' THEN llm_responses.retry_count + 1 
				ELSE llm_responses.retry_count 
			END
	`

	status := "completed"
	response := evt.Response
	errorMessage := ""
	if evt.ErrorMessage != "" {
		status = "failed"
		response = ""
		errorMessage = evt.ErrorMessage
	}
	now := time.Now()
	var completedAt any
	if status == "completed" {
		completedAt = now
	}

	_, err = r.db.ExecContext(ctx, query,
		evt.ReportID,
		evt.SourceEventID,
		evt.PromptTemplate,
		evt.Region,
		evt.LanguageCode,
		evt.Keyword,
		evt.Model,
		evt.PromptText,
		response,
		status,
		errorMessage,
		occurredAt,
		now,
		completedAt,
	)

	if err != nil {
		return fmt.Errorf("insert llm_response: %w", err)
	}

	log.Printf("stored llm_response: report=%s model=%s keyword=%s region=%s status=%s",
		evt.ReportID, evt.Model, evt.Keyword, evt.Region, status)

	return nil
}

// updateReportStatusIfAllProcessed updates report status if all tasks are done
func (r *repository) updateReportStatusIfAllProcessed(ctx context.Context, reportID string) error {
	query := `
		WITH task_counts AS (
			SELECT 
				COUNT(*) FILTER (WHERE status = 'completed') as completed,
				COUNT(*) FILTER (WHERE status = 'failed') as failed,
				COUNT(*) as total
			FROM llm_responses
			WHERE report_id = $1
		)
		UPDATE reports
		SET status = CASE 
			WHEN tc.completed = tc.total THEN 'completed'
			WHEN tc.failed = tc.total THEN 'failed'
			ELSE 'processing'
		END,
		updated_at = $2
		FROM task_counts tc
		WHERE reports.id = $1 AND (tc.completed + tc.failed) > 0
	`

	_, err := r.db.ExecContext(ctx, query, reportID, time.Now())
	if err != nil {
		return fmt.Errorf("update report status: %w", err)
	}

	return nil
}
