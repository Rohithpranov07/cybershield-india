import hashlib
import uuid
from datetime import datetime
from pathlib import Path

def generate_case_id():
    """Generate unique case ID"""
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    return f"CASE-{timestamp}-{unique_id}"

def calculate_file_hash(file_content: bytes) -> str:
    """Calculate SHA-256 hash of file"""
    return hashlib.sha256(file_content).hexdigest()

def get_file_extension(filename: str) -> str:
    """Get file extension"""
    return Path(filename).suffix.lower()

def is_image(filename: str) -> bool:
    """Check if file is an image"""
    image_extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp']
    return get_file_extension(filename) in image_extensions

def is_video(filename: str) -> bool:
    """Check if file is a video"""
    video_extensions = ['.mp4', '.avi', '.mov', '.mkv', '.webm']
    return get_file_extension(filename) in video_extensions
