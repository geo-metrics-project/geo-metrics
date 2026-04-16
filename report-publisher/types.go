package main

type createReportRequest struct {
	BrandName       string   `json:"brand_name" binding:"required"`
	CompetitorNames []string `json:"competitor_names"`
	Models          []string `json:"models" binding:"required,min=1"`
	Keywords        []string `json:"keywords" binding:"required,min=1"`
	Regions         []string `json:"regions" binding:"required,min=1"`
	Languages       []string `json:"languages" binding:"required,min=1"`
	PromptTemplates []string `json:"prompt_templates" binding:"required,min=1"`
}

type createReportResponse struct {
	ReportID  string `json:"report_id"`
	BrandName string `json:"brand_name"`
	Timestamp string `json:"timestamp"`
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
