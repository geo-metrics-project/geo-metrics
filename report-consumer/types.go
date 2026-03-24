package main

type createReportRequest struct {
	BrandName       string   `json:"brand_name"`
	CompetitorNames []string `json:"competitor_names"`
	Models          []string `json:"models"`
	Keywords        []string `json:"keywords"`
	Regions         []string `json:"regions"`
	Languages       []string `json:"languages"`
	PromptTemplates []string `json:"prompt_templates"`
}

type reportCreationRequestedEvent struct {
	EventID    string              `json:"event_id"`
	EventType  string              `json:"event_type"`
	OccurredAt string              `json:"occurred_at"`
	Source     string              `json:"source"`
	UserID     string              `json:"user_id,omitempty"`
	ReportID   string              `json:"report_id"`
	Payload    createReportRequest `json:"payload"`
}
