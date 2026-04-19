package main

type translationJobCreatedEvent struct {
	EventID       string                `json:"event_id"`
	EventType     string                `json:"event_type"`
	OccurredAt    string                `json:"occurred_at"`
	Source        string                `json:"source"`
	CorrelationID string                `json:"correlation_id"`
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
	Models         []string `json:"models"`
	Regions        []string `json:"regions"`
}

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
	PromptTemplate string `json:"prompt_template"`
	Keyword        string `json:"keyword"`
	TargetLanguage string `json:"target_language"`
	SourceText     string `json:"source_text"`
	TranslatedText string `json:"translated_text"`
	Models         []string `json:"models"`
	Regions        []string `json:"regions"`
}

type translationFailedEvent struct {
	EventID       string                   `json:"event_id"`
	EventType     string                   `json:"event_type"`
	OccurredAt    string                   `json:"occurred_at"`
	Source        string                   `json:"source"`
	CorrelationID string                   `json:"correlation_id"`
	ReportID      string                   `json:"report_id"`
	JobID         string                   `json:"job_id"`
	SourceEventID string                   `json:"source_event_id"`
	Payload       translationFailedPayload `json:"payload"`
}

type translationFailedPayload struct {
	PromptTemplate string `json:"prompt_template"`
	Keyword        string `json:"keyword"`
	TargetLanguage string `json:"target_language"`
	SourceText     string `json:"source_text"`
	ErrorMessage   string `json:"error_message"`
	Models         []string `json:"models"`
	Regions        []string `json:"regions"`
}

type libreTranslateRequest struct {
	Q      string `json:"q"`
	Source string `json:"source"`
	Target string `json:"target"`
	Format string `json:"format"`
	APIKey string `json:"api_key,omitempty"`
}

type libreTranslateResponse struct {
	TranslatedText string `json:"translatedText"`
	Error          string `json:"error"`
}
