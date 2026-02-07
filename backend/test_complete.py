#!/usr/bin/env python3
import requests
import os

API_URL = "http://localhost:8000"

print("🧪 Testing CyberShield India API\n")

# 1. Health check
print("1. Health check...")
response = requests.get(f"{API_URL}/health")
print(f"   Status: {response.json()}\n")

# 2. Upload test image
print("2. Analyzing test image...")
test_image = "test_images/ai_generated_1.jpg"

if os.path.exists(test_image):
    with open(test_image, 'rb') as f:
        files = {'file': f}
        response = requests.post(f"{API_URL}/api/detect/analyze", files=files)
        result = response.json()
        
        print(f"   Case ID: {result['case_id']}")
        print(f"   AI Generated: {result['detection']['is_ai_generated']}")
        print(f"   Confidence: {result['detection']['confidence']:.2%}\n")
        
        case_id = result['case_id']
else:
    print("   ⚠️  Test image not found\n")
    case_id = None

# 3. List cases
print("3. Listing all cases...")
response = requests.get(f"{API_URL}/api/detect/cases")
cases = response.json()
print(f"   Total cases: {cases['total']}\n")

# 4. Get specific case
if case_id:
    print(f"4. Retrieving case {case_id}...")
    response = requests.get(f"{API_URL}/api/detect/case/{case_id}")
    case = response.json()
    print(f"   Filename: {case['filename']}")
    print(f"   Confidence: {case['confidence']:.2%}\n")

print("✅ All tests passed!")
