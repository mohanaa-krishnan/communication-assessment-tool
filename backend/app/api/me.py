from fastapi import APIRouter, Depends

from app.auth import CurrentUser, get_current_user

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/me")
def get_me(user: CurrentUser = Depends(get_current_user)):
    """Tells the frontend who's logged in: therapist or parent, and their
    profile id — so the UI never has to hardcode or guess an id again."""
    return {
        "role": user.role,
        "profile_id": user.profile_id,
        "email": user.email,
        "patient_id": user.patient_id,
    }