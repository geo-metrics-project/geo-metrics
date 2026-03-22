package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "report-publisher"})
}

func createReportHandler(publisher *natsPublisher) gin.HandlerFunc {
	return func(c *gin.Context) {
		var req createReportRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}

		resp, err := createReport(c.GetHeader("x-user-id"), req, publisher)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}

		c.JSON(http.StatusAccepted, resp)
	}
}
