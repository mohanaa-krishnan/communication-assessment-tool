from fastapi import APIRouter, HTTPException, Depends
from app.services import report_service
from app.models.report import ReportCreate, ReportUpdate
from app.auth import require_therapist, ensure_patient_access, CurrentUser

router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.post("/generate")
def generate_report(
    report: ReportCreate,
    user: CurrentUser = Depends(require_therapist),
):
    ensure_patient_access(report.patient_id, user)

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
        # Server-derived, always — never trust a therapist_id sent by the client.
        "therapist_id": user.profile_id,
        "ai_report": fake_ai,
        "therapist_report": fake_ai,
        "recommendations": "Daily communication practice for 15–20 minutes with caregiver involvement.",
        "parent_summary": "Your child showed good participation today. Continue practising communication activities at home and encourage eye contact and turn-taking during play.",
        "status": "draft",
    })


@router.get("/{assessment_id}")
def get_report(
    assessment_id: str,
    user: CurrentUser = Depends(require_therapist),
):
    report = report_service.get_report(assessment_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    ensure_patient_access(report["patient_id"], user)
    return report


@router.patch("/{report_id}")
def update_report(
    report_id: str,
    report: ReportUpdate,
    user: CurrentUser = Depends(require_therapist),
):
    existing = report_service.get_report_by_id(report_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Report not found")
    ensure_patient_access(existing["patient_id"], user)
    return report_service.update_report(
        report_id,
        report.model_dump(exclude_none=True)
    )


@router.patch("/{report_id}/approve")
def approve_report(
    report_id: str,
    user: CurrentUser = Depends(require_therapist),
):
    existing = report_service.get_report_by_id(report_id)
    if not existing:
        raise HTTPException(status_code=404, detail="Report not found")
    ensure_patient_access(existing["patient_id"], user)
    return report_service.approve_report(report_id)


@router.get("/id/{report_id}")
def get_report_by_id(
    report_id: str,
    user: CurrentUser = Depends(require_therapist),
):
    report = report_service.get_report_by_id(report_id)
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    ensure_patient_access(report["patient_id"], user)
    return report