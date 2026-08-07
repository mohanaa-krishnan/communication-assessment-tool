import os
from dataclasses import dataclass
from functools import lru_cache
from typing import Optional

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.database.supabase import supabase

SUPABASE_URL = os.getenv("SUPABASE_URL")

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass
class CurrentUser:
    auth_user_id: str
    email: Optional[str]
    role: str  # "therapist" | "parent"
    profile_id: str  # therapists.id or parents.id
    patient_id: Optional[str] = None  # only set for parents


@lru_cache(maxsize=1)
def _jwks_client() -> "jwt.PyJWKClient":
    if not SUPABASE_URL:
        raise HTTPException(
            status.HTTP_500_INTERNAL_SERVER_ERROR,
            "SUPABASE_URL is not configured on the server",
        )
    jwks_url = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"
    return jwt.PyJWKClient(jwks_url)


def _decode_token(credentials: Optional[HTTPAuthorizationCredentials]) -> dict:
    if credentials is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Missing bearer token")
    try:
        signing_key = _jwks_client().get_signing_key_from_jwt(credentials.credentials)
        return jwt.decode(
            credentials.credentials,
            signing_key.key,
            algorithms=["ES256"],
            audience="authenticated",
        )
    except jwt.PyJWTError:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Invalid or expired token")


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> CurrentUser:
    payload = _decode_token(credentials)
    auth_user_id = payload.get("sub")
    email = payload.get("email")

    therapist = (
        supabase.table("therapists")
        .select("id")
        .eq("auth_user_id", auth_user_id)
        .maybe_single()
        .execute()
    )
    if therapist.data:
        return CurrentUser(
            auth_user_id=auth_user_id,
            email=email,
            role="therapist",
            profile_id=therapist.data["id"],
        )

    parent = (
        supabase.table("parents")
        .select("id, patient_id")
        .eq("auth_user_id", auth_user_id)
        .maybe_single()
        .execute()
    )
    if parent.data:
        return CurrentUser(
            auth_user_id=auth_user_id,
            email=email,
            role="parent",
            profile_id=parent.data["id"],
            patient_id=parent.data["patient_id"],
        )

    raise HTTPException(
        status.HTTP_403_FORBIDDEN,
        "This account is not registered as a therapist or parent",
    )


def require_therapist(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role != "therapist":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Therapist account required")
    return user


def require_parent(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role != "parent":
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Parent account required")
    return user


def ensure_patient_access(patient_id: str, user: CurrentUser) -> None:
    """404 (not 403) unless this user may see this patient — so probing
    random patient ids doesn't confirm which ones exist."""
    if user.role == "therapist":
        patient = (
            supabase.table("patients")
            .select("id")
            .eq("id", patient_id)
            .eq("therapist_id", user.profile_id)
            .maybe_single()
            .execute()
        )
        if not patient.data:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Patient not found")
    elif user.role == "parent":
        if user.patient_id != patient_id:
            raise HTTPException(status.HTTP_404_NOT_FOUND, "Patient not found")
    else:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Not authorized")