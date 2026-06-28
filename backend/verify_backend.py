import os
import sys
import time
import requests

def test_backend():
    base_url = "http://127.0.0.1:5000/api"
    print("=== Testing VirtuGym AI Flask Backend ===")
    
    # 1. Health check
    try:
        r = requests.get("http://127.0.0.1:5000/health")
        print(f"Health Check: {r.status_code} - {r.json()}")
    except Exception as e:
        print(f"Backend offline or unreachable: {e}")
        return False

    # 2. Register
    reg_payload = {
        "name": "Validation User",
        "email": f"test_{int(time.time())}@virtugym.ai",
        "password": "securepassword123"
    }
    r = requests.post(f"{base_url}/auth/register", json=reg_payload)
    if r.status_code != 201:
        print(f"FAILED: Registration returned {r.status_code} - {r.text}")
        return False
    
    reg_data = r.json()
    token = reg_data["token"]
    user_id = reg_data["user"]["id"]
    print(f"SUCCESS: Registered user {user_id} and received JWT token.")

    # 3. Login
    login_payload = {
        "email": reg_payload["email"],
        "password": reg_payload["password"]
    }
    r = requests.post(f"{base_url}/auth/login", json=login_payload)
    if r.status_code != 200:
        print(f"FAILED: Login returned {r.status_code} - {r.text}")
        return False
    print("SUCCESS: Logged in successfully.")

    # Headers for JWT endpoints
    headers = {"Authorization": f"Bearer {token}"}

    # 4. Fetch Profile
    r = requests.get(f"{base_url}/auth/me", headers=headers)
    if r.status_code != 200:
        print(f"FAILED: Profile retrieval returned {r.status_code}")
        return False
    print(f"SUCCESS: Fetched user profile: {r.json()['user']['name']}.")

    # 5. Fetch Exercises
    r = requests.get(f"{base_url}/exercises", headers=headers)
    if r.status_code != 200:
        print(f"FAILED: Fetching exercises returned {r.status_code}")
        return False
    exercises = r.json()
    print(f"SUCCESS: Fetched {len(exercises)} seeded exercises.")
    exercise_id = exercises[0]["id"]

    # 6. Start Workout Session
    r = requests.post(f"{base_url}/sessions", json={"exerciseId": exercise_id}, headers=headers)
    if r.status_code != 201:
        print(f"FAILED: Start session returned {r.status_code} - {r.text}")
        return False
    session = r.json()
    session_id = session["sessionId"]
    print(f"SUCCESS: Started workout session {session_id}.")

    # 7. Update Live Tracking Metrics
    r = requests.put(f"{base_url}/sessions/{session_id}", json={"reps": 3, "accuracy": 92}, headers=headers)
    if r.status_code != 200:
        print(f"FAILED: Updating metrics returned {r.status_code}")
        return False
    print("SUCCESS: Saved live metrics update (reps=3, accuracy=92%).")

    # 8. End Workout Session & auto-generate report
    end_payload = {"reps": 12, "accuracy": 94, "duration": 48}
    r = requests.post(f"{base_url}/sessions/{session_id}/end", json=end_payload, headers=headers)
    if r.status_code != 200:
        print(f"FAILED: Ending session returned {r.status_code} - {r.text}")
        return False
    end_data = r.json()
    report_id = end_data["report"]["id"]
    print(f"SUCCESS: Finished session and compiled report {report_id}.")

    # 9. Get Timeline
    r = requests.get(f"{base_url}/analytics/timeline", headers=headers)
    if r.status_code != 200:
        print(f"FAILED: Timeline retrieval returned {r.status_code}")
        return False
    print("SUCCESS: Fetched timeline events.")

    # 10. Export PDF Report
    r = requests.get(f"{base_url}/reports/{report_id}/export", headers=headers)
    if r.status_code != 200:
        print(f"FAILED: PDF export returned {r.status_code}")
        return False
    
    # Save PDF locally to verify
    pdf_path = os.path.join(os.path.dirname(__file__), "test_generated_report.pdf")
    with open(pdf_path, "wb") as f:
        f.write(r.content)
    print(f"SUCCESS: Exported PDF report successfully saved at: {pdf_path}")
    print("=== All Integration Verification Tests Passed! ===")
    return True

if __name__ == "__main__":
    if not test_backend():
        sys.exit(1)
