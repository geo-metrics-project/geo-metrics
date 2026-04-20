package main

import "time"

type report struct {
	ID              string    `json:"id"`
	BrandName       string    `json:"brand_name"`
	CompetitorNames []string  `json:"competitor_names"`
	Models          []string  `json:"models"`
	Keywords        []string  `json:"keywords"`
	Regions         []string  `json:"regions"`
	Languages       []string  `json:"languages"`
	PromptTemplates []string  `json:"prompt_templates"`
	Status          string    `json:"status"`
	UserID          *string   `json:"user_id,omitempty"`
	OccurredAt      time.Time `json:"occurred_at"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type llmResponse struct {
	ID             int64       `json:"id"`
	ReportID       string      `json:"report_id"`
	PromptTemplate string      `json:"prompt_template"`
	Region         string      `json:"region"`
	LanguageCode   string      `json:"language_code"`
	Keyword        string      `json:"keyword"`
	Model          string      `json:"model"`
	PromptText     string      `json:"prompt_text"`
	Response       string      `json:"response"`
	KPIs           responseKPI `json:"kpis"`
	Status         string      `json:"status"`
	ErrorMessage   *string     `json:"error_message,omitempty"`
	CreatedAt      time.Time   `json:"created_at"`
	UpdatedAt      time.Time   `json:"updated_at"`
	CompletedAt    *time.Time  `json:"completed_at,omitempty"`
}

type responseKPI struct {
	BrandMentioned        bool            `json:"brand_mentioned"`
	BrandCitationWithLink bool            `json:"brand_citation_with_link"`
	CompetitorMentions    map[string]bool `json:"competitor_mentions"`
}

type kpiData struct {
	TotalResponses        int            `json:"total_responses"`
	BrandMentioned        int            `json:"brand_mentioned"`
	BrandCitationWithLink int            `json:"brand_citation_with_link"`
	CompetitorMentions    map[string]int `json:"competitor_mentions"`
}

type listLLMResponsesResult struct {
	Responses []llmResponse `json:"responses"`
	Metadata  responseMeta  `json:"metadata"`
}

type responseMeta struct {
	Limit          int               `json:"limit"`
	Offset         int               `json:"offset"`
	AppliedFilters map[string]string `json:"applied_filters"`
}

type kpiResponse struct {
	Metadata kpiMeta `json:"metadata"`
	KPIs     any     `json:"kpis"`
}

type kpiMeta struct {
	TotalResponsesAggregated int               `json:"total_responses_aggregated,omitempty"`
	Limit                    int               `json:"limit"`
	Offset                   int               `json:"offset"`
	AppliedFilters           map[string]string `json:"applied_filters"`
	AggregatedBy             string            `json:"aggregated_by,omitempty"`
}
