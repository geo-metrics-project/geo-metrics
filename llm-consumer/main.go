package main

import (
	"context"
	"log"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	cfg, err := loadConfig()
	if err != nil {
		log.Fatalf("failed to load config: %v", err)
	}

	repo, err := newRepository(cfg)
	if err != nil {
		log.Fatalf("failed to initialize database repository: %v", err)
	}
	defer repo.Close()

	consumer, err := newConsumer(cfg, repo)
	if err != nil {
		log.Fatalf("failed to initialize consumer: %v", err)
	}
	defer consumer.Close()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	go func() {
		if err := consumer.Run(ctx); err != nil {
			log.Printf("consumer stopped with error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop

	cancel()
	log.Print("llm-consumer shutting down")
}
