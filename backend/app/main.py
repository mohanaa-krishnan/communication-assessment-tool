from fastapi import FastAPI
from app.api import patients, assessments, parents, me
from app.api.ai_reports import router as ai_reports_router
from fastapi.middleware.cors import CORSMiddleware
from app.api.pdf import router as pdf_router
from app.api import report

app = FastAPI(
    title="Communication Assessment Tool API",
    version="1.0.0"
)

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

app.include_router(patients.router)
app.include_router(assessments.router)
app.include_router(ai_reports_router)
app.include_router(parents.router)
app.include_router(report.router)
app.include_router(pdf_router)
app.include_router(me.router)


@app.get("/")
def root():
    return {"message": "Communication Assessment Tool Backend Running"}