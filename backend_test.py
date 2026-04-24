import requests
import sys
import json
import base64
from datetime import datetime

class TruthLensAPITester:
    def __init__(self, base_url="https://content-trust-1.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.analysis_id = None

    def run_test(self, name, method, endpoint, expected_status, data=None, files=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {}
        
        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                if files:
                    response = requests.post(url, files=files, data=data, timeout=60)
                else:
                    headers['Content-Type'] = 'application/json'
                    response = requests.post(url, json=data, headers=headers, timeout=60)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    if 'public_id' in response_data:
                        self.analysis_id = response_data['public_id']
                        print(f"   📝 Analysis ID: {self.analysis_id}")
                    return True, response_data
                except:
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                try:
                    error_detail = response.json()
                    print(f"   Error: {error_detail}")
                except:
                    print(f"   Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_health_check(self):
        """Test health endpoint"""
        success, response = self.run_test(
            "Health Check",
            "GET",
            "api/health",
            200
        )
        if success and response.get('status') == 'ok':
            print(f"   ✓ Service: {response.get('service', 'Unknown')}")
            print(f"   ✓ Version: {response.get('version', 'Unknown')}")
        return success

    def test_url_analysis(self, url="https://www.bbc.com/news", language="en"):
        """Test URL analysis endpoint"""
        success, response = self.run_test(
            "URL Analysis",
            "POST",
            "api/analyze/url",
            200,
            data={"url": url, "language": language}
        )
        if success:
            print(f"   ✓ Trust Score: {response.get('trust_score', 'N/A')}")
            print(f"   ✓ Verdict: {response.get('verdict', 'N/A')}")
            print(f"   ✓ URL Title: {response.get('url_title', 'N/A')}")
            print(f"   ✓ Signals: {len(response.get('top_signals', []))}")
        return success, response

    def test_image_analysis(self):
        """Test image analysis with a simple test image"""
        # Create a simple test image (1x1 pixel PNG)
        test_image_b64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAGA4nEKtAAAAABJRU5ErkJggg=="
        test_image_bytes = base64.b64decode(test_image_b64)
        
        files = {
            'file': ('test.png', test_image_bytes, 'image/png'),
            'language': (None, 'en')
        }
        
        success, response = self.run_test(
            "Image Analysis",
            "POST",
            "api/analyze/image",
            200,
            files=files
        )
        if success:
            print(f"   ✓ Trust Score: {response.get('trust_score', 'N/A')}")
            print(f"   ✓ Verdict: {response.get('verdict', 'N/A')}")
            print(f"   ✓ File Size: {response.get('file_size', 'N/A')} bytes")
        return success

    def test_get_recent_analyses(self):
        """Test getting recent analyses"""
        success, response = self.run_test(
            "Get Recent Analyses",
            "GET",
            "api/analyses/recent?limit=10",
            200
        )
        if success:
            analyses = response.get('analyses', [])
            print(f"   ✓ Found {len(analyses)} analyses")
            if analyses:
                print(f"   ✓ Latest analysis type: {analyses[0].get('analysis_type', 'N/A')}")
        return success

    def test_get_specific_analysis(self):
        """Test getting a specific analysis by ID"""
        if not self.analysis_id:
            print("⚠️  Skipping specific analysis test - no analysis ID available")
            return True
            
        success, response = self.run_test(
            "Get Specific Analysis",
            "GET",
            f"api/analyses/{self.analysis_id}",
            200
        )
        if success:
            print(f"   ✓ Analysis Type: {response.get('analysis_type', 'N/A')}")
            print(f"   ✓ Trust Score: {response.get('trust_score', 'N/A')}")
        return success

    def test_get_stats(self):
        """Test getting statistics"""
        success, response = self.run_test(
            "Get Statistics",
            "GET",
            "api/stats",
            200
        )
        if success:
            print(f"   ✓ Total analyses: {response.get('total', 'N/A')}")
            print(f"   ✓ Average score: {response.get('avg_score', 'N/A')}")
            print(f"   ✓ Flagged: {response.get('flagged', 'N/A')}")
            print(f"   ✓ Type distribution: {response.get('type_distribution', {})}")
        return success

    def test_contact_form(self):
        """Test enterprise contact form"""
        test_data = {
            "name": f"Test User {datetime.now().strftime('%H%M%S')}",
            "email": "test@example.com",
            "company": "Test Company",
            "message": "This is a test message from automated testing."
        }
        
        success, response = self.run_test(
            "Contact Form Submission",
            "POST",
            "api/contact",
            200,
            data=test_data
        )
        if success:
            print(f"   ✓ Status: {response.get('status', 'N/A')}")
            print(f"   ✓ Message: {response.get('message', 'N/A')}")
        return success

def main():
    print("🚀 Starting TruthLens API Testing...")
    print("=" * 50)
    
    tester = TruthLensAPITester()
    
    # Test sequence
    tests = [
        ("Health Check", tester.test_health_check),
        ("URL Analysis", lambda: tester.test_url_analysis("https://www.bbc.com/news")),
        ("Image Analysis", tester.test_image_analysis),
        ("Recent Analyses", tester.test_get_recent_analyses),
        ("Specific Analysis", tester.test_get_specific_analysis),
        ("Statistics", tester.test_get_stats),
        ("Contact Form", tester.test_contact_form),
    ]
    
    failed_tests = []
    
    for test_name, test_func in tests:
        try:
            if not test_func():
                failed_tests.append(test_name)
        except Exception as e:
            print(f"❌ {test_name} failed with exception: {str(e)}")
            failed_tests.append(test_name)
    
    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if failed_tests:
        print(f"❌ Failed tests: {', '.join(failed_tests)}")
        return 1
    else:
        print("✅ All tests passed!")
        return 0

if __name__ == "__main__":
    sys.exit(main())