from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
from database import get_db
from models.report_model import Report, LLMResponse
from clients.keto_client import grant_view_access, revoke_access, delete_all_relationships, get_user_accessible_reports, check_access, get_report_viewers
from clients.kratos_client import lookup_user_by_email, get_user_email
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
    kpis: dict
    created_at: str

class ReportResponse(BaseModel):
    id: int
    brand_name: str
    competitor_names: List[str]
    user_id: str
    owner_email: str
    created_at: str
    updated_at: str

@router.get("", response_model=List[ReportResponse])
async def list_reports(
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    # Get all report IDs the user has access to via Keto
    accessible_report_ids = await get_user_accessible_reports(x_user_id)
    
    if not accessible_report_ids:
        # User has no accessible reports
        return []
    
    # Query database for these reports
    reports = db.query(Report).filter(Report.id.in_(accessible_report_ids)).all()
    return [report.to_dict() for report in reports]

@router.get("/{report_id}", response_model=ReportResponse)
async def get_report(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    # Check access via Keto
    has_access = await check_access(x_user_id, report_id, "view")
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    
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
    # Check owner access via Keto
    is_owner = await check_access(x_user_id, report_id, "owner")
    if not is_owner:
        raise HTTPException(status_code=403, detail="Only owners can delete reports")
    
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
    # Check access via Keto
    has_access = await check_access(x_user_id, report_id, "view")
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    
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

class SharedUserResponse(BaseModel):
    user_id: str
    email: str

@router.post("/{report_id}/share", status_code=204)
async def share_report(
    report_id: int,
    request: ShareReportRequest,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    """Share a report with another user by email"""
    # Check owner access via Keto
    is_owner = await check_access(x_user_id, report_id, "owner")
    if not is_owner:
        raise HTTPException(status_code=403, detail="Only owners can share reports")
    
    # Verify report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Look up target user by email
    target_user_id = await lookup_user_by_email(request.email)
    
    # Grant view access in Keto
    await grant_view_access(target_user_id, report_id)
    
    return None

@router.get("/{report_id}/shared-with", response_model=List[SharedUserResponse])
async def get_shared_users(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    """Get list of users who have access to this report"""
    # Check owner access via Keto
    is_owner = await check_access(x_user_id, report_id, "owner")
    if not is_owner:
        raise HTTPException(status_code=403, detail="Only owners can view shared users")
    
    # Verify report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Get users from Keto
    user_ids = await get_report_viewers(report_id)
    
    # Look up emails for each user_id from Kratos
    shared_users = []
    for uid in user_ids:
        if uid == x_user_id:
            # Skip the owner themselves
            continue
        try:
            email = await get_user_email(uid)
            shared_users.append({"user_id": uid, "email": email})
        except Exception as e:
            logger.warning(f"Could not get email for user {uid}: {e}")
            # Skip users we can't look up
            continue
    
    return shared_users

@router.delete("/{report_id}/share", status_code=204)
async def unshare_report(
    report_id: int,
    request: ShareReportRequest,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...)
):
    """Revoke access to a shared report"""
    # Check owner access via Keto
    is_owner = await check_access(x_user_id, report_id, "owner")
    if not is_owner:
        raise HTTPException(status_code=403, detail="Only owners can unshare reports")
    
    # Verify report exists
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    # Look up target user by email
    target_user_id = await lookup_user_by_email(request.email)
    
    # Revoke access in Keto
    await revoke_access(target_user_id, report_id)
    
    return None