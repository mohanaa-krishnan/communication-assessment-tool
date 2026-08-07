from fastapi import APIRouter, HTTPException, Depends

from app.schemas.patient import PatientCreate, PatientUpdate, PatientOut
from app.services import patient_service
from app.auth import require_therapist, CurrentUser

router = APIRouter(prefix="/patients", tags=["patients"])


@router.get("/")
def get_all_patients(user: CurrentUser = Depends(require_therapist)):
    return patient_service.list_patients(user.profile_id)


@router.get("/{patient_id}")
def get_one_patient(patient_id: str, user: CurrentUser = Depends(require_therapist)):
    patient = patient_service.get_patient(patient_id)
    if not patient or patient.get("therapist_id") != user.profile_id:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient


@router.post("/", status_code=201)
def create_new_patient(patient: PatientCreate, user: CurrentUser = Depends(require_therapist)):
    return patient_service.create_patient(patient, user.profile_id)


@router.put("/{patient_id}")
def update_existing_patient(
    patient_id: str,
    patient: PatientUpdate,
    user: CurrentUser = Depends(require_therapist),
):
    existing = patient_service.get_patient(patient_id)
    if not existing or existing.get("therapist_id") != user.profile_id:
        raise HTTPException(status_code=404, detail="Patient not found")
    updated = patient_service.update_patient(patient_id, patient)
    if not updated:
        raise HTTPException(status_code=404, detail="Patient not found")
    return updated


@router.delete("/{patient_id}")
def delete_existing_patient(patient_id: str, user: CurrentUser = Depends(require_therapist)):
    existing = patient_service.get_patient(patient_id)
    if not existing or existing.get("therapist_id") != user.profile_id:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_service.delete_patient(patient_id)