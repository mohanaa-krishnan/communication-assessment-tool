from fastapi import FastAPI
from app.database.supabase import supabase
from app.api import patients, assessments,parents
from app.api.ai_reports import router as ai_reports_router
from fastapi.middleware.cors import CORSMiddleware
from app.api import parent_dashboard
from app.api import report
app = FastAPI(
    title="Communication Assessment Tool API",
    version="1.0.0"
)

app.include_router(patients.router)
app.include_router(assessments.router)
app.include_router(ai_reports_router)
app.include_router(parents.router)
app.include_router(parent_dashboard.router)
app.include_router(report.router)
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
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)