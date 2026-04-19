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

	planner, err := newTranslationPlanner(cfg)
	if err != nil {
		log.Fatalf("failed to initialize translation planner: %v", err)
	}
	defer planner.Close()

	runCtx, cancel := context.WithCancel(ctx)
	defer cancel()

	go func() {
		if err := planner.Run(runCtx); err != nil {
			log.Printf("translation planner stopped with error: %v", err)
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, syscall.SIGINT, syscall.SIGTERM)
	<-stop
	log.Print("translation-planner shutting down")
}
