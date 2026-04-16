package main

type config struct {
	Port        string `env:"PORT,required"`
	NATSURL     string `env:"NATS_URL,required"`
	NATSSubject string `env:"NATS_SUBJECT,required"`
}
