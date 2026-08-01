from app.database.supabase import supabase
from app.schemas.patient import PatientCreate, PatientUpdate


def list_patients():
    response = supabase.table("patients").select("*").execute()
    return response.data


def get_patient(patient_id: str):
    response = (
        supabase.table("patients")
        .select("*")
        .eq("id", patient_id)
        .single()
        .execute()
    )
    return response.data


def create_patient(patient: PatientCreate):
    payload = patient.model_dump(mode="json", exclude_none=True)
    response = supabase.table("patients").insert(payload).execute()
    return response.data[0]


def update_patient(patient_id: str, patient: PatientUpdate):
    payload = patient.model_dump(mode="json", exclude_none=True)
    if not payload:
        return get_patient(patient_id)
    response = (
        supabase.table("patients")
        .update(payload)
        .eq("id", patient_id)
        .execute()
    )
    return response.data[0] if response.data else None


def delete_patient(patient_id: str):
    supabase.table("patients").delete().eq("id", patient_id).execute()
    return {"deleted": True, "id": patient_id}