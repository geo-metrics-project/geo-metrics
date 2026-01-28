from fastapi import APIRouter, Depends, HTTPException, Header, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from pydantic import BaseModel
from database import get_db
from models.report_model import Report, LLMResponse
from clients.keto_client import grant_view_access, revoke_access, delete_all_relationships, get_user_accessible_reports, check_access, get_report_viewers
from clients.kratos_client import lookup_user_by_email, get_user_email
import logging
from collections import defaultdict

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
    created_at: str
    updated_at: str

# KPIs aggregation response model
class AggregatedKPIsResponse(BaseModel):
    metadata: Dict[str, Any]
    kpis: Dict[str, Any]

# LLM responses list response model
class LLMResponsesList(BaseModel):
    metadata: Dict[str, Any]
    responses: List[LLMResponseOut]

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

@router.get("/{report_id}/llm-responses", response_model=LLMResponsesList)
async def get_report_llm_responses(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...),
    region: str = Query(None),
    language_code: str = Query(None),
    model: str = Query(None),
    keyword: str = Query(None),
    prompt_template: str = Query(None),
    limit: int = Query(100, ge=1, le=1000),
    offset: int = Query(0, ge=0)
):
    # Check access via Keto
    has_access = await check_access(x_user_id, report_id, "view")
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    query = db.query(LLMResponse).filter(LLMResponse.report_id == report_id)
    if region:
        query = query.filter(LLMResponse.region == region)
    if language_code:
        query = query.filter(LLMResponse.language_code == language_code)
    if model:
        query = query.filter(LLMResponse.model == model)
    if keyword:
        query = query.filter(LLMResponse.keyword == keyword)
    if prompt_template:
        query = query.filter(LLMResponse.prompt_template == prompt_template)
    
    # Get total count for metadata
    total_count = query.count()
    
    llm_responses = query.offset(offset).limit(limit).all()
    
    # Build applied filters metadata
    applied_filters = {}
    if region:
        applied_filters["region"] = region
    if language_code:
        applied_filters["language_code"] = language_code
    if model:
        applied_filters["model"] = model
    if keyword:
        applied_filters["keyword"] = keyword
    if prompt_template:
        applied_filters["prompt_template"] = prompt_template
    
    metadata = {
        "total_count": total_count,
        "limit": limit,
        "offset": offset,
        "applied_filters": applied_filters
    }
    
    return {"metadata": metadata, "responses": [resp.to_dict() for resp in llm_responses]}

@router.get("/{report_id}/kpis", response_model=AggregatedKPIsResponse)
async def get_report_kpis(
    report_id: int,
    db: Session = Depends(get_db),
    x_user_id: str = Header(...),
    region: str = Query(None),
    language_code: str = Query(None),
    model: str = Query(None),
    keyword: str = Query(None),
    prompt_template: str = Query(None),
    aggregate_by: str = Query(None, description="Field to aggregate by (e.g., 'region', 'language_code', 'model', 'keyword', 'prompt_template')"),
    limit: int = Query(1000, ge=1, le=10000),
    offset: int = Query(0, ge=0)
):
    # Check access via Keto
    has_access = await check_access(x_user_id, report_id, "view")
    if not has_access:
        raise HTTPException(status_code=403, detail="Access denied")
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    query = db.query(LLMResponse).filter(LLMResponse.report_id == report_id)
    if region:
        query = query.filter(LLMResponse.region == region)
    if language_code:
        query = query.filter(LLMResponse.language_code == language_code)
    if model:
        query = query.filter(LLMResponse.model == model)
    if keyword:
        query = query.filter(LLMResponse.keyword == keyword)
    if prompt_template:
        query = query.filter(LLMResponse.prompt_template == prompt_template)
    llm_responses = query.offset(offset).limit(limit).all()
    
    # Build applied filters metadata
    applied_filters = {}
    if region:
        applied_filters["region"] = region
    if language_code:
        applied_filters["language_code"] = language_code
    if model:
        applied_filters["model"] = model
    if keyword:
        applied_filters["keyword"] = keyword
    if prompt_template:
        applied_filters["prompt_template"] = prompt_template
    
    metadata = {
        "total_responses_aggregated": len(llm_responses),
        "limit": limit,
        "offset": offset,
        "applied_filters": applied_filters,
        "aggregated_by": aggregate_by
    }
    
    if aggregate_by:
        # Validate aggregate_by
        valid_fields = {"region", "language_code", "model", "keyword", "prompt_template"}
        if aggregate_by not in valid_fields:
            raise HTTPException(status_code=400, detail=f"Invalid aggregate_by field. Must be one of: {', '.join(valid_fields)}")
        
        # Group responses by the specified field
        grouped = defaultdict(list)
        for resp in llm_responses:
            key = getattr(resp, aggregate_by, "unknown")
            grouped[key].append(resp)
        
        # Aggregate per group
        result = {}
        for group, resps in grouped.items():
            agg = {
                "total_responses": len(resps),
                "brand_mentioned": 0,
                "brand_citation_with_link": 0,
                "competitor_mentions": defaultdict(int)
            }
            for resp in resps:
                kpis = getattr(resp, "kpis", None)
                if kpis and isinstance(kpis, dict):
                    agg["brand_mentioned"] += kpis.get("brand_mentioned", False)
                    agg["brand_citation_with_link"] += kpis.get("brand_citation_with_link", False)
                    comp_mentions = kpis.get("competitor_mentions", {})
                    if isinstance(comp_mentions, dict):
                        for comp, mentioned in comp_mentions.items():
                            agg["competitor_mentions"][comp] += mentioned
            # Convert defaultdict to dict
            agg["competitor_mentions"] = dict(agg["competitor_mentions"])
            result[group] = agg
        return {"metadata": metadata, "kpis": result}
    else:
        # Aggregate all responses
        aggregated = {
            "total_responses": len(llm_responses),
            "brand_mentioned": 0,
            "brand_citation_with_link": 0,
            "competitor_mentions": defaultdict(int)
        }
        for resp in llm_responses:
            kpis = getattr(resp, "kpis", None)
            if kpis and isinstance(kpis, dict):
                aggregated["brand_mentioned"] += kpis.get("brand_mentioned", False)
                aggregated["brand_citation_with_link"] += kpis.get("brand_citation_with_link", False)
                comp_mentions = kpis.get("competitor_mentions", {})
                if isinstance(comp_mentions, dict):
                    for comp, mentioned in comp_mentions.items():
                        aggregated["competitor_mentions"][comp] += mentioned
        # Convert defaultdict to dict
        aggregated["competitor_mentions"] = dict(aggregated["competitor_mentions"])
        return {"metadata": metadata, "kpis": aggregated}

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