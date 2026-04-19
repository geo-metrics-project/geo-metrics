package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"

	"github.com/sethvargo/go-envconfig"
)

func main() {
	ctx := context.Background()
	var cfg config
	if err := envconfig.Process(ctx, &cfg); err != nil {
		log.Fatal(err)
	}

	consumer, err := newLLMResponseConsumer(cfg)
	if err != nil {
		log.Fatalf("failed to initialize llm response consumer: %v", err)
	}
	defer consumer.Close()

	runCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	go func() {
		if err := consumer.Run(runCtx); err != nil {
			log.Printf("consumer stopped with error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	log.Print("llm-response-consumer shutting down")
}
