package main

import "os"

type config struct {
	Port        string
	NATSURL     string
	NATSSubject string
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

	return config{
		Port:        port,
		NATSURL:     natsURL,
		NATSSubject: natsSubject,
	}
}
