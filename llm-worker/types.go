package main

type reportCreatedEvent struct {
	EventID    string              `json:"event_id"`
	EventType  string              `json:"event_type"`
	OccurredAt string              `json:"occurred_at"`
	Source     string              `json:"source"`
	UserID     string              `json:"user_id,omitempty"`
	ReportID   string              `json:"report_id"`
	Payload    createReportPayload `json:"payload"`
}

type createReportPayload struct {
	BrandName       string   `json:"brand_name"`
	CompetitorNames []string `json:"competitor_names"`
	Models          []string `json:"models"`
	Keywords        []string `json:"keywords"`
	Regions         []string `json:"regions"`
	Languages       []string `json:"languages"`
	PromptTemplates []string `json:"prompt_templates"`
}

type llmPromptTask struct {
	ReportID       string
	SourceEventID  string
	BrandName      string
	PromptTemplate string
	Region         string
	LanguageCode   string
	Keyword        string
	Model          string
	OccurredAt     string
}

// llmResponseEvent is published by llm-service after each API call
type llmResponseEvent struct {
	EventID        string `json:"event_id"`
	EventType      string `json:"event_type"`
	OccurredAt     string `json:"occurred_at"`
	Source         string `json:"source"`
	ReportID       string `json:"report_id"`
	SourceEventID  string `json:"source_event_id"`
	PromptTemplate string `json:"prompt_template"`
	Region         string `json:"region"`
	LanguageCode   string `json:"language_code"`
	Keyword        string `json:"keyword"`
	Model          string `json:"model"`
	PromptText     string `json:"prompt_text"`
	Response       string `json:"response,omitempty"`
	ErrorMessage   string `json:"error_message,omitempty"`
}

type huggingFaceRequest struct {
	Inputs string `json:"inputs"`
}

type huggingFaceResponse struct {
	GeneratedText string `json:"generated_text"`
}
