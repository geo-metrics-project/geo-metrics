from models.report_model import Report, LLMResponse
from sqlalchemy.orm import Session
from typing import Optional, List
import re

class ReportGenerator:
    def __init__(self, db: Session):
        self.db = db

    def calculate_kpis(self, brand_name: str, competitor_names: List[str], response_text: str) -> dict:
        """Calculate KPIs for a single LLM response"""
        kpis = {}
        text = response_text.lower()
        # Brand mention
        kpis["brand_mentioned"] = brand_name.lower() in text
        # Brand citation (with link)
        kpis["brand_citation_with_link"] = kpis["brand_mentioned"] and bool(re.search(r'https?://', text))
        # Competitor mentions
        kpis["competitor_mentions"] = {comp: (comp.lower() in text) for comp in competitor_names}
        return kpis

    def generate_report(self, brand_name: str, user_id: str, owner_email: str, llm_responses: list, competitor_names: Optional[List[str]] = None):
        # Create the report object (no kpis at report level)
        report = Report(
            brand_name=brand_name,
            competitor_names=competitor_names,
            user_id=user_id,
            owner_email=owner_email
        )
        self.db.add(report)
        self.db.flush()  # Get report.id

        # Add LLM responses with kpis
        for resp in llm_responses:
            kpis = self.calculate_kpis(brand_name, competitor_names or [], resp.get("response", ""))
            llm_response = LLMResponse(
                report_id=report.id,
                prompt_template=resp.get("prompt_template", ""),
                region=resp.get("region", ""),
                language_code=resp.get("language_code", ""),
                keyword=resp.get("keyword", ""),
                model=resp.get("model", ""),
                prompt_text=resp.get("prompt_text", ""),
                response=resp.get("response", ""),
                kpis=kpis
            )
            self.db.add(llm_response)

        self.db.commit()
        self.db.refresh(report)
        return report