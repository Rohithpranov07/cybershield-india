from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import FileResponse
from pathlib import Path
from datetime import datetime
import os
import hashlib

from ..services.ai_detector import get_detector
from ..services.pdf_generator import get_pdf_generator
from ..services.blockchain import get_blockchain_service

from ..utils import (
    generate_case_id,
    calculate_file_hash,
    is_image,
    is_video
)

from ..models import SessionLocal, Case

router = APIRouter(prefix="/api/detect", tags=["detection"])

UPLOAD_FOLDER = "uploads"
REPORT_FOLDER = "reports"
MAX_FILE_SIZE = 50 * 1024 * 1024

Path(UPLOAD_FOLDER).mkdir(exist_ok=True)
Path(REPORT_FOLDER).mkdir(exist_ok=True)


@router.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):

    file.file.seek(0, 2)
    size = file.file.tell()
    file.file.seek(0)

    if size > MAX_FILE_SIZE:
        raise HTTPException(400, "File too large")

    content = await file.read()
    media_hash = calculate_file_hash(content)

    db = SessionLocal()

    try:
        # ================= DUPLICATE =================
        existing = db.query(Case).filter(Case.media_hash == media_hash).first()

        if existing:
            return {
                "success": True,
                "duplicate": True,
                "case_id": existing.id,
                "media_type": existing.media_type,
                "filename": existing.filename,
                "detection": {
                    "is_ai_generated": existing.is_ai_generated,
                    "confidence": existing.detection_score
                },
                "timestamp": existing.created_at.isoformat(),
                "blockchain_tx": existing.blockchain_tx,
                "blockchain_status": "anchored" if existing.blockchain_tx else "pending"
            }

        # ================= CREATE CASE =================
        case_id = generate_case_id()
        filename = file.filename

        if is_image(filename):
            media_type = "image"
        elif is_video(filename):
            media_type = "video"
        else:
            raise HTTPException(400, "Unsupported file type")

        file_path = Path(UPLOAD_FOLDER) / f"{case_id}_{filename}"

        with open(file_path, "wb") as f:
            f.write(content)

        # ================= AI DETECTION =================
        detector = get_detector()

        result = (
            detector.detect_fake_image(str(file_path))
            if media_type == "image"
            else detector.detect_fake_video(str(file_path))
        )

        if result.get("error"):
            raise HTTPException(500, result["error"])

        # ================= BLOCKCHAIN FIRST =================
        blockchain = get_blockchain_service()

        report_hash = hashlib.sha256(content).hexdigest()
        blockchain_tx = None
        blockchain_status = "pending"

        if blockchain.enabled:
            bc_result = blockchain.store_evidence(
                case_id=case_id,
                media_hash=media_hash,
                report_hash=report_hash
            )

            if bc_result.get("success"):
                blockchain_tx = bc_result["tx_hash"]
                blockchain_status = "anchored"

        # ================= SAVE CASE =================
        case = Case(
            id=case_id,
            media_type=media_type,
            filename=filename,
            media_hash=media_hash,
            detection_score=result["confidence"],
            is_ai_generated=result["is_ai_generated"],
            blockchain_tx=blockchain_tx,
            report_path=None,
            created_at=datetime.utcnow()
        )

        db.add(case)
        db.commit()
        db.refresh(case)

        # ================= GENERATE PDF WITH REAL STATUS =================
        pdf_gen = get_pdf_generator()

        pdf_data = {
            "case_id": case_id,
            "timestamp": datetime.utcnow().isoformat(),
            "media_type": media_type,
            "filename": filename,
            "media_hash": media_hash,
            "confidence": result["confidence"],
            "is_ai_generated": result["is_ai_generated"],
            "model": result.get("model", "AI Detector"),
            "detection_details": result,
            "blockchain_tx": blockchain_tx
        }

        pdf_path = pdf_gen.generate_report(pdf_data, str(file_path))

        case.report_path = pdf_path
        db.commit()

        return {
            "success": True,
            "duplicate": False,
            "case_id": case_id,
            "media_type": media_type,
            "filename": filename,
            "detection": {
                "is_ai_generated": result["is_ai_generated"],
                "confidence": result["confidence"]
            },
            "timestamp": datetime.utcnow().isoformat(),
            "blockchain_tx": blockchain_tx,
            "blockchain_status": blockchain_status
        }

    finally:
        db.close()


@router.get("/report/{case_id}")
def download_report(case_id: str):
    db = SessionLocal()
    try:
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case or not case.report_path:
            raise HTTPException(404, "Report not found")

        return FileResponse(
            case.report_path,
            filename=f"{case_id}_forensic_report.pdf",
            media_type="application/pdf"
        )
    finally:
        db.close()


@router.get("/cases")
def list_cases(limit: int = 100):
    db = SessionLocal()
    try:
        cases = db.query(Case).order_by(Case.created_at.desc()).limit(limit).all()

        return {
            "cases": [
                {
                    "case_id": c.id,
                    "media_type": c.media_type,
                    "filename": c.filename,
                    "is_ai_generated": c.is_ai_generated,
                    "confidence": c.detection_score,
                    "blockchain_tx": c.blockchain_tx,
                    "created_at": c.created_at.isoformat()
                }
                for c in cases
            ]
        }
    finally:
        db.close()