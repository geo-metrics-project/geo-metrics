from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
from database import get_db
from models.report_model import Report, LLMResponse
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["reports"])

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