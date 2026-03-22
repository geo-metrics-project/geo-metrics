package main

import "os"

type config struct {
	Port        string
	NATSURL     string
	NATSSubject string
	NATSStream  string
}

func loadConfig() config {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = "nats://localhost:4222"
	}

	natsSubject := os.Getenv("NATS_SUBJECT")
	if natsSubject == "" {
		natsSubject = "reports.creation.requested"
	}

	natsStream := os.Getenv("NATS_STREAM")
	if natsStream == "" {
		natsStream = "REPORT_EVENTS"
	}

	return config{
		Port:        port,
		NATSURL:     natsURL,
		NATSSubject: natsSubject,
		NATSStream:  natsStream,
	}
}
