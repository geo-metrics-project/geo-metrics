from models.report_model import Report, LLMResponse
from sqlalchemy.orm import Session
from typing import Optional, List
import re

class ReportGenerator:
    def __init__(self, db: Session):
        self.db = db

    def calculate_kpis(self, brand_name: str, competitor_names: List[str], llm_responses: list) -> dict:
        """Calculate KPIs from LLM responses"""
        total_responses = len(llm_responses)
        if total_responses == 0:
            return {}
        
        brand_mentions = 0
        brand_with_link = 0
        competitor_mentions = {comp: 0 for comp in competitor_names}
        
        for resp in llm_responses:
            response_text = resp.get("response", "").lower()
            
            # Check if brand name is mentioned
            if brand_name.lower() in response_text:
                brand_mentions += 1
                
                # Check if response contains a link (http/https)
                if re.search(r'https?://', response_text):
                    brand_with_link += 1
            
            # Count competitor mentions
            for competitor in competitor_names:
                if competitor.lower() in response_text:
                    competitor_mentions[competitor] += 1
        
        # Calculate percentages
        brand_mention_percentage = (brand_mentions / total_responses) * 100 if total_responses > 0 else 0
        
        # Share of voice: brand mentions / (brand mentions + all competitor mentions)
        total_competitor_mentions = sum(competitor_mentions.values())
        total_mentions = brand_mentions + total_competitor_mentions
        share_of_voice = (brand_mentions / total_mentions) * 100 if total_mentions > 0 else 0
        
        # Citation rate: responses with brand mention AND link
        citation_rate = (brand_with_link / total_responses) * 100 if total_responses > 0 else 0
        
        return {
            "brand_mention_percentage": round(brand_mention_percentage, 2),
            "share_of_voice": round(share_of_voice, 2),
            "citation_rate": round(citation_rate, 2),
            "total_responses": total_responses,
            "brand_mentions": brand_mentions,
            "brand_citations_with_link": brand_with_link,
            "competitor_mentions": competitor_mentions
        }

    def generate_report(self, brand_name: str, user_id: str, llm_responses: list, competitor_names: Optional[List[str]] = None):
        # Calculate KPIs
        kpis = self.calculate_kpis(brand_name, competitor_names or [], llm_responses)
        
        # Create the report object
        report = Report(
            brand_name=brand_name,
            competitor_names=competitor_names,
            user_id=user_id,
            kpis=kpis
        )
        self.db.add(report)
        self.db.flush()  # Get report.id

        # Add LLM responses
        for resp in llm_responses:
            llm_response = LLMResponse(
                report_id=report.id,
                prompt_template=resp.get("prompt_template", ""),
                region=resp.get("region", ""),
                language_code=resp.get("language_code", ""),
                keyword=resp.get("keyword", ""),
                model=resp.get("model", ""),
                prompt_text=resp.get("prompt_text", ""),
                response=resp.get("response", "")
            )
            self.db.add(llm_response)

        self.db.commit()
        self.db.refresh(report)
        return report