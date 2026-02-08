from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

from .routes import detection
from .services.blockchain import get_blockchain_service

load_dotenv()

app = FastAPI(
    title="CyberShield India API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Force blockchain connection on startup
@app.on_event("startup")
def startup_event():
    print("\n🔗 Initializing blockchain service...")
    blockchain = get_blockchain_service()
    if blockchain.enabled:
        print("✅ Blockchain ready\n")
    else:
        print("⚠️ Blockchain disabled\n")

app.include_router(detection.router)

@app.get("/")
def root():
    return {"status": "CyberShield API running"}

@app.get("/health")
def health():
    return {"healthy": True}