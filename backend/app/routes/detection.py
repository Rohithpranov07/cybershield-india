from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import os
from pathlib import Path
from datetime import datetime

from ..services.ai_detector import get_detector
from ..utils import (
    generate_case_id,
    calculate_file_hash,
    is_image,
    is_video
)
from ..models import SessionLocal, Case

router = APIRouter(prefix="/api/detect", tags=["detection"])

UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
MAX_FILE_SIZE = int(os.getenv("MAX_FILE_SIZE", 52428800))  # 50MB

# Ensure upload directory exists
Path(UPLOAD_FOLDER).mkdir(parents=True, exist_ok=True)


@router.post("/analyze")
async def analyze_media(file: UploadFile = File(...)):
    """
    Analyze uploaded media for AI generation/manipulation
    """
    try:
        # ───── Validate file size ─────
        file.file.seek(0, 2)
        file_size = file.file.tell()
        file.file.seek(0)

        if file_size > MAX_FILE_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"File too large. Max size: {MAX_FILE_SIZE / 1024 / 1024:.1f}MB"
            )

        # ───── Read file ─────
        file_content = await file.read()

        # ───── Hash for forensic integrity ─────
        media_hash = calculate_file_hash(file_content)

        db = SessionLocal()

        try:
            # ───── Check duplicate evidence ─────
            existing_case = db.query(Case).filter(
                Case.media_hash == media_hash
            ).first()

            if existing_case:
                return JSONResponse(content={
                    "success": True,
                    "duplicate": True,
                    "message": "This media was already analyzed",
                    "case_id": existing_case.id,
                    "media_type": existing_case.media_type,
                    "filename": existing_case.filename,
                    "detection": {
                        "is_ai_generated": existing_case.is_ai_generated,
                        "confidence": existing_case.detection_score
                    },
                    "media_hash": media_hash,
                    "timestamp": existing_case.created_at.isoformat()
                })

            # ───── Generate new case ─────
            case_id = generate_case_id()
            filename = file.filename

            if is_image(filename):
                media_type = "image"
            elif is_video(filename):
                media_type = "video"
            else:
                raise HTTPException(
                    status_code=400,
                    detail="Unsupported file type. Upload image or video."
                )

            # ───── Save file ─────
            file_path = Path(UPLOAD_FOLDER) / f"{case_id}_{filename}"
            with open(file_path, "wb") as f:
                f.write(file_content)

            # ───── AI Detection ─────
            detector = get_detector()

            if media_type == "image":
                detection_result = detector.detect_fake_image(str(file_path))
            else:
                detection_result = detector.detect_fake_video(str(file_path))

            if detection_result.get("error"):
                raise HTTPException(
                    status_code=500,
                    detail=f"Detection failed: {detection_result['error']}"
                )

            # ───── Save case to DB ─────
            case = Case(
                id=case_id,
                media_type=media_type,
                filename=filename,
                media_hash=media_hash,
                detection_score=detection_result["confidence"],
                is_ai_generated=detection_result["is_ai_generated"],
                report_path=None,
                blockchain_tx=None,
                created_at=datetime.utcnow()
            )

            db.add(case)
            db.commit()
            db.refresh(case)

        finally:
            db.close()

        # ───── Response ─────
        return JSONResponse(content={
            "success": True,
            "duplicate": False,
            "case_id": case_id,
            "media_type": media_type,
            "filename": filename,
            "detection": {
                "is_ai_generated": detection_result["is_ai_generated"],
                "confidence": detection_result["confidence"],
                "details": detection_result
            },
            "media_hash": media_hash,
            "timestamp": datetime.utcnow().isoformat()
        })

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/case/{case_id}")
async def get_case(case_id: str):
    """
    Get case details by ID
    """
    db = SessionLocal()
    try:
        case = db.query(Case).filter(Case.id == case_id).first()

        if not case:
            raise HTTPException(status_code=404, detail="Case not found")

        return {
            "case_id": case.id,
            "media_type": case.media_type,
            "filename": case.filename,
            "is_ai_generated": case.is_ai_generated,
            "confidence": case.detection_score,
            "report_path": case.report_path,
            "blockchain_tx": case.blockchain_tx,
            "created_at": case.created_at.isoformat()
        }

    finally:
        db.close()


@router.get("/cases")
async def list_cases(limit: int = 10):
    """
    List recent analyzed cases
    """
    db = SessionLocal()
    try:
        cases = (
            db.query(Case)
            .order_by(Case.created_at.desc())
            .limit(limit)
            .all()
        )

        return {
            "total": len(cases),
            "cases": [
                {
                    "case_id": case.id,
                    "media_type": case.media_type,
                    "filename": case.filename,
                    "is_ai_generated": case.is_ai_generated,
                    "confidence": case.detection_score,
                    "created_at": case.created_at.isoformat()
                }
                for case in cases
            ]
        }

    finally:
        db.close()