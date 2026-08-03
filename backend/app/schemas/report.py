from pydantic import BaseModel
from uuid import UUID
from typing import Optional


class ReportCreate(BaseModel):
    assessment_id: UUID
    patient_id: UUID
    therapist_id: UUID


class ReportUpdate(BaseModel):
    therapist_report: Optional[str] = None
    recommendations: Optional[str] = None
    parent_summary: Optional[str] = None


class ReportResponse(BaseModel):
    id: UUID
    assessment_id: UUID
    patient_id: UUID
    therapist_id: UUID

    ai_report: str
    therapist_report: str

    recommendations: Optional[str] = None
    parent_summary: Optional[str] = None

    status: str

    class Config:
        from_attributes = True