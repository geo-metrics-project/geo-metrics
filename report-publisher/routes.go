package main

import "github.com/gin-gonic/gin"

func registerRoutes(r *gin.Engine, publisher *natsPublisher) {
	r.GET("/api/health", healthHandler)
	r.POST("/api/reports/new", createReportHandler(publisher))
}
