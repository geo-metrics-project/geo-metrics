package main

import (
	"net/http"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

func healthHandler(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok", "service": "report-query-api"})
}

func listReportsHandler(store *store) gin.HandlerFunc {
	return func(c *gin.Context) {
		limit, offset := parsePagination(c)
		reports, err := store.listReports(c.Request.Context(), limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"reports": reports, "limit": limit, "offset": offset})
	}
}

func getReportHandler(store *store) gin.HandlerFunc {
	return func(c *gin.Context) {
		reportID := strings.TrimSpace(c.Param("reportId"))
		if reportID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "reportId is required"})
			return
		}

		rep, found, err := store.getReport(c.Request.Context(), reportID)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		if !found {
			c.JSON(http.StatusNotFound, gin.H{"error": "report not found"})
			return
		}

		c.JSON(http.StatusOK, rep)
	}
}

func listLLMResponsesHandler(store *store) gin.HandlerFunc {
	return func(c *gin.Context) {
		reportID := strings.TrimSpace(c.Param("reportId"))
		if reportID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "reportId is required"})
			return
		}

		limit, offset := parsePagination(c)
		filters := parseFilters(c)

		result, err := store.listLLMResponses(c.Request.Context(), reportID, filters, limit, offset)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	}
}

func getKPIsHandler(store *store) gin.HandlerFunc {
	return func(c *gin.Context) {
		reportID := strings.TrimSpace(c.Param("reportId"))
		if reportID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "reportId is required"})
			return
		}

		limit, offset := parsePagination(c)
		filters := parseFilters(c)
		aggregateBy := strings.TrimSpace(c.Query("aggregate_by"))

		result, err := store.getKPIs(c.Request.Context(), reportID, filters, limit, offset, aggregateBy)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, result)
	}
}

func parsePagination(c *gin.Context) (int, int) {
	limit := 100
	offset := 0

	if raw := strings.TrimSpace(c.Query("limit")); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil && parsed > 0 {
			limit = parsed
		}
	}
	if raw := strings.TrimSpace(c.Query("offset")); raw != "" {
		if parsed, err := strconv.Atoi(raw); err == nil && parsed >= 0 {
			offset = parsed
		}
	}

	return limit, offset
}

func parseFilters(c *gin.Context) map[string]string {
	filters := make(map[string]string)
	for _, key := range []string{"region", "language_code", "model", "keyword", "prompt_template", "status"} {
		if value := strings.TrimSpace(c.Query(key)); value != "" {
			filters[key] = value
		}
	}
	return filters
}
