from transformers import pipeline
from PIL import Image
import torch
import numpy as np
import cv2
import os
from pathlib import Path


class AIDetector:
    def __init__(self):
        """Initialize AI detection models"""
        print("\nLoading AI detection models...\n")

        # Use GPU if available, else CPU
        self.device = 0 if torch.cuda.is_available() else -1

        # Strong → fallback models (ordered by accuracy)
        self.models_to_try = [
            "Organika/sdxl-detector",                 # Very good for modern AI images
            "dima806/deepfake_vs_real_image_detection",  # Strong forensic model
            "umm-maybe/AI-image-detector",            # Lightweight fallback
        ]

        self.image_classifier = None
        self.model_name = None

        for model_name in self.models_to_try:
            try:
                print(f"Trying to load: {model_name}")

                self.image_classifier = pipeline(
                    "image-classification",
                    model=model_name,
                    device=self.device
                )

                self.model_name = model_name
                print(f"✅ Loaded model: {model_name}\n")
                break

            except Exception as e:
                print(f"❌ Failed loading {model_name}: {str(e)}\n")
                continue

        if self.image_classifier is None:
            raise RuntimeError("No AI detection model could be loaded!")

        print("AI Detection Service initialized successfully 🚀")

    # ------------------------------------------------

    def detect_fake_image(self, image_path: str) -> dict:
        """Detect AI-generated image"""

        try:
            image = Image.open(image_path).convert("RGB")

            results = self.image_classifier(image)

            ai_score = 0.0
            real_score = 0.0

            for r in results:
                label = r["label"].lower()
                score = float(r["score"])

                if any(word in label for word in ["fake", "ai", "generated", "artificial"]):
                    ai_score = max(ai_score, score)

                if any(word in label for word in ["real", "authentic", "human", "natural"]):
                    real_score = max(real_score, score)

            # Normalize if needed
            if ai_score == 0 and real_score > 0:
                ai_score = 1 - real_score

            is_ai = ai_score >= 0.5

            return {
                "is_ai_generated": is_ai,
                "confidence": round(ai_score, 4),
                "model_used": self.model_name,
                "raw_results": results
            }

        except Exception as e:
            return {
                "error": str(e),
                "is_ai_generated": None,
                "confidence": 0.0
            }

    # ------------------------------------------------

    def detect_fake_video(self, video_path: str, sample_rate: int = 15) -> dict:
        """Detect deepfake video using frame sampling"""

        try:
            cap = cv2.VideoCapture(video_path)

            if not cap.isOpened():
                return {"error": "Unable to open video"}

            total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))

            analyzed = 0
            ai_scores = []

            max_frames = min(40, total_frames // sample_rate + 1)

            frame_index = 0

            while cap.isOpened() and analyzed < max_frames:
                ret, frame = cap.read()
                if not ret:
                    break

                if frame_index % sample_rate == 0:
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    pil_img = Image.fromarray(frame_rgb)

                    temp_path = f"/tmp/frame_{analyzed}.jpg"
                    pil_img.save(temp_path)

                    result = self.detect_fake_image(temp_path)

                    if result.get("confidence") is not None:
                        ai_scores.append(result["confidence"])

                    os.remove(temp_path)
                    analyzed += 1

                frame_index += 1

            cap.release()

            if not ai_scores:
                return {"error": "No frames processed"}

            avg_conf = float(np.mean(ai_scores))
            max_conf = float(np.max(ai_scores))

            return {
                "is_ai_generated": avg_conf >= 0.5,
                "confidence": round(avg_conf, 4),
                "max_confidence": round(max_conf, 4),
                "frames_analyzed": analyzed,
                "model_used": self.model_name
            }

        except Exception as e:
            return {
                "error": str(e),
                "is_ai_generated": None,
                "confidence": 0.0
            }


# ------------------------------------------------
# Singleton loader (so model loads only once)

_detector_instance = None


def get_detector():
    global _detector_instance

    if _detector_instance is None:
        _detector_instance = AIDetector()

    return _detector_instance