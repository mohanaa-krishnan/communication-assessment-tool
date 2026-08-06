from app.database.supabase import supabase


def generate_report(data: dict):
    # Check whether a report already exists
    existing = (
        supabase.table("reports")
        .select("*")
        .eq("assessment_id", data["assessment_id"])
        .limit(1)
        .execute()
    )

    if existing.data:
        return existing.data[0]

    response = (
        supabase.table("reports")
        .insert(data)
        .execute()
    )

    return response.data[0]


def get_report(assessment_id: str):
    response = (
        supabase.table("reports")
        .select("*")
        .eq("assessment_id", assessment_id)
        .single()
        .execute()
    )

    return response.data


def update_report(report_id: str, payload: dict):
    response = (
        supabase.table("reports")
        .update(payload)
        .eq("id", report_id)
        .execute()
    )

    return response.data[0]


def approve_report(report_id: str):
    response = (
        supabase.table("reports")
        .update({"status": "approved"})
        .eq("id", report_id)
        .execute()
    )

    return response.data[0]