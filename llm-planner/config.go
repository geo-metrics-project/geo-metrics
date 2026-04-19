package main

type config struct {
	NATSURL            string `env:"NATS_URL,required"`
	NATSStream         string `env:"NATS_STREAM,required"`
	NATSDurable        string `env:"NATS_CONSUMER,required"`
	NATSConsumeSubject string `env:"NATS_CONSUME_SUBJECT,required"`
	NATSJobSubject     string `env:"NATS_JOB_SUBJECT,required"`
}
