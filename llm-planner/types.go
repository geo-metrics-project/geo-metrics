package main

type translationCompletedEvent struct {
	EventID       string                      `json:"event_id"`
	EventType     string                      `json:"event_type"`
	OccurredAt    string                      `json:"occurred_at"`
	Source        string                      `json:"source"`
	CorrelationID string                      `json:"correlation_id"`
	ReportID      string                      `json:"report_id"`
	JobID         string                      `json:"job_id"`
	SourceEventID string                      `json:"source_event_id"`
	Payload       translationCompletedPayload `json:"payload"`
}

type translationCompletedPayload struct {
	PromptTemplate string   `json:"prompt_template"`
	Keyword        string   `json:"keyword"`
	TargetLanguage string   `json:"target_language"`
	SourceText     string   `json:"source_text"`
	TranslatedText string   `json:"translated_text"`
	Models         []string `json:"models"`
	Regions        []string `json:"regions"`
}

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
