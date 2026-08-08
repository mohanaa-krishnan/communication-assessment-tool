from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import FileResponse
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import getSampleStyleSheet

from app.database.supabase import supabase
from app.auth import require_therapist, ensure_patient_access, CurrentUser

import tempfile

router = APIRouter(
    prefix="/reports",
    tags=["Reports PDF"]
)


@router.get("/{report_id}/pdf")
def download_pdf(
    report_id: str,
    user: CurrentUser = Depends(require_therapist),
):

    report = (
        supabase.table("reports")
        .select("*")
        .eq("id", report_id)
        .single()
        .execute()
    )

    if not report.data:
        raise HTTPException(404, "Report not found")

    ensure_patient_access(report.data["patient_id"], user)

    patient = (
        supabase.table("patients")
        .select("*")
        .eq("id", report.data["patient_id"])
        .single()
        .execute()
    )

    styles = getSampleStyleSheet()

    tmp = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")

    doc = SimpleDocTemplate(tmp.name)

    story = []

    story.append(
        Paragraph("<b>CAT Assessment Report</b>", styles["Title"])
    )

    story.append(Spacer(1, 20))

    story.append(
        Paragraph(
            f"<b>Patient:</b> {patient.data['full_name']}",
            styles["BodyText"],
        )
    )

    story.append(
        Paragraph(
            f"<b>Date:</b> {report.data['created_at']}",
            styles["BodyText"],
        )
    )

    story.append(Spacer(1, 20))

    story.append(
        Paragraph("<b>Clinical Impression</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(report.data["therapist_report"], styles["BodyText"])
    )

    story.append(Spacer(1, 15))

    story.append(
        Paragraph("<b>Recommendations</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(report.data["recommendations"], styles["BodyText"])
    )

    story.append(Spacer(1, 15))

    story.append(
        Paragraph("<b>Parent Summary</b>", styles["Heading2"])
    )

    story.append(
        Paragraph(report.data["parent_summary"], styles["BodyText"])
    )

    doc.build(story)

    return FileResponse(
        tmp.name,
        filename="CAT_Report.pdf",
        media_type="application/pdf",
    )