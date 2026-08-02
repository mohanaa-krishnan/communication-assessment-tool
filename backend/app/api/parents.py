from fastapi import APIRouter
from app.database.supabase import supabase
from pydantic import BaseModel
from fastapi import HTTPException
import secrets
router = APIRouter(
    prefix="/parents",
    tags=["Parents"]
)
class ParentCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    patient_id: str
    invited_by: str
@router.get("/")
def get_all_parents():
    response = supabase.table("parents").select("*").execute()

    return response.data
@router.post("/")
def create_parent(parent: ParentCreate):

    # Check if parent already exists
    existing = (
        supabase.table("parents")
        .select("id")
        .eq("email", parent.email)
        .execute()
    )

    if existing.data:
        raise HTTPException(
            status_code=400,
            detail="Parent already exists"
        )

    # Generate temporary password
    temp_password = secrets.token_urlsafe(10)

    # Create Supabase Auth user
    auth = supabase.auth.admin.create_user({
        "email": parent.email,
        "password": temp_password,
        "email_confirm": True
    })

    auth_user = auth.user

    # Save parent record
    response = (
        supabase.table("parents")
        .insert({
            "auth_user_id": auth_user.id,
            "full_name": parent.full_name,
            "email": parent.email,
            "phone": parent.phone,
            "patient_id": parent.patient_id,
            "invited_by": parent.invited_by,
            "invitation_status": "pending"
        })
        .execute()
    )

    return {
        "message": "Parent invited successfully",
        "temporary_password": temp_password,
        "parent": response.data
    }