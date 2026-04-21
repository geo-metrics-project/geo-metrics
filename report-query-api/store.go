package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"strings"
	"time"

	"github.com/lib/pq"
)

type store struct {
	db *sql.DB
}

func newStore(cfg config) (*store, error) {
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

	return &store{db: db}, nil
}

func (s *store) Close() {
	if s.db != nil {
		_ = s.db.Close()
	}
}

func (s *store) listReportsByIDs(ctx context.Context, reportIDs []string, limit, offset int) ([]report, error) {
	if len(reportIDs) == 0 {
		return []report{}, nil
	}

	placeholders := make([]string, len(reportIDs))
	args := make([]any, 0, len(reportIDs)+2)
	for i, reportID := range reportIDs {
		placeholders[i] = fmt.Sprintf("$%d", i+1)
		args = append(args, reportID)
	}
	args = append(args, limit, offset)

	query := `
		SELECT
			id,
			brand_name,
			competitor_names,
			models,
			keywords,
			regions,
			languages,
			prompt_templates,
			status,
			user_id,
			occurred_at,
			created_at,
			updated_at
		FROM reports
		WHERE id IN (` + strings.Join(placeholders, ",") + `)
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprint(len(args)-1) + ` OFFSET $` + fmt.Sprint(len(args))

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, fmt.Errorf("query reports by ids: %w", err)
	}
	defer rows.Close()

	result := make([]report, 0)
	for rows.Next() {
		var rep report
		var userID sql.NullString
		if err := rows.Scan(
			&rep.ID,
			&rep.BrandName,
			pq.Array(&rep.CompetitorNames),
			pq.Array(&rep.Models),
			pq.Array(&rep.Keywords),
			pq.Array(&rep.Regions),
			pq.Array(&rep.Languages),
			pq.Array(&rep.PromptTemplates),
			&rep.Status,
			&userID,
			&rep.OccurredAt,
			&rep.CreatedAt,
			&rep.UpdatedAt,
		); err != nil {
			return nil, fmt.Errorf("scan report by ids: %w", err)
		}
		if userID.Valid {
			value := userID.String
			rep.UserID = &value
		}
		result = append(result, rep)
	}

	return result, rows.Err()
}

func (s *store) getReport(ctx context.Context, reportID string) (report, bool, error) {
	var rep report
	var userID sql.NullString
	err := s.db.QueryRowContext(ctx, `
		SELECT
			id,
			brand_name,
			competitor_names,
			models,
			keywords,
			regions,
			languages,
			prompt_templates,
			status,
			user_id,
			occurred_at,
			created_at,
			updated_at
		FROM reports
		WHERE id = $1
	`, reportID).Scan(
		&rep.ID,
		&rep.BrandName,
		pq.Array(&rep.CompetitorNames),
		pq.Array(&rep.Models),
		pq.Array(&rep.Keywords),
		pq.Array(&rep.Regions),
		pq.Array(&rep.Languages),
		pq.Array(&rep.PromptTemplates),
		&rep.Status,
		&userID,
		&rep.OccurredAt,
		&rep.CreatedAt,
		&rep.UpdatedAt,
	)
	if err == sql.ErrNoRows {
		return report{}, false, nil
	}
	if err != nil {
		return report{}, false, fmt.Errorf("query report: %w", err)
	}
	if userID.Valid {
		value := userID.String
		rep.UserID = &value
	}

	return rep, true, nil
}

func (s *store) listLLMResponses(ctx context.Context, reportID string, filters map[string]string, limit, offset int) (listLLMResponsesResult, error) {
	whereClause, args := buildResponseWhereClause(reportID, filters)
	args = append(args, limit, offset)

	query := `
		SELECT
			id,
			report_id,
			prompt_template,
			region,
			language_code,
			keyword,
			model,
			prompt_text,
			COALESCE(response, ''),
			COALESCE(kpis, '{}'::jsonb)::text,
			status,
			error_message,
			created_at,
			updated_at,
			completed_at
		FROM llm_responses
		` + whereClause + `
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprint(len(args)-1) + ` OFFSET $` + fmt.Sprint(len(args))

	rows, err := s.db.QueryContext(ctx, query, args...)
	if err != nil {
		return listLLMResponsesResult{}, fmt.Errorf("query llm responses: %w", err)
	}
	defer rows.Close()

	responses := make([]llmResponse, 0)
	for rows.Next() {
		var item llmResponse
		var kpiRaw string
		var errMessage sql.NullString
		if err := rows.Scan(
			&item.ID,
			&item.ReportID,
			&item.PromptTemplate,
			&item.Region,
			&item.LanguageCode,
			&item.Keyword,
			&item.Model,
			&item.PromptText,
			&item.Response,
			&kpiRaw,
			&item.Status,
			&errMessage,
			&item.CreatedAt,
			&item.UpdatedAt,
			&item.CompletedAt,
		); err != nil {
			return listLLMResponsesResult{}, fmt.Errorf("scan llm response: %w", err)
		}
		if errMessage.Valid {
			value := errMessage.String
			item.ErrorMessage = &value
		}
		item.KPIs = parseKPI(kpiRaw)
		responses = append(responses, item)
	}
	if err := rows.Err(); err != nil {
		return listLLMResponsesResult{}, fmt.Errorf("iterate llm responses: %w", err)
	}

	return listLLMResponsesResult{
		Responses: responses,
		Metadata: responseMeta{
			Limit:          limit,
			Offset:         offset,
			AppliedFilters: filters,
		},
	}, nil
}

func (s *store) getKPIs(ctx context.Context, reportID string, filters map[string]string, limit, offset int, aggregateBy string) (kpiResponse, error) {
	whereClause, args := buildResponseWhereClause(reportID, filters)

	countQuery := `SELECT count(*) FROM llm_responses ` + whereClause
	var total int
	if err := s.db.QueryRowContext(ctx, countQuery, args...).Scan(&total); err != nil {
		return kpiResponse{}, fmt.Errorf("count llm responses: %w", err)
	}

	argsWithPagination := append(append([]any{}, args...), limit, offset)
	dataQuery := `
		SELECT
			COALESCE(kpis, '{}'::jsonb)::text,
			region,
			language_code,
			model,
			keyword,
			prompt_template
		FROM llm_responses
		` + whereClause + `
		ORDER BY created_at DESC
		LIMIT $` + fmt.Sprint(len(argsWithPagination)-1) + ` OFFSET $` + fmt.Sprint(len(argsWithPagination))

	rows, err := s.db.QueryContext(ctx, dataQuery, argsWithPagination...)
	if err != nil {
		return kpiResponse{}, fmt.Errorf("query kpis: %w", err)
	}
	defer rows.Close()

	if aggregateBy == "" || aggregateBy == "none" {
		agg := newKPIData()
		for rows.Next() {
			var kpiRaw, region, language, model, keyword, promptTemplate string
			if err := rows.Scan(&kpiRaw, &region, &language, &model, &keyword, &promptTemplate); err != nil {
				return kpiResponse{}, fmt.Errorf("scan kpi row: %w", err)
			}
			mergeKPI(&agg, parseKPI(kpiRaw))
		}
		if err := rows.Err(); err != nil {
			return kpiResponse{}, err
		}

		return kpiResponse{
			Metadata: kpiMeta{
				TotalResponsesAggregated: total,
				Limit:                    limit,
				Offset:                   offset,
				AppliedFilters:           filters,
			},
			KPIs: agg,
		}, nil
	}

	allowed := map[string]bool{
		"region":          true,
		"language_code":   true,
		"model":           true,
		"keyword":         true,
		"prompt_template": true,
	}
	if !allowed[aggregateBy] {
		aggregateBy = "none"
	}

	grouped := make(map[string]kpiData)
	for rows.Next() {
		var kpiRaw, region, language, model, keyword, promptTemplate string
		if err := rows.Scan(&kpiRaw, &region, &language, &model, &keyword, &promptTemplate); err != nil {
			return kpiResponse{}, fmt.Errorf("scan grouped kpi row: %w", err)
		}
		key := pickGroupKey(aggregateBy, region, language, model, keyword, promptTemplate)
		item, ok := grouped[key]
		if !ok {
			item = newKPIData()
		}
		mergeKPI(&item, parseKPI(kpiRaw))
		grouped[key] = item
	}
	if err := rows.Err(); err != nil {
		return kpiResponse{}, err
	}

	return kpiResponse{
		Metadata: kpiMeta{
			TotalResponsesAggregated: total,
			Limit:                    limit,
			Offset:                   offset,
			AppliedFilters:           filters,
			AggregatedBy:             aggregateBy,
		},
		KPIs: grouped,
	}, nil
}

func buildResponseWhereClause(reportID string, filters map[string]string) (string, []any) {
	clauses := []string{"report_id = $1"}
	args := []any{reportID}

	index := 2
	for _, key := range []string{"region", "language_code", "model", "keyword", "prompt_template", "status"} {
		if value := strings.TrimSpace(filters[key]); value != "" {
			clauses = append(clauses, key+" = $"+fmt.Sprint(index))
			args = append(args, value)
			index++
		}
	}

	return "WHERE " + strings.Join(clauses, " AND "), args
}

func parseKPI(raw string) responseKPI {
	k := responseKPI{CompetitorMentions: map[string]bool{}}
	_ = json.Unmarshal([]byte(raw), &k)
	if k.CompetitorMentions == nil {
		k.CompetitorMentions = map[string]bool{}
	}
	return k
}

func newKPIData() kpiData {
	return kpiData{
		TotalResponses:        0,
		BrandMentioned:        0,
		BrandCitationWithLink: 0,
		CompetitorMentions:    map[string]int{},
	}
}

func mergeKPI(target *kpiData, source responseKPI) {
	target.TotalResponses++
	if source.BrandMentioned {
		target.BrandMentioned++
	}
	if source.BrandCitationWithLink {
		target.BrandCitationWithLink++
	}
	for name, mentioned := range source.CompetitorMentions {
		if mentioned {
			target.CompetitorMentions[name]++
		}
	}
}

func pickGroupKey(aggregateBy, region, language, model, keyword, promptTemplate string) string {
	switch aggregateBy {
	case "region":
		return region
	case "language_code":
		return language
	case "model":
		return model
	case "keyword":
		return keyword
	case "prompt_template":
		return promptTemplate
	default:
		return "all"
	}
}
