package main

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
