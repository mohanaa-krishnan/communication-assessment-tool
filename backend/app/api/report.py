from fastapi import APIRouter
from app.services import report_service
from app.models.report import ReportCreate, ReportUpdate

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post("/generate")
def generate_report(report: ReportCreate):

    fake_ai = f"""
The child participated well during today's assessment.

Strengths
- Good eye contact
- Responds to name
- Follows simple instructions

Areas for improvement
- Turn taking
- Joint attention
- Requesting

Recommendations
Daily communication practice for 15–20 minutes with caregiver involvement.
"""

    return report_service.generate_report({
    "assessment_id": report.assessment_id,
    "patient_id": report.patient_id,
    "therapist_id": report.therapist_id,
    "ai_report": fake_ai,
    "therapist_report": fake_ai,
    "recommendations": "Daily communication practice for 15–20 minutes with caregiver involvement.",
    "parent_summary": "Your child showed good participation today. Continue practising communication activities at home and encourage eye contact and turn-taking during play.",
    "status": "draft",
})

@router.get("/{assessment_id}")
def get_report(assessment_id: str):
    return report_service.get_report(assessment_id)


@router.patch("/{report_id}")
def update_report(report_id: str, report: ReportUpdate):
    return report_service.update_report(
        report_id,
        report.model_dump(exclude_none=True)
    )


@router.patch("/{report_id}/approve")
def approve_report(report_id: str):
    return report_service.approve_report(report_id)
@router.get("/id/{report_id}")
def get_report_by_id(report_id: str):
    return report_service.get_report_by_id(report_id)