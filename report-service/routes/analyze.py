import os
import logging
import httpx
import asyncio
from fastapi import APIRouter, Header, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from database import get_db
from services.report_generator import ReportGenerator
from clients.keto_client import create_owner_relationship

logger = logging.getLogger(__name__)
LLM_SERVICE_URL = os.getenv("LLM_SERVICE_URL", "http://llm-service:8081")

router = APIRouter(prefix="/analyze", tags=["analysis"])

class LLMResponseData(BaseModel):
    model: str = Field(..., description="Model used for the query")
    keyword: str = Field(..., description="Keyword that was queried")
    language_code: str = Field(..., description="Language code used")
    region: str = Field(..., description="Region context used")
    prompt_template: str = Field(..., description="Prompt template used")
    prompt_text: str = Field(..., description="Full prompt text sent to the model")
    response: str = Field(..., description="Response from the LLM")

class AnalyzeRequest(BaseModel):
    brand_name: str = Field(..., description="Brand name to analyze")
    competitor_names: Optional[List[str]] = Field(default=None, description="List of competitor brand names for share of voice calculation")
    models: List[str] = Field(default=["meta-llama/Llama-3.1-8B-Instruct"], description="LLM models to query")
    keywords: List[str] = Field(..., description="Keywords to query")
    regions: List[str] = Field(default=["Global"], description="Region contexts")
    languages: List[str] = Field(
        default=["default"],
        description="Language codes (use 'default' for original prompts, or language codes like 'es', 'fr')"
    )
    prompt_templates: List[str] = Field(
        default=["What do you know about {keyword}? What brands come to your mind when you think of {keyword}?"],
        description="List of prompt templates with {keyword} placeholder"
    )

class AnalyzeResponse(BaseModel):
    report_id: int
    brand_name: str
    timestamp: str
    total_queries: int
    successful_queries: int
    failed_queries: int

async def translate_prompt(client: httpx.AsyncClient, prompt: str, target_lang: str) -> str:
    """Translate using the shared httpx client"""
    if target_lang == "default":
        return prompt
    
    try:
        url = "https://translate.googleapis.com/translate_a/single"
        params = {
            "client": "gtx",
            "sl": "auto",
            "tl": target_lang,
            "dt": "t",
            "q": prompt
        }
        
        response = await client.get(url, params=params, timeout=30.0)
        
        if response.status_code == 200:
            result = response.json()
            translated = "".join([item[0] for item in result[0] if item[0]])
            logger.info(f"Translated to {target_lang}: '{prompt[:30]}...' -> '{translated[:30]}...'")
            return translated
        else:
            logger.error(f"Translation API failed with status {response.status_code}")
            return prompt
    except Exception as e:
        logger.error(f"Translation to {target_lang} failed: {e}")
        return prompt

async def query_llm(client: httpx.AsyncClient, model: str, prompt: str, region: Optional[str]):
    """Query a single LLM model"""
    try:
        payload = {"model": model, "prompt": prompt}
        if region and region != "Global":
            payload["region"] = region
            
        response = await client.post(f"{LLM_SERVICE_URL}/api/query", json=payload, timeout=600.0)
        
        if response.status_code != 200:
            logger.error(f"LLM query failed: {model} - {response.text}")
            return {"success": False, "model": model, "prompt_text": prompt}
        
        data = response.json()
        return {
            "success": True,
            "model": model,
            "prompt_text": prompt,
            "response": data.get("response", "")
        }
    except Exception as e:
        logger.error(f"Error querying {model}: {e}")
        return {"success": False, "model": model, "prompt_text": prompt}

async def translate_and_query(client: httpx.AsyncClient, model: str, prompt: str, target_lang: str, region: Optional[str]):
    """Translate prompt and query LLM in a single async task"""
    translated_prompt = await translate_prompt(client, prompt, target_lang)  # Pass client
    result = await query_llm(client, model, translated_prompt, region)
    return result, translated_prompt

@router.post("", response_model=AnalyzeResponse)
async def analyze_brand(
    request: AnalyzeRequest,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    """Analyze brand visibility across LLM providers and creates a report."""
    logger.info(
        f"Analyzing {request.brand_name}: "
        f"{len(request.models)} models"
        f"{len(request.keywords)} keywords"
        f"{len(request.prompt_templates)} templates"
        f"{len(request.languages)} languages"
        f"{len(request.regions)} regions"
    )
    
    # Step 1: Build jobs with translation + query tasks
    job_specs = []
    for region in request.regions:
        for language in request.languages:
            for prompt_template in request.prompt_templates:
                for keyword in request.keywords:
                    prompt = prompt_template.format(keyword=keyword)
                    for model in request.models:
                        job_specs.append({
                            "model": model,
                            "keyword": keyword,
                            "language_code": language,
                            "region": region,
                            "prompt": prompt,
                            "prompt_template": prompt_template
                        })

    # Step 2: Run translation + query concurrently
    async with httpx.AsyncClient(
        timeout=600.0,
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20)
    ) as client:
        tasks = [
            translate_and_query(
                client, 
                job["model"], 
                job["prompt"], 
                job["language_code"], 
                job["region"]
            )
            for job in job_specs
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Step 3: Build LLMResponseData only for successful queries
    llm_responses = []
    for job, result in zip(job_specs, results):
        if isinstance(result, tuple):
            query_result, translated_prompt = result
            if isinstance(query_result, dict) and query_result.get("success"):
                llm_responses.append(
                    LLMResponseData(
                        model=job["model"],
                        keyword=job["keyword"],
                        language_code=job["language_code"],
                        region=job["region"],
                        prompt_template=job["prompt_template"],
                        prompt_text=translated_prompt,
                        response=query_result.get("response", "")
                    ).model_dump()
                )

    # Step 4: Store/transmit only llm_responses

    generator = ReportGenerator(db)
    report = generator.generate_report(
        brand_name=request.brand_name,
        competitor_names=request.competitor_names,
        llm_responses=llm_responses,
        models=request.models,
        keywords=request.keywords,
        regions=request.regions,
        languages=request.languages,
        prompt_templates=request.prompt_templates
    )
    
    # Create ownership relationship in Keto
    await create_owner_relationship(x_user_id, report.id)
    
    successful = len(llm_responses)
    failed = len(results) - successful

    return AnalyzeResponse(
        report_id=report.id, # type: ignore
        brand_name=request.brand_name,
        timestamp=datetime.now(timezone.utc).isoformat(),
        total_queries=len(results),
        successful_queries=successful,
        failed_queries=failed
    )