from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv

from app.routes import detection   # ← absolute import (important)

load_dotenv()

app = FastAPI(
    title="CyberShield India API",
    description="AI-powered cybercrime detection and forensic analysis",
    version="1.0.0"
)

# ───────────────────── CORS ─────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────────────── ROUTES ─────────────────────

app.include_router(detection.router)

# ───────────────────── STATIC FILES ─────────────────────

REPORTS_DIR = "reports"

if os.path.exists(REPORTS_DIR):
    app.mount("/reports", StaticFiles(directory=REPORTS_DIR), name="reports")

# ───────────────────── BASIC ENDPOINTS ─────────────────────

@app.get("/")
def root():
    return {
        "message": "CyberShield India API running",
        "status": "operational",
        "version": "1.0.0",
        "routes": {
            "docs": "/docs",
            "health": "/health",
            "analyze": "/api/detect/analyze",
            "cases": "/api/detect/cases",
            "report": "/api/detect/report/{case_id}"
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy"}

# ───────────────────── RUN SERVER ─────────────────────

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=os.getenv("API_HOST", "0.0.0.0"),
        port=int(os.getenv("API_PORT", 8000)),
        reload=True
    )