from fastapi import FastAPI
from app.database.supabase import supabase

app = FastAPI(
    title="Communication Assessment Tool API",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Communication Assessment Tool Backend Running"
    }

@app.get("/test-db")
def test_database():
    response = supabase.table("patients").select("*").execute()

    return {
        "status": "Connected Successfully",
        "patients": response.data
    }