from fastapi import APIRouter, HTTPException
from app.database.supabase import supabase

router = APIRouter(
    prefix="/parent",
    tags=["Parent"]
)


@router.get("/dashboard/{parent_id}")
def get_parent_dashboard(parent_id: str):

    # Get parent
    parent = (
        supabase.table("parents")
        .select("*")
        .eq("id", parent_id)
        .single()
        .execute()
    )

    if not parent.data:
        raise HTTPException(status_code=404, detail="Parent not found")

    patient_id = parent.data["patient_id"]

    # Get child
    patient = (
        supabase.table("patients")
        .select("*")
        .eq("id", patient_id)
        .single()
        .execute()
    )

    return {
        "parent": parent.data,
        "patient": patient.data
    }