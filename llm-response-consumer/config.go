package main

type config struct {
	NATSURL            string `env:"NATS_URL,required"`
	NATSStream         string `env:"NATS_STREAM,required"`
	NATSDurable        string `env:"NATS_CONSUMER,required"`
	NATSConsumeSubject string `env:"NATS_CONSUME_SUBJECT,required"`
	PostgresHost       string `env:"POSTGRES_HOST,required"`
	PostgresPort       string `env:"POSTGRES_PORT,required"`
	PostgresDB         string `env:"POSTGRES_DB,required"`
	PostgresUser       string `env:"POSTGRES_USER,required"`
	PostgresPassword   string `env:"POSTGRES_PASSWORD,required"`
	PostgresSSLMode    string `env:"POSTGRES_SSLMODE,required"`
}
