from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse, FileResponse
import os
from pathlib import Path
from datetime import datetime

from ..services.ai_detector import get_detector
from ..services.pdf_generator import get_pdf_generator
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


# =========================================================
# ANALYZE + GENERATE PDF
# =========================================================

@router.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):
    try:
        # ---------- File size ----------
        file.file.seek(0, 2)
        size = file.file.tell()
        file.file.seek(0)

        if size > MAX_FILE_SIZE:
            raise HTTPException(400, "File too large")

        content = await file.read()
        media_hash = calculate_file_hash(content)

        db = SessionLocal()

        try:
            # ---------- Duplicate ----------
            existing = db.query(Case).filter(
                Case.media_hash == media_hash
            ).first()

            if existing:
                return {
                    "success": True,
                    "duplicate": True,
                    "case_id": existing.id,
                    "confidence": existing.detection_score,
                    "is_ai_generated": existing.is_ai_generated
                }

            # ---------- New Case ----------
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

            # ---------- AI Detection ----------
            detector = get_detector()

            if media_type == "image":
                result = detector.detect_fake_image(str(file_path))
            else:
                result = detector.detect_fake_video(str(file_path))

            if result.get("error"):
                raise HTTPException(500, result["error"])

            # ---------- Save DB ----------
            case = Case(
                id=case_id,
                media_type=media_type,
                filename=filename,
                media_hash=media_hash,
                detection_score=result["confidence"],
                is_ai_generated=result["is_ai_generated"],
                report_path=None,
                blockchain_tx=None,
                created_at=datetime.utcnow()
            )

            db.add(case)
            db.commit()
            db.refresh(case)

            # ====================================================
            # 🔥 PDF GENERATION (THIS WAS MISSING)
            # ====================================================

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
                "blockchain_tx": None
            }

            pdf_path = pdf_gen.generate_report(pdf_data, str(file_path))

            # ---------- Update DB with PDF ----------
            case.report_path = pdf_path
            db.commit()

        finally:
            db.close()

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
            "report_generated": True
        }

    except Exception as e:
        raise HTTPException(500, str(e))


# =========================================================
# DOWNLOAD PDF
# =========================================================

@router.get("/report/{case_id}")
async def download_report(case_id: str):
    db = SessionLocal()
    try:
        case = db.query(Case).filter(Case.id == case_id).first()

        if not case:
            raise HTTPException(404, "Case not found")

        if not case.report_path:
            raise HTTPException(404, "Report not generated")

        if not os.path.exists(case.report_path):
            raise HTTPException(404, "PDF file missing")

        return FileResponse(
            path=case.report_path,
            filename=f"{case_id}_forensic_report.pdf",
            media_type="application/pdf"
        )

    finally:
        db.close()


# =========================================================
# GET CASE
# =========================================================

@router.get("/case/{case_id}")
async def get_case(case_id: str):
    db = SessionLocal()
    try:
        case = db.query(Case).filter(Case.id == case_id).first()
        if not case:
            raise HTTPException(404, "Case not found")

        return {
            "case_id": case.id,
            "media_type": case.media_type,
            "filename": case.filename,
            "confidence": case.detection_score,
            "is_ai_generated": case.is_ai_generated,
            "report_path": case.report_path,
            "created_at": case.created_at.isoformat()
        }
    finally:
        db.close()