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

	worker, err := newTranslationWorker(cfg)
	if err != nil {
		log.Fatalf("failed to initialize translation worker: %v", err)
	}
	defer worker.Close()

	runCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	go func() {
		if err := worker.Run(runCtx); err != nil {
			log.Printf("translation worker stopped with error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	log.Print("translation-worker shutting down")
}
