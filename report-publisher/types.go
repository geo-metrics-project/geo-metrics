package main

type createReportRequest struct {
	BrandName       string   `json:"brand_name" binding:"required"`
	CompetitorNames []string `json:"competitor_names"`
	Models          []string `json:"models" binding:"required"`
	Keywords        []string `json:"keywords" binding:"required"`
	Regions         []string `json:"regions" binding:"required"`
	Languages       []string `json:"languages" binding:"required"`
	PromptTemplates []string `json:"prompt_templates" binding:"required"`
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
