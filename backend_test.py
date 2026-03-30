#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class CyberCopiloteAPITester:
    def __init__(self, base_url="https://cyber-copilote.preview.emergentagent.com"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tests_run = 0
        self.tests_passed = 0
        self.admin_credentials = {
            "email": "admin@cybercopilote.fr",
            "password": "CyberAdmin2026!"
        }

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name} - {details}")
        return success

    def test_health_endpoints(self):
        """Test basic health endpoints"""
        print("\n🔍 Testing Health Endpoints...")
        
        # Test root endpoint
        try:
            response = self.session.get(f"{self.base_url}/api/")
            success = response.status_code == 200 and "CyberCopilote TPME API" in response.json().get("message", "")
            self.log_test("Root API endpoint", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Root API endpoint", False, str(e))

        # Test health endpoint
        try:
            response = self.session.get(f"{self.base_url}/api/health")
            success = response.status_code == 200 and response.json().get("status") == "ok"
            self.log_test("Health endpoint", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Health endpoint", False, str(e))

    def test_auth_register(self):
        """Test user registration"""
        print("\n🔍 Testing User Registration...")
        
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@example.com"
        test_data = {
            "email": test_email,
            "password": "TestPassword123!",
            "name": "Test User"
        }
        
        try:
            response = self.session.post(f"{self.base_url}/api/auth/register", json=test_data)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = all(key in data for key in ["id", "email", "name", "role"])
                if success:
                    print(f"   Registered user: {data['email']} (ID: {data['id']})")
            self.log_test("User registration", success, f"Status: {response.status_code}")
            return test_email if success else None
        except Exception as e:
            self.log_test("User registration", False, str(e))
            return None

    def test_auth_login(self):
        """Test admin login"""
        print("\n🔍 Testing Admin Login...")
        
        try:
            response = self.session.post(f"{self.base_url}/api/auth/login", json=self.admin_credentials)
            success = response.status_code == 200
            if success:
                data = response.json()
                success = all(key in data for key in ["id", "email", "role"])
                if success and data.get("role") == "admin":
                    print(f"   Logged in as: {data['email']} (Role: {data['role']})")
                else:
                    success = False
            self.log_test("Admin login", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Admin login", False, str(e))
            return False

    def test_auth_me(self):
        """Test current user endpoint"""
        print("\n🔍 Testing Current User Endpoint...")
        
        try:
            response = self.session.get(f"{self.base_url}/api/auth/me")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = all(key in data for key in ["id", "email", "role"])
                if success:
                    print(f"   Current user: {data['email']} (Role: {data['role']})")
            self.log_test("Get current user", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Get current user", False, str(e))
            return False

    def test_email_monitoring(self):
        """Test email monitoring endpoints"""
        print("\n🔍 Testing Email Monitoring...")
        
        # Test adding email
        test_email = "test@yahoo.com"  # Known to have breaches
        try:
            response = self.session.post(f"{self.base_url}/api/emails", json={"email": test_email})
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "id" in data and data.get("email") == test_email
                email_id = data.get("id") if success else None
            self.log_test("Add email for monitoring", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Add email for monitoring", False, str(e))
            email_id = None

        # Test listing emails
        try:
            response = self.session.get(f"{self.base_url}/api/emails")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = isinstance(data, list)
                if success:
                    print(f"   Found {len(data)} monitored emails")
            self.log_test("List monitored emails", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("List monitored emails", False, str(e))

        # Test email breach check
        try:
            response = self.session.post(f"{self.base_url}/api/security/check-email", json={"email": test_email})
            success = response.status_code == 200
            if success:
                data = response.json()
                required_fields = ["email", "risk_score", "risk_level", "breaches_found", "provider_info"]
                success = all(field in data for field in required_fields)
                if success:
                    print(f"   Email check: {data['email']} - Risk: {data['risk_level']} ({data['risk_score']}/100)")
                    print(f"   Breaches found: {len(data['breaches_found'])}")
            self.log_test("Email breach check", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Email breach check", False, str(e))

        # Clean up - remove test email
        if email_id:
            try:
                response = self.session.delete(f"{self.base_url}/api/emails/{email_id}")
                success = response.status_code == 200
                self.log_test("Remove monitored email", success, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test("Remove monitored email", False, str(e))

    def test_domain_security(self):
        """Test domain security check"""
        print("\n🔍 Testing Domain Security Check...")
        
        test_domain = "google.com"  # Well-configured domain
        try:
            response = self.session.post(f"{self.base_url}/api/security/check-domain", json={"domain": test_domain})
            success = response.status_code == 200
            if success:
                data = response.json()
                required_fields = ["domain", "score", "risk_level", "checks", "mx_records", "spf", "dmarc", "ssl"]
                success = all(field in data for field in required_fields)
                if success:
                    print(f"   Domain: {data['domain']} - Score: {data['score']}/{data.get('max_score', 100)}")
                    print(f"   Risk level: {data['risk_level']}")
                    print(f"   Checks performed: {len(data['checks'])}")
            self.log_test("Domain security check", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Domain security check", False, str(e))

    def test_password_breach(self):
        """Test password breach check"""
        print("\n🔍 Testing Password Breach Check...")
        
        # Test with known compromised password
        test_password = "password123"
        try:
            response = self.session.post(f"{self.base_url}/api/security/check-password", json={"password": test_password})
            success = response.status_code == 200
            if success:
                data = response.json()
                required_fields = ["compromised", "appearances", "strength", "strength_label", "recommendations"]
                success = all(field in data for field in required_fields)
                if success:
                    print(f"   Password compromised: {data['compromised']}")
                    print(f"   Appearances in breaches: {data['appearances']}")
                    print(f"   Strength: {data['strength_label']} ({data['strength']}/6)")
            self.log_test("Password breach check", success, f"Status: {response.status_code}")
        except Exception as e:
            self.log_test("Password breach check", False, str(e))

    def test_auth_logout(self):
        """Test logout"""
        print("\n🔍 Testing Logout...")
        
        try:
            response = self.session.post(f"{self.base_url}/api/auth/logout")
            success = response.status_code == 200
            if success:
                data = response.json()
                success = "message" in data
            self.log_test("Logout", success, f"Status: {response.status_code}")
            return success
        except Exception as e:
            self.log_test("Logout", False, str(e))
            return False

    def test_unauthorized_access(self):
        """Test that protected endpoints require authentication"""
        print("\n🔍 Testing Unauthorized Access Protection...")
        
        protected_endpoints = [
            ("/api/auth/me", "GET"),
            ("/api/emails", "GET"),
            ("/api/security/check-email", "POST"),
            ("/api/security/check-domain", "POST"),
            ("/api/security/check-password", "POST")
        ]
        
        for endpoint, method in protected_endpoints:
            try:
                if method == "GET":
                    response = self.session.get(f"{self.base_url}{endpoint}")
                else:
                    response = self.session.post(f"{self.base_url}{endpoint}", json={})
                
                success = response.status_code == 401
                self.log_test(f"Unauthorized access to {endpoint}", success, f"Status: {response.status_code}")
            except Exception as e:
                self.log_test(f"Unauthorized access to {endpoint}", False, str(e))

    def run_all_tests(self):
        """Run all tests in sequence"""
        print("🚀 Starting CyberCopilote API Tests...")
        print(f"Testing against: {self.base_url}")
        
        # Test basic health
        self.test_health_endpoints()
        
        # Test registration
        test_user_email = self.test_auth_register()
        
        # Test login with admin
        login_success = self.test_auth_login()
        
        if login_success:
            # Test authenticated endpoints
            self.test_auth_me()
            self.test_email_monitoring()
            self.test_domain_security()
            self.test_password_breach()
            
            # Test logout
            self.test_auth_logout()
        
        # Test unauthorized access
        self.test_unauthorized_access()
        
        # Print summary
        print(f"\n📊 Test Summary:")
        print(f"Tests run: {self.tests_run}")
        print(f"Tests passed: {self.tests_passed}")
        print(f"Success rate: {(self.tests_passed/self.tests_run*100):.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    tester = CyberCopiloteAPITester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())