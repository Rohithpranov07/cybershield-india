#!/usr/bin/env python3
import sys
sys.path.append('app')

from services.pdf_generator import ForensicPDFGenerator
from datetime import datetime

print("=" * 60)
print("Testing PDF Report Generation")
print("=" * 60)

# Create test case data
test_case = {
    'case_id': 'CASE-TEST-20260206-ABC123',
    'timestamp': datetime.now().isoformat(),
    'media_type': 'image',
    'filename': 'test_ai_image.jpg',
    'media_hash': 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6' * 2,
    'confidence': 0.87,
    'is_ai_generated': True,
    'model': 'Organika/sdxl-detector',
    'detection_details': {
        'breakdown': {
            'ml_model_score': 0.92,
            'artifact_score': 0.75
        }
    },
    'blockchain_tx': None
}

print("\n1. Initializing PDF generator...")
pdf_gen = ForensicPDFGenerator()

print("2. Generating forensic report...")
pdf_path = pdf_gen.generate_report(test_case)

print(f"\n✓ PDF generated successfully!")
print(f"Location: {pdf_path}")
print(f"\n3. Opening PDF...")

import subprocess
subprocess.run(['open', pdf_path])  # macOS command to open PDF

print("\n" + "=" * 60)
print("Test complete! Check the opened PDF.")
print("=" * 60)
