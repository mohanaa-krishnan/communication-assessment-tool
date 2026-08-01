from app.database.supabase import supabase
from app.schemas.assessment import AssessmentCreate


def create_assessment(assessment: AssessmentCreate):
    assessment_payload = {
        "patient_id": assessment.patient_id,
        "therapist_id": assessment.therapist_id,
        "assessment_date": assessment.assessment_date.isoformat(),
        "status": "draft",
    }
    assessment_response = (
        supabase.table("assessments").insert(assessment_payload).execute()
    )
    new_assessment = assessment_response.data[0]
    assessment_id = new_assessment["id"]

    scores_payload = [
        {
            "assessment_id": assessment_id,
            "behaviour_name": s.behaviour_name,
            "status": s.status,
            "therapist_notes": s.therapist_notes or "",
        }
        for s in assessment.scores
    ]
    scores_response = (
        supabase.table("behaviour_scores").insert(scores_payload).execute()
    )

    new_assessment["scores"] = scores_response.data
    return new_assessment


def get_assessment(assessment_id: str):
    assessment_response = (
        supabase.table("assessments")
        .select("*")
        .eq("id", assessment_id)
        .single()
        .execute()
    )
    assessment = assessment_response.data
    if not assessment:
        return None

    scores_response = (
        supabase.table("behaviour_scores")
        .select("*")
        .eq("assessment_id", assessment_id)
        .execute()
    )
    assessment["scores"] = scores_response.data
    return assessment


def list_patient_assessments(patient_id: str):
    response = (
        supabase.table("assessments")
        .select("*")
        .eq("patient_id", patient_id)
        .order("assessment_date", desc=True)
        .execute()
    )
    return response.data