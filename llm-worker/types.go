package main

type llmJobCreatedEvent struct {
	EventID       string        `json:"event_id"`
	EventType     string        `json:"event_type"`
	OccurredAt    string        `json:"occurred_at"`
	Source        string        `json:"source"`
	CorrelationID string        `json:"correlation_id"`
	ReportID      string        `json:"report_id"`
	JobID         string        `json:"job_id"`
	SourceEventID string        `json:"source_event_id"`
	Payload       llmJobPayload `json:"payload"`
}

type llmJobPayload struct {
	TranslationJobID string `json:"translation_job_id"`
	PromptTemplate   string `json:"prompt_template"`
	Keyword          string `json:"keyword"`
	TargetLanguage   string `json:"target_language"`
	SourceText       string `json:"source_text"`
	TranslatedText   string `json:"translated_text"`
	Model            string `json:"model"`
	Region           string `json:"region"`
}

type llmCompletedEvent struct {
	EventID       string              `json:"event_id"`
	EventType     string              `json:"event_type"`
	OccurredAt    string              `json:"occurred_at"`
	Source        string              `json:"source"`
	CorrelationID string              `json:"correlation_id"`
	ReportID      string              `json:"report_id"`
	JobID         string              `json:"job_id"`
	SourceEventID string              `json:"source_event_id"`
	Payload       llmCompletedPayload `json:"payload"`
}

type llmCompletedPayload struct {
	TranslationJobID string `json:"translation_job_id"`
	PromptTemplate   string `json:"prompt_template"`
	Keyword          string `json:"keyword"`
	TargetLanguage   string `json:"target_language"`
	SourceText       string `json:"source_text"`
	TranslatedText   string `json:"translated_text"`
	Model            string `json:"model"`
	Region           string `json:"region"`
	PromptText       string `json:"prompt_text"`
	Response         string `json:"response"`
}

type llmFailedEvent struct {
	EventID       string           `json:"event_id"`
	EventType     string           `json:"event_type"`
	OccurredAt    string           `json:"occurred_at"`
	Source        string           `json:"source"`
	CorrelationID string           `json:"correlation_id"`
	ReportID      string           `json:"report_id"`
	JobID         string           `json:"job_id"`
	SourceEventID string           `json:"source_event_id"`
	Payload       llmFailedPayload `json:"payload"`
}

type llmFailedPayload struct {
	TranslationJobID string `json:"translation_job_id"`
	Model            string `json:"model"`
	Region           string `json:"region"`
	ErrorMessage     string `json:"error_message"`
}

type llmAPIRequest struct {
	Prompt       string         `json:"prompt"`
	SystemPrompt string         `json:"system_prompt"`
	Model        string         `json:"model"`
	Region       string         `json:"region"`
	Language     string         `json:"language"`
	Metadata     map[string]any `json:"metadata,omitempty"`
}

type llmAPIResponse struct {
	Response string `json:"response"`
	Output   string `json:"output"`
	Text     string `json:"text"`
	Error    string `json:"error"`
}
