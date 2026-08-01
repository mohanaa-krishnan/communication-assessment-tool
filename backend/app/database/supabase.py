import os
from pathlib import Path
from dotenv import load_dotenv
from supabase import create_client

# Load variables from backend/.env if available, otherwise fall back to environment.
load_dotenv(Path(__file__).resolve().parents[2] / ".env")

# Read values
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase client lazily when first used

def _build_supabase_client():
    if not SUPABASE_URL:
        raise RuntimeError(
            "Missing Supabase configuration: SUPABASE_URL is required. "
            "Set SUPABASE_URL in the environment or in a .env file."
        )

    if not SUPABASE_KEY:
        raise RuntimeError(
            "Missing Supabase configuration: SUPABASE_KEY is required. "
            "Set SUPABASE_KEY in the environment or in a .env file."
        )

    return create_client(SUPABASE_URL, SUPABASE_KEY)


class _SupabaseProxy:
    _client = None

    def __getattr__(self, item):
        if self._client is None:
            self._client = _build_supabase_client()
        return getattr(self._client, item)


supabase = _SupabaseProxy()