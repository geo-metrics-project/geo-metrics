from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime
from database import get_db
from services.report_generator import ReportGenerator
from models.report_model import Report, LLMResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["reports"])

class LLMResponseData(BaseModel):
    model: str = Field(..., description="Model used for the query")
    keyword: str = Field(..., description="Keyword that was queried")
    language_code: str = Field(..., description="Language code used")
    region: str = Field(..., description="Region context used")
    prompt_text: str = Field(..., description="Full prompt text sent to the model")
    response: str = Field(..., description="Response from the LLM")

class LLMResponseOut(BaseModel):
    id: int
    report_id: int
    prompt_template: str
    region: str
    language_code: str
    keyword: str
    model: str
    prompt_text: str
    response: str
    created_at: str

class ReportResponse(BaseModel):
    id: int
    brand_name: str
    competitor_names: List[str]
    user_id: str
    kpis: Dict[str, Any]
    created_at: str
    updated_at: str

class CreateReportRequest(BaseModel):
    user_id: str = Field(default=None, description="Kratos user ID")
    brand_name: str = Field(..., description="Brand name to analyze")
    competitor_names: Optional[List[str]] = Field(default=None, description="List of competitor brand names")
    llm_responses: List[LLMResponseData] = Field(..., description="LLM responses to store")

@router.post("", status_code=201, response_model=ReportResponse)
async def create_report(
    request: CreateReportRequest,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    try:
        logger.info(f"Creating report for brand: {request.brand_name} by user {x_user_id}")
        llm_responses = [resp.model_dump() for resp in request.llm_responses]
        generator = ReportGenerator(db)
        report = generator.generate_report(
            user_id=x_user_id,
            brand_name=request.brand_name,
            competitor_names=request.competitor_names,
            llm_responses=llm_responses
        )
        logger.info(f"Successfully created report {report.id}")
        return report.to_dict()
    except Exception as e:
        logger.error(f"Error creating report: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Error creating report: {str(e)}")

@router.get("", response_model=List[ReportResponse])
async def list_reports(
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    reports = db.query(Report).filter(Report.user_id == x_user_id).all()
    return [report.to_dict() for report in reports]

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == x_user_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found or access denied")
    return report.to_dict()

@router.delete("/{report_id}", status_code=204)
async def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == x_user_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found or access denied")
    db.delete(report)
    db.commit()
    return None

@router.get("/{report_id}/llm-responses", response_model=List[LLMResponseOut])
async def get_report_llm_responses(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    report = db.query(Report).filter(Report.id == report_id, Report.user_id == x_user_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found or access denied")
    llm_responses = db.query(LLMResponse).filter(
        LLMResponse.report_id == report_id
    ).all()
    return [resp.to_dict() for resp in llm_responses]