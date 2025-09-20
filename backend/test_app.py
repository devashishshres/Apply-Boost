import os
import json
import requests

# The URL of your running Flask app
BASE_URL = "http://127.0.0.1:5000/api"

def run_test(name, url, payload):
    """
    Sends a POST request and prints the result.
    """
    print(f"--- Testing API: {name} ---")
    try:
        response = requests.post(url, json=payload)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        
        print("Status: SUCCESS ✅")
        print("Response Code:", response.status_code)
        print("Response Body:\n", json.dumps(response.json(), indent=2))
        
    except requests.exceptions.HTTPError as e:
        print("Status: FAILED ❌")
        print(f"HTTP Error: {e.response.status_code} - {e.response.text}")
    except requests.exceptions.RequestException as e:
        print("Status: FAILED ❌")
        print(f"Request Error: {e}")
    except json.JSONDecodeError:
        print("Status: FAILED ❌")
        print("Error: Could not decode JSON response.")
    print("-" * 30)

if __name__ == '__main__':
    # Make sure your app.py server is running in another terminal
    # before you run this script.

    # 1. Test JD Extraction API
    jd_extract_payload = {
        "jdText": "We are looking for a highly skilled Software Engineer with experience in Python and Flask. Required skills include data modeling and API design. Must-haves are 5+ years of experience and a strong portfolio."
    }
    run_test("JD Extraction", f"{BASE_URL}/jd/extract", jd_extract_payload)

    # 2. Test Resume Mapping API
    resume_map_payload = {
        "skills": ["Python", "Flask", "Data Modeling", "SQL"],
        "resumeText": "Developed a Flask application with data modeling using Python."
    }
    run_test("Resume Mapping", f"{BASE_URL}/resume/map", resume_map_payload)

    # 3. Test Generate Outreach API
    outreach_payload = {
        "role": "Software Engineer",
        "company": "ExampleCorp",
        "jdSummary": "We're looking for a skilled Python developer.",
        "matches": ["Python", "Flask"]
    }
    run_test("Generate Outreach", f"{BASE_URL}/actions/outreach", outreach_payload)

    # 4. Test Generate Recruiter Questions API
    questions_payload = {
        "jdSummary": "Full-stack developer role with React and Node.js.",
        "skills": ["React", "Node.js", "MongoDB"]
    }
    run_test("Generate Recruiter Questions", f"{BASE_URL}/actions/recruiter-questions", questions_payload)

    # 5. Test Tailor Resume API
    tailor_payload = {
        "jdSummary": "Senior Backend Engineer specializing in Python and APIs.",
        "skills": ["Python", "Flask", "API Design"],
        "resumeText": "My resume text. I've built APIs using Flask.",
        "extraContext": "Experienced with microservices architecture."
    }
    run_test("Tailor Resume Snippet", f"{BASE_URL}/actions/tailor", tailor_payload)

    # 6. Test Generate Cover Letter API
    cover_letter_payload = {
        "role": "Frontend Engineer",
        "company": "Innovate Ltd.",
        "jdSummary": "Frontend role with React and TypeScript.",
        "matches": ["React", "TypeScript", "UI/UX"]
    }
    run_test("Generate Cover Letter", f"{BASE_URL}/actions/cover-letter", cover_letter_payload)
    
    # 7. Test Fraud Detection API
    fraud_payload = {
        "jdText": "Work from home and earn $5000 a week. No experience needed! Just send us your bank details for direct deposit and a small registration fee."
    }
    run_test("Fraud Detection", f"{BASE_URL}/jd/detect-fraud", fraud_payload)
    
    # 8. Test Save Memory API (Placeholder)
    save_memory_payload = {
        "type": "outreach",
        "company": "ExampleCorp",
        "role": "Software Engineer",
        "text": "Generated outreach text...",
        "tags": ["company:examplecorp", "role:swe"],
        "link": "https://example.com/job"
    }
    run_test("Save Memory", f"{BASE_URL}/memory/save", save_memory_payload)
    
    # 9. Test Search Memory API (Placeholder)
    search_memory_payload = {
        "query": "React",
        "tags": ["role:frontend"]
    }
    run_test("Search Memory", f"{BASE_URL}/memory/search", search_memory_payload)