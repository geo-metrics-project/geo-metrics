from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
from database import get_db
from models.report_model import Report, LLMResponse
from keto_client import grant_view_access, revoke_access, delete_all_relationships
import logging
import os
import httpx

logger = logging.getLogger(__name__)
KRATOS_ADMIN_URL = os.getenv("KRATOS_ADMIN_URL", "http://kratos-admin.geo-ory.svc.cluster.local:4434")

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
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    return report.to_dict()

@router.delete("/{report_id}", status_code=204)
async def delete_report(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Delete from database
    db.delete(report)
    db.commit()
    
    # Delete all Keto relationships for this report
    await delete_all_relationships(report_id)
    
    return None

@router.get("/{report_id}/llm-responses", response_model=List[LLMResponseOut])
async def get_report_llm_responses(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    llm_responses = db.query(LLMResponse).filter(
        LLMResponse.report_id == report_id
    ).all()
    return [resp.to_dict() for resp in llm_responses]

# Sharing endpoints

class ShareReportRequest(BaseModel):
    email: str

async def lookup_user_by_email(email: str) -> str:
    """Look up Kratos user ID by email address"""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{KRATOS_ADMIN_URL}/admin/identities",
                params={"credentials_identifier": email}
            )
            response.raise_for_status()
            identities = response.json()
            
            if not identities:
                raise HTTPException(status_code=404, detail="User not found")
            
            return identities[0]["id"]
    except httpx.HTTPError as e:
        logger.error(f"Error looking up user by email: {e}")
        raise HTTPException(status_code=500, detail="Error looking up user")

@router.post("/{report_id}/share", status_code=204)
async def share_report(
    report_id: int,
    request: ShareReportRequest,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    """Share a report with another user by email"""
    # Verify report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Look up target user by email
    target_user_id = await lookup_user_by_email(request.email)
    
    # Grant view access in Keto
    await grant_view_access(target_user_id, report_id)
    
    return None

@router.delete("/{report_id}/share/{target_user_id}", status_code=204)
async def unshare_report(
    report_id: int,
    target_user_id: str,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    """Revoke access to a shared report"""
    # Verify report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Revoke access in Keto
    await revoke_access(target_user_id, report_id)
    
    return None