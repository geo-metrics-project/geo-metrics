from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, ARRAY
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

Base = declarative_base()

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    brand_name = Column(String(255), nullable=False)
    competitor_names = Column(ARRAY(Text), nullable=True)
    user_id = Column(Integer, nullable=True)  # No foreign key constraint
    kpis = Column(JSONB, default=dict)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    
    # Relationship to LLM responses
    llm_responses = relationship("LLMResponse", back_populates="report", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "brand_name": self.brand_name,
            "competitor_names": self.competitor_names or [],
            "user_id": self.user_id,
            "kpis": self.kpis or {},
            "created_at": self.created_at.isoformat() if self.created_at is not None else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at is not None else None
        }


class LLMResponse(Base):
    __tablename__ = "llm_responses"

    id = Column(Integer, primary_key=True, index=True)
    report_id = Column(Integer, ForeignKey('reports.id', ondelete='CASCADE'), nullable=False)
    prompt_template = Column(Text, nullable=False)
    region = Column(String(100), nullable=False)
    language_code = Column(String(10), nullable=False)
    keyword = Column(String(255), nullable=False)
    model = Column(String(255), nullable=False)
    prompt_text = Column(Text, nullable=False)
    response = Column(Text, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    
    # Relationship back to report
    report = relationship("Report", back_populates="llm_responses")

    def to_dict(self):
        return {
            "id": self.id,
            "report_id": self.report_id,
            "prompt_template": self.prompt_template,
            "region": self.region,
            "language_code": self.language_code,
            "keyword": self.keyword,
            "model": self.model,
            "prompt_text": self.prompt_text,
            "response": self.response,
            "created_at": self.created_at.isoformat() if self.created_at is not None else None
        }