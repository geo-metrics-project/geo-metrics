import os
import logging
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from clients.huggingface_client import HuggingFaceClient

logger = logging.getLogger(__name__)

router = APIRouter(tags=["providers"])

DEFAULT_MODEL = "meta-llama/Llama-3.1-8B-Instruct"

class QueryRequest(BaseModel):
    prompt: str
    model: Optional[str] = None
    region: Optional[str] = None

class QueryResponse(BaseModel):
    model: str
    response: str

@router.post("/query", response_model=QueryResponse)
async def query_provider(request: QueryRequest):
    """Query an LLM model with a prompt"""
    
    # Use default model if not specified
    model = request.model or DEFAULT_MODEL
    
    try:
        client = HuggingFaceClient()
        result = await client.query_model(model, request.prompt, request.region)
        return result
    except Exception as e:
        logger.error(f"Error querying HuggingFace: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error querying HuggingFace: {str(e)}")