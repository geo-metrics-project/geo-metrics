package main

type config struct {
	NATSURL            string `env:"NATS_URL,required"`
	NATSStream         string `env:"NATS_STREAM,required"`
	NATSDurable        string `env:"NATS_CONSUMER,required"`
	NATSConsumeSubject string `env:"NATS_CONSUME_SUBJECT,required"`
	NATSResultSubject  string `env:"NATS_RESULT_SUBJECT,required"`
	NATSErrorSubject   string `env:"NATS_ERROR_SUBJECT,required"`
	LibreURL           string `env:"LIBRETRANSLATE_URL,required"`
	LibreSourceLang    string `env:"LIBRETRANSLATE_SOURCE_LANG,default=en"`
	LibreAPIKey        string `env:"LIBRETRANSLATE_API_KEY"`
}
