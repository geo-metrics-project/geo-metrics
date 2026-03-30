package main

import (
	"bytes"
	"context"
	"crypto/rand"
	"encoding/hex"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"strings"
	"sync"
	"text/template"
	"time"

	"github.com/nats-io/nats.go"
)

type llmConsumer struct {
	conn           *nats.Conn
	js             nats.JetStreamContext
	hfClient       *huggingFaceClient
	stream         string
	durable        string
	subject        string
	publishSubject string
	maxConcurrency int
	nakDelay       time.Duration
	templateCache  sync.Map
}

func newLLMConsumer(cfg config, hfClient *huggingFaceClient) (*llmConsumer, error) {
	conn, err := nats.Connect(
		cfg.NATSURL,
		nats.Name("llm-service"),
		nats.Timeout(5*time.Second),
		nats.ReconnectWait(2*time.Second),
		nats.MaxReconnects(-1),
	)
	if err != nil {
		return nil, fmt.Errorf("connect to nats: %w", err)
	}

	js, err := conn.JetStream()
	if err != nil {
		conn.Close()
		return nil, fmt.Errorf("jetstream context: %w", err)
	}

	return &llmConsumer{
		conn:           conn,
		js:             js,
		hfClient:       hfClient,
		stream:         cfg.NATSStream,
		durable:        cfg.NATSDurable,
		subject:        cfg.NATSConsumeSubject,
		publishSubject: cfg.NATSPublishSubject,
		maxConcurrency: cfg.MaxConcurrency,
		nakDelay:       cfg.NATSNakDelay,
	}, nil
}

func (c *llmConsumer) Close() error {
	if c.conn != nil {
		c.conn.Close()
	}
	return nil
}

func (c *llmConsumer) Run(ctx context.Context) error {
	sub, err := c.js.PullSubscribe(
		c.subject,
		c.durable,
		nats.BindStream(c.stream),
		nats.AckExplicit(),
	)
	if err != nil {
		return fmt.Errorf("create pull subscription: %w", err)
	}

	log.Printf("llm-service consumer started stream=%s subject=%s durable=%s", c.stream, c.subject, c.durable)

	for {
		select {
		case <-ctx.Done():
			return nil
		default:
		}

		msgs, err := sub.Fetch(c.maxConcurrency, nats.MaxWait(2*time.Second))
		if err != nil {
			if errors.Is(err, nats.ErrTimeout) {
				continue
			}
			if ctx.Err() != nil {
				return nil
			}
			log.Printf("fetch error: %v", err)
			time.Sleep(time.Second)
			continue
		}

		for _, msg := range msgs {
			if err := c.handleMessage(ctx, msg); err != nil {
				log.Printf("message handling error: %v", err)
			}
		}
	}
}

func (c *llmConsumer) handleMessage(ctx context.Context, msg *nats.Msg) error {
	var evt reportCreatedEvent
	if err := json.Unmarshal(msg.Data, &evt); err != nil {
		msg.Ack()
		return fmt.Errorf("decode event: %w", err)
	}

	// Validate event
	if strings.TrimSpace(evt.EventID) == "" || strings.TrimSpace(evt.ReportID) == "" {
		msg.Ack()
		return errors.New("invalid event: event_id and report_id are required")
	}
	if err := validatePayload(evt.Payload); err != nil {
		msg.Ack()
		return fmt.Errorf("invalid payload for report=%s: %w", evt.ReportID, err)
	}

	log.Printf("processing report=%s with event=%s", evt.ReportID, evt.EventID)

	// Start processing all combinations
	if err := c.processReportCombinations(ctx, evt); err != nil {
		log.Printf("error processing combinations for report=%s: %v", evt.ReportID, err)
		msg.NakWithDelay(c.maxNakDelay())
		return err
	}

	msg.Ack()
	return nil
}

func (c *llmConsumer) processReportCombinations(ctx context.Context, evt reportCreatedEvent) error {
	tasks := c.generateTasks(evt)
	log.Printf("generated %d llm tasks for report=%s", len(tasks), evt.ReportID)

	semaphore := make(chan struct{}, c.maxConcurrency)
	errCh := make(chan error, len(tasks))
	var wg sync.WaitGroup

	for _, task := range tasks {
		semaphore <- struct{}{}
		wg.Add(1)
		go func(t llmPromptTask) {
			defer wg.Done()
			defer func() { <-semaphore }()

			prompt, err := c.buildPrompt(t, evt.Payload.BrandName)
			if err != nil {
				if errPublish := c.publishLLMResponse(ctx, t, "", "", fmt.Sprintf("build prompt: %v", err)); errPublish != nil {
					errCh <- errPublish
				}
				return
			}
			log.Printf("processing task: model=%s keyword=%s region=%s language=%s", t.Model, t.Keyword, t.Region, t.LanguageCode)

			response, err := c.hfClient.inferBrandAwareness(ctx, prompt)
			if err != nil {
				log.Printf("inference error for task: %v", err)
				if errPublish := c.publishLLMResponse(ctx, t, prompt, "", err.Error()); errPublish != nil {
					errCh <- errPublish
				}
				return
			}

			if errPublish := c.publishLLMResponse(ctx, t, prompt, response, ""); errPublish != nil {
				log.Printf("publish error: %v", errPublish)
				errCh <- errPublish
				return
			}
		}(task)
	}

	wg.Wait()
	close(errCh)
	errList := make([]error, 0, len(tasks))
	for err := range errCh {
		if err != nil {
			errList = append(errList, err)
		}
	}

	log.Printf("report=%s task processing complete", evt.ReportID)
	return errors.Join(errList...)
}

func (c *llmConsumer) publishLLMResponse(ctx context.Context, task llmPromptTask, promptText, response, errMsg string) error {
	eventID, err := newEventID()
	if err != nil {
		return fmt.Errorf("generate event id: %w", err)
	}

	importEvent := llmResponseEvent{
		EventID:        eventID,
		EventType:      "llm.response",
		OccurredAt:     time.Now().Format(time.RFC3339),
		Source:         "llm-service",
		ReportID:       task.ReportID,
		SourceEventID:  task.SourceEventID,
		PromptTemplate: task.PromptTemplate,
		Region:         task.Region,
		LanguageCode:   task.LanguageCode,
		Keyword:        task.Keyword,
		Model:          task.Model,
		PromptText:     promptText,
		Response:       response,
		ErrorMessage:   errMsg,
	}

	payload, err := json.Marshal(importEvent)
	if err != nil {
		return fmt.Errorf("marshal llm response: %w", err)
	}

	_, err = c.js.Publish(c.publishSubject, payload)
	if err != nil {
		return fmt.Errorf("publish llm response: %w", err)
	}

	return nil
}

func (c *llmConsumer) generateTasks(evt reportCreatedEvent) []llmPromptTask {
	var tasks []llmPromptTask

	payload := evt.Payload
	for _, model := range payload.Models {
		for _, template := range payload.PromptTemplates {
			for _, region := range payload.Regions {
				for _, language := range payload.Languages {
					for _, keyword := range payload.Keywords {
						tasks = append(tasks, llmPromptTask{
							ReportID:       evt.ReportID,
							SourceEventID:  evt.EventID,
							BrandName:      payload.BrandName,
							PromptTemplate: template,
							Region:         region,
							LanguageCode:   language,
							Keyword:        keyword,
							Model:          model,
							OccurredAt:     evt.OccurredAt,
						})
					}
				}
			}
		}
	}

	return tasks
}

func (c *llmConsumer) buildPrompt(task llmPromptTask, brandName string) (string, error) {
	const defaultTemplate = `You are a market research assistant focused on brand awareness analysis.

Task: Evaluate awareness of the brand "{{.BrandName}}" in the context of "{{.Keyword}}" in {{.Region}} (Language: {{.LanguageCode}})

Based on your knowledge, provide:
1. Whether you know about this brand
2. Key characteristics or market position
3. Geographic presence in {{.Region}}
4. Reputation or market relevance

Please provide a concise analysis.`

	tmplText := strings.TrimSpace(task.PromptTemplate)
	if tmplText == "" {
		tmplText = defaultTemplate
	}

	tmplAny, ok := c.templateCache.Load(tmplText)
	var tmpl *template.Template
	if ok {
		tmpl = tmplAny.(*template.Template)
	} else {
		parsed, err := template.New("prompt").Option("missingkey=zero").Parse(tmplText)
		if err != nil {
			return "", err
		}
		tmpl = parsed
		c.templateCache.Store(tmplText, parsed)
	}

	data := struct {
		BrandName    string
		Keyword      string
		Region       string
		LanguageCode string
		Model        string
	}{
		BrandName:    brandName,
		Keyword:      task.Keyword,
		Region:       task.Region,
		LanguageCode: task.LanguageCode,
		Model:        task.Model,
	}

	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}

	return buf.String(), nil
}

func newEventID() (string, error) {
	b := make([]byte, 12)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	return "llm_" + hex.EncodeToString(b), nil
}

func (c *llmConsumer) maxNakDelay() time.Duration {
	if c.nakDelay <= 0 {
		return 5 * time.Second
	}
	return c.nakDelay
}

func validatePayload(payload createReportPayload) error {
	if strings.TrimSpace(payload.BrandName) == "" {
		return errors.New("brand_name is required")
	}
	if len(payload.Models) == 0 {
		return errors.New("models must not be empty")
	}
	if len(payload.Keywords) == 0 {
		return errors.New("keywords must not be empty")
	}
	if len(payload.Regions) == 0 {
		return errors.New("regions must not be empty")
	}
	if len(payload.Languages) == 0 {
		return errors.New("languages must not be empty")
	}
	if len(payload.PromptTemplates) == 0 {
		return errors.New("prompt_templates must not be empty")
	}
	return nil
}
