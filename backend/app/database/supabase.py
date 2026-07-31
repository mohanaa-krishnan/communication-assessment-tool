import os
from dotenv import load_dotenv
from supabase import create_client

# Load variables from .env
load_dotenv()

# Read values
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Create Supabase client
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)