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
LIBRETRANSLATE_URL = os.getenv("LIBRETRANSLATE_URL", "http://libretranslate.geo-metrics.svc.cluster.local:5000")

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

async def translate_prompt(client: httpx.AsyncClient, prompt: str, target_lang: str, semaphore: asyncio.Semaphore) -> str:
    """Translate using libretranslate with the shared httpx client and retry logic"""
    async with semaphore:
        if target_lang == "default":
            return prompt
        
        max_retries = 3
        for attempt in range(max_retries):
            try:
                url = f"{LIBRETRANSLATE_URL}/translate"
                payload = {
                    "q": prompt,
                    "source": "auto",
                    "target": target_lang,
                    "format": "text"
                }
                
                response = await client.post(url, json=payload, timeout=30.0)
                
                if response.status_code == 200:
                    result = response.json()
                    translated = result.get("translatedText", prompt)
                    logger.info(f"Translated to {target_lang}: '{prompt[:30]}...' -> '{translated[:30]}...'")
                    return translated
                else:
                    logger.warning(f"LibreTranslate API failed with status {response.status_code} (attempt {attempt + 1}/{max_retries}): {response.text}")
                    
            except Exception as e:
                logger.warning(f"Translation to {target_lang} failed (attempt {attempt + 1}/{max_retries}): {e}")
            
            # Wait before retrying (exponential backoff)
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # 1s, 2s, 4s
        
        logger.error(f"Translation to {target_lang} failed after {max_retries} attempts, using original prompt")
        return prompt

async def query_llm(client: httpx.AsyncClient, model: str, prompt: str, region: Optional[str], semaphore: asyncio.Semaphore):
    """Query a single LLM model with retry logic"""
    async with semaphore:
        max_retries = 3
        for attempt in range(max_retries):
            try:
                payload = {"model": model, "prompt": prompt}
                if region and region != "Global":
                    payload["region"] = region
                    
                response = await client.post(f"{LLM_SERVICE_URL}/api/query", json=payload, timeout=60.0)
                
                if response.status_code == 200:
                    data = response.json()
                    return {
                        "success": True,
                        "model": model,
                        "prompt_text": prompt,
                        "response": data.get("response", "")
                    }
                else:
                    logger.warning(f"LLM query failed for {model} (attempt {attempt + 1}/{max_retries}): {response.text}")
                    
            except Exception as e:
                logger.warning(f"Error querying {model} (attempt {attempt + 1}/{max_retries}): {e}")
            
            # Wait before retrying (exponential backoff)
            if attempt < max_retries - 1:
                await asyncio.sleep(2 ** attempt)  # 1s, 2s, 4s
        
        logger.error(f"LLM query for {model} failed after {max_retries} attempts")
        return {"success": False, "model": model, "prompt_text": prompt}


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
    
    # Step 1: Translate prompts for each language/prompt_template/keyword combination
    async with httpx.AsyncClient(
        timeout=60.0,
        limits=httpx.Limits(max_connections=100, max_keepalive_connections=20)
    ) as client:
        semaphore = asyncio.Semaphore(25)
        # Step 1: Translate prompts concurrently for each language/prompt_template/keyword combination
        translation_tasks = []
        for language in request.languages:
            for prompt_template in request.prompt_templates:
                for keyword in request.keywords:
                    prompt = prompt_template.format(keyword=keyword)
                    task = translate_prompt(client, prompt, language, semaphore)
                    translation_tasks.append((language, prompt_template, keyword, task))
        
        translated_results = await asyncio.gather(*[t[3] for t in translation_tasks])
        
        translated_jobs = []
        for i, (language, prompt_template, keyword, _) in enumerate(translation_tasks):
            translated_prompt = translated_results[i]
            translated_jobs.append({
                "language": language,
                "prompt_template": prompt_template,
                "keyword": keyword,
                "translated_prompt": translated_prompt
            })
        
        # Step 2: For each translated prompt, create query jobs for each region and model
        job_specs = []
        for tjob in translated_jobs:
            for region in request.regions:
                for model in request.models:
                    job_specs.append({
                        "model": model,
                        "keyword": tjob["keyword"],
                        "language_code": tjob["language"],
                        "region": region,
                        "translated_prompt": tjob["translated_prompt"],
                        "prompt_template": tjob["prompt_template"]
                    })
        
        # Step 3: Run LLM queries concurrently
        tasks = [
            query_llm(client, job["model"], job["translated_prompt"], job["region"], semaphore)
            for job in job_specs
        ]
        results = await asyncio.gather(*tasks, return_exceptions=True)

    # Step 4: Build LLMResponseData only for successful queries
    llm_responses = []
    for job, result in zip(job_specs, results):
        if isinstance(result, dict) and result.get("success"):
            llm_responses.append(
                LLMResponseData(
                    model=job["model"],
                    keyword=job["keyword"],
                    language_code=job["language_code"],
                    region=job["region"],
                    prompt_template=job["prompt_template"],
                    prompt_text=result.get("prompt_text", ""),
                    response=result.get("response", "")
                ).model_dump()
            )

    # Step 5: Store/transmit only llm_responses

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