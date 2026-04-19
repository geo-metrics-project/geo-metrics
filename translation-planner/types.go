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

type translationJobsPlannedEvent struct {
	EventID       string `json:"event_id"`
	EventType     string `json:"event_type"`
	OccurredAt    string `json:"occurred_at"`
	Source        string `json:"source"`
	Correlation   string `json:"correlation_id"`
	ReportID      string `json:"report_id"`
	TotalJobs     int    `json:"total_jobs"`
	SourceEventID string `json:"source_event_id"`
}

type translationJobCreatedEvent struct {
	EventID       string                `json:"event_id"`
	EventType     string                `json:"event_type"`
	OccurredAt    string                `json:"occurred_at"`
	Source        string                `json:"source"`
	Correlation   string                `json:"correlation_id"`
	ReportID      string                `json:"report_id"`
	JobID         string                `json:"job_id"`
	SourceEventID string                `json:"source_event_id"`
	Payload       translationJobPayload `json:"payload"`
}

type translationJobPayload struct {
	PromptTemplate string `json:"prompt_template"`
	Keyword        string `json:"keyword"`
	TargetLanguage string `json:"target_language"`
	SourceLanguage string `json:"source_language"`
	SourceText     string `json:"source_text"`
}
