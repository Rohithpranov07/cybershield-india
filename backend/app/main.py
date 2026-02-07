from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
from .routes import detection

load_dotenv()

app = FastAPI(
    title="CyberShield India API",
    description="AI-powered cybercrime detection and forensic analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(detection.router)

# Serve static files (for reports later)
if os.path.exists("reports"):
    app.mount("/reports", StaticFiles(directory="reports"), name="reports")

@app.get("/")
async def root():
    return {
        "message": "CyberShield India API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "docs": "/docs",
            "health": "/health",
            "analyze": "/api/detect/analyze",
            "cases": "/api/detect/cases"
        }
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    host = os.getenv("API_HOST", "0.0.0.0")
    port = int(os.getenv("API_PORT", 8000))
    uvicorn.run(app, host=host, port=port)
