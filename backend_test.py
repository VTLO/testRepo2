import requests
import sys
import json
from datetime import datetime

class CyberCopiloteAPITester:
    def __init__(self, base_url="https://cyber-copilote.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        if headers is None:
            headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=30)

            print(f"   Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                    return True, response_data
                except:
                    print(f"   Response: {response.text[:200]}...")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")
                return False, {}

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_health_endpoint(self):
        """Test health check endpoint"""
        return self.run_test(
            "Health Check",
            "GET", 
            "api/health",
            200
        )

    def test_chat_endpoint(self):
        """Test chat endpoint with AI integration"""
        chat_data = {
            "message": "Bonjour, pouvez-vous m'expliquer ce qu'est le phishing ?",
            "session_id": None,
            "context": "Score global: 65/100 (Risque Modere). Categories faibles: account_security, backup.",
            "history": []
        }
        
        success, response = self.run_test(
            "Chat AI Endpoint",
            "POST",
            "api/chat",
            200,
            data=chat_data
        )
        
        if success and response:
            # Verify response structure
            if 'reply' in response and 'session_id' in response:
                print(f"   ✅ Response has correct structure")
                print(f"   Reply length: {len(response.get('reply', ''))}")
                return True
            else:
                print(f"   ❌ Response missing required fields")
                return False
        return success

    def test_chat_with_history(self):
        """Test chat endpoint with conversation history"""
        chat_data = {
            "message": "Merci pour l'explication. Comment puis-je me proteger ?",
            "session_id": "test-session-123",
            "context": "Score global: 65/100 (Risque Modere).",
            "history": [
                {"role": "user", "content": "Qu'est-ce que le phishing ?"},
                {"role": "assistant", "content": "Le phishing est une technique d'hameçonnage..."}
            ]
        }
        
        return self.run_test(
            "Chat with History",
            "POST",
            "api/chat", 
            200,
            data=chat_data
        )

def main():
    print("🚀 Starting CyberCopilote TPME Backend API Tests")
    print("=" * 60)
    
    # Setup
    tester = CyberCopiloteAPITester()
    
    # Run tests
    print("\n📋 Testing Basic Endpoints...")
    tester.test_root_endpoint()
    tester.test_health_endpoint()
    
    print("\n🤖 Testing AI Chat Integration...")
    tester.test_chat_endpoint()
    tester.test_chat_with_history()
    
    # Print results
    print("\n" + "=" * 60)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} tests passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All backend tests passed!")
        return 0
    else:
        print("❌ Some backend tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())