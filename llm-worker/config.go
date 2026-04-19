package main

type config struct {
	NATSURL             string `env:"NATS_URL,required"`
	NATSStream          string `env:"NATS_STREAM,required"`
	NATSDurable         string `env:"NATS_CONSUMER,required"`
	NATSConsumeSubject  string `env:"NATS_CONSUME_SUBJECT,required"`
	NATSResultSubject   string `env:"NATS_RESULT_SUBJECT,required"`
	NATSErrorSubject    string `env:"NATS_ERROR_SUBJECT,required"`
	HuggingFaceAPIURL   string `env:"HUGGINGFACE_API_URL,default=https://router.huggingface.co/v1/chat/completions"`
	HuggingFaceAPIToken string `env:"HUGGINGFACE_API_TOKEN,required"`
}
