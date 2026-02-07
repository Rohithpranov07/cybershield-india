#!/usr/bin/env python3
import sys
import os
sys.path.append('app')

from services.ai_detector import AIDetector
import time

print("=" * 50)
print("Testing AI Detection Service")
print("=" * 50)

# Initialize detector
print("\n1. Initializing detector...")
detector = AIDetector()

# Test with an image from test_images folder
print("\n2. Testing image detection...")

# Check if test images exist
test_image = "test_images/ai_generated_1.jpg"

if not os.path.exists(test_image):
    print(f"⚠️  Test image not found: {test_image}")
    print("Please download a test image:")
    print("1. Go to https://thispersondoesnotexist.com/")
    print("2. Save image as: test_images/ai_generated_1.jpg")
    print("3. Run this script again")
else:
    print(f"Testing with: {test_image}")
    
    start_time = time.time()
    result = detector.detect_fake_image(test_image)
    elapsed = time.time() - start_time
    
    print(f"\n✓ Detection completed in {elapsed:.2f}s")
    print(f"Results:")
    print(f"  - AI Generated: {result.get('is_ai_generated')}")
    print(f"  - Confidence: {result.get('confidence', 0):.2%}")
    print(f"  - Model: {result.get('model', 'N/A')}")
    
    if result.get('error'):
        print(f"  - Error: {result['error']}")

print("\n" + "=" * 50)
print("Test complete!")
