import os
from fastapi import APIRouter, Request
from typing import List
import httpx
from pydantic import BaseModel, Field
from .proxy import proxy_request

router = APIRouter(prefix="/reports", tags=["reports"])

REPORT_SERVICE_URL = os.getenv("REPORT_SERVICE_URL", "http://report-service:8080")

# Define AnalyzeRequest and AnalyzeResponse for docs
class AnalyzeRequest(BaseModel):
    brand_name: str = Field(..., description="Brand name to analyze")
    models: List[str] = Field(..., description="LLM models to query")
    keywords: List[str] = Field(..., description="Keywords to query")
    regions: List[str] = Field(..., description="Region contexts")
    languages: List[str] = Field(..., description="Language codes (use 'default' for original prompts, or language codes like 'es', 'fr')")
    prompt_templates: List[str] = Field(..., description="Prompt templates with {keyword} placeholder")
    user_id: int = Field(..., description="User ID")

class AnalyzeResponse(BaseModel):
    report_id: int
    brand_name: str
    timestamp: str
    total_queries: int
    successful_queries: int
    failed_queries: int

@router.get("/health")
async def report_health(request: Request):
    """Check report service health"""
    target_url = f"{REPORT_SERVICE_URL}/api/health"
    return await proxy_request(request, target_url)

@router.get("")
async def list_reports(request: Request):
    """List all reports"""
    target_url = f"{REPORT_SERVICE_URL}/api/reports"
    return await proxy_request(request, target_url)

@router.get("/{report_id}")
async def get_report(report_id: int, request: Request):
    """Get a specific report"""
    target_url = f"{REPORT_SERVICE_URL}/api/reports/{report_id}"
    return await proxy_request(request, target_url)

@router.delete("/{report_id}")
async def delete_report(report_id: int, request: Request):
    """Delete a report"""
    target_url = f"{REPORT_SERVICE_URL}/api/reports/{report_id}"
    return await proxy_request(request, target_url)

@router.get("/{report_id}/llm-responses")
async def get_report_llm_responses(report_id: int, request: Request):
    """Get report LLM responses"""
    target_url = f"{REPORT_SERVICE_URL}/api/reports/{report_id}/llm-responses"
    return await proxy_request(request, target_url)

@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_brand(request: AnalyzeRequest):
    """Analyze brand visibility across LLM providers (proxied to report-service)"""
    import httpx
    target_url = f"{REPORT_SERVICE_URL}/api/analyze"
    async with httpx.AsyncClient() as client:
        resp = await client.post(target_url, json=request.dict())
        resp.raise_for_status()
        return resp.json()