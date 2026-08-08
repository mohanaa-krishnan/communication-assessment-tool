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
        .limit(1)
        .execute()
    )
    return response.data[0] if response.data else None


def get_report_by_id(report_id: str):
    response = (
        supabase.table("reports")
        .select("*")
        .eq("id", report_id)
        .limit(1)
        .execute()
    )
    return response.data[0] if response.data else None


def update_report(report_id: str, payload: dict):
    response = (
        supabase.table("reports")
        .update(payload)
        .eq("id", report_id)
        .execute()
    )
    return response.data[0] if response.data else None


def approve_report(report_id: str):
    response = (
        supabase.table("reports")
        .update({"status": "approved"})
        .eq("id", report_id)
        .execute()
    )
    return response.data[0] if response.data else None