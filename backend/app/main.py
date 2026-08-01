from fastapi import FastAPI
from app.database.supabase import supabase
from app.api import patients, assessments

app = FastAPI(
    title="Communication Assessment Tool API",
    version="1.0.0"
)

app.include_router(patients.router)
app.include_router(assessments.router)


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