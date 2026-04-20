package main

import "github.com/gin-gonic/gin"

func registerRoutes(r *gin.Engine, store *store) {
	r.GET("/api/health", healthHandler)
	r.GET("/api/reports", listReportsHandler(store))
	r.GET("/api/reports/:reportId", getReportHandler(store))
	r.GET("/api/reports/:reportId/llm-responses", listLLMResponsesHandler(store))
	r.GET("/api/reports/:reportId/kpis", getKPIsHandler(store))
}
