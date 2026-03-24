package main

import "os"

type config struct {
	NATSURL            string
	NATSStream         string
	NATSDurable        string
	NATSConsumeSubject string
	PostgresHost       string
	PostgresPort       string
	PostgresDB         string
	PostgresUser       string
	PostgresPassword   string
	PostgresSSLMode    string
}

func loadConfig() config {
	natsURL := os.Getenv("NATS_URL")
	if natsURL == "" {
		natsURL = "nats://localhost:4222"
	}

	natsStream := os.Getenv("NATS_STREAM")
	if natsStream == "" {
		natsStream = "REPORTS"
	}

	natsDurable := os.Getenv("NATS_CONSUMER")
	if natsDurable == "" {
		natsDurable = "report-consumer-reports-writer"
	}

	natsConsumeSubject := os.Getenv("NATS_CONSUME_SUBJECT")
	if natsConsumeSubject == "" {
		natsConsumeSubject = "reports.creation.requested"
	}

	postgresHost := os.Getenv("POSTGRES_HOST")
	if postgresHost == "" {
		postgresHost = "localhost"
	}

	postgresPort := os.Getenv("POSTGRES_PORT")
	if postgresPort == "" {
		postgresPort = "5432"
	}

	postgresDB := os.Getenv("POSTGRES_DB")
	if postgresDB == "" {
		postgresDB = "geometrics"
	}

	postgresUser := os.Getenv("POSTGRES_USER")
	if postgresUser == "" {
		postgresUser = "geometrics"
	}

	postgresSSLMode := os.Getenv("POSTGRES_SSLMODE")
	if postgresSSLMode == "" {
		postgresSSLMode = "disable"
	}

	return config{
		NATSURL:            natsURL,
		NATSStream:         natsStream,
		NATSDurable:        natsDurable,
		NATSConsumeSubject: natsConsumeSubject,
		PostgresHost:       postgresHost,
		PostgresPort:       postgresPort,
		PostgresDB:         postgresDB,
		PostgresUser:       postgresUser,
		PostgresPassword:   os.Getenv("POSTGRES_PASSWORD"),
		PostgresSSLMode:    postgresSSLMode,
	}
}
