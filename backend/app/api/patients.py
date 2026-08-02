from fastapi import APIRouter, HTTPException
from app.schemas.patient import PatientCreate, PatientUpdate, PatientOut
from app.services import patient_service
from app.database.supabase import supabase
from app.models.patients import PatientCreate

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/")
def get_all_patients():
    return patient_service.list_patients()


@router.get("/{patient_id}")
def get_one_patient(patient_id: str):
    patient = patient_service.get_patient(patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient




@router.post("/")
def create_patient(patient: PatientCreate):

    response = (
        supabase
        .table("patients")
        .insert(patient.model_dump())
        .execute()
    )

    return response.data


@router.put("/{patient_id}")
def update_existing_patient(patient_id: str, patient: PatientUpdate):
    updated = patient_service.update_patient(patient_id, patient)
    if not updated:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated


@router.delete("/{patient_id}")
def delete_existing_patient(patient_id: str):
    return patient_service.delete_patient(patient_id)