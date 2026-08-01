from app.services.assessment_service import get_communication_profile, get_patient_timeline
from fastapi import APIRouter, HTTPException
from app.schemas.assessment import AssessmentCreate
from app.services import assessment_service

router = APIRouter(tags=["assessments"])


@router.post("/assessments", status_code=201)
def create_new_assessment(assessment: AssessmentCreate):
    return assessment_service.create_assessment(assessment)


@router.get("/assessments/{assessment_id}")
def get_one_assessment(assessment_id: str):
    assessment = assessment_service.get_assessment(assessment_id)
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")
    return assessment


@router.get("/patients/{patient_id}/assessments")
def get_patient_assessments(patient_id: str):
    return assessment_service.list_patient_assessments(patient_id)
@router.get("/communication-profile")
def communication_profile(patient_id: str):
    profile = get_communication_profile(patient_id)
    if not profile:
        raise HTTPException(status_code=404, detail="Patient not found")
    return profile


@router.get("/timeline")
def patient_timeline(patient_id: str):
    return get_patient_timeline(patient_id)