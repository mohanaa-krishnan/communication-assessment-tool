from pydantic import BaseModel
from typing import Optional

class PatientCreate(BaseModel):
    therapist_id: str
    full_name: str
    date_of_birth: Optional[str] = None
    gender: Optional[str] = None
    diagnosis: Optional[str] = None
    caregiver_name: Optional[str] = None
    caregiver_phone: Optional[str] = None