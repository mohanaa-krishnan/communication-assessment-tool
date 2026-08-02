from pydantic import BaseModel, EmailStr


class ParentInvite(BaseModel):
    patient_id: str
    full_name: str
    email: EmailStr
    phone: str
    relationship: str