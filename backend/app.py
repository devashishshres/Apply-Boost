import os
import json
import re
from flask import Flask, request, jsonify
from pydantic import BaseModel, Field, ValidationError, field_validator
import litellm
from dotenv import load_dotenv

# Import the prompt templates
from prompt_templates import PROMPT_TEMPLATES

# Load environment variables from a .env file
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Set the Gemini API key from environment variables
litellm.api_key = os.getenv("GEMINI_API_KEY")

# =================================================================
# 1) Pydantic Models for Structured Output
# =================================================================

class JDExtract(BaseModel):
    summary: str = Field(..., description="A 2-sentence summary of the job description.")
    skills: list[str] = Field(..., description="A list of 8 key skills from the JD.")
    mustHaves: list[str] = Field(..., description="A list of 3 must-have requirements from the JD.")

class ResumeMap(BaseModel):
    matches: list[str] = Field(..., description="A list of skills that match between the JD and resume.")
    gaps: list[str] = Field(..., description="A list of skills from the JD that are missing from the resume.")

class TailoredSnippet(BaseModel):
    summary: str = Field(..., description="A 2-3 line rewritten resume summary.")
    bullets: list[str] = Field(..., description="A list of 3 rewritten resume bullets.")

class FraudDetectionResult(BaseModel):
    is_suspicious: bool = Field(..., description="True if the job posting is likely fraudulent.")
    reason: str = Field(..., description="The main reason for the suspicion.")
    confidence_score: float = Field(..., ge=0.0, le=1.0, description="A confidence score from 0.0 to 1.0.")

# =================================================================
# 2) Helper Functions for LiteLLM Calls
# =================================================================

def call_llm(prompt, pydantic_model=None):
    """
    Generic function to call LiteLLM with a structured output model.
    """
    messages = [{"role": "user", "content": prompt}]

    response_format = {"type": "text"}
    if pydantic_model:
        response_format = {"type": "json_object"}

    try:
        response = litellm.completion(
            model="gemini/gemini-1.5-flash-latest",
            messages=messages,
            response_format=response_format,
        )

        raw_output = response.choices[0].message.content

        if pydantic_model:
            validated_output = pydantic_model.model_validate_json(raw_output)
            return validated_output.model_dump()

        return raw_output

    except ValidationError as e:
        print(f"Pydantic validation failed: {e}")
        raise ValueError("LLM returned malformed JSON.")
    except Exception as e:
        print(f"LLM call failed: {e}")
        raise RuntimeError("LLM API call failed.")

# =================================================================
# 3) API Endpoints
# =================================================================

@app.route("/api/jd/extract", methods=["POST"])
def extract_jd():
    data = request.json
    jd_text = data.get("jdText", "")
    
    prompt = PROMPT_TEMPLATES["jd_extract"].format(jd_text=jd_text)

    try:
        result = call_llm(prompt, pydantic_model=JDExtract)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/resume/map", methods=["POST"])
def map_resume():
    data = request.json
    jd_skills = data.get("skills", [])
    resume_text = data.get("resumeText", "")
    
    prompt = PROMPT_TEMPLATES["resume_map"].format(
        jd_skills=", ".join(jd_skills),
        resume_text=resume_text
    )

    try:
        result = call_llm(prompt, pydantic_model=ResumeMap)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/actions/outreach", methods=["POST"])
def generate_outreach():
    data = request.json
    prompt = PROMPT_TEMPLATES["outreach"].format(
        role=data['role'],
        company=data['company'],
        jd_summary=data['jdSummary'],
        matches=", ".join(data['matches']),
        extra_context=data.get('extraContext', '')
    )

    try:
        text_output = call_llm(prompt)
        return jsonify({"text": text_output})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/actions/recruiter-questions", methods=["POST"])
def generate_questions():
    data = request.json
    prompt = PROMPT_TEMPLATES["recruiter_questions"].format(
        jd_summary=data['jdSummary'],
        skills=", ".join(data['skills'])
    )

    try:
        questions_output = call_llm(prompt)
        questions_list = [q.strip() for q in questions_output.split("\n") if q.strip()]
        return jsonify({"questions": questions_list})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/actions/tailor", methods=["POST"])
def tailor_resume():
    data = request.json
    prompt = PROMPT_TEMPLATES["tailor_resume"].format(
        jd_summary=data['jdSummary'],
        skills=", ".join(data['skills']),
        resume_text=data['resumeText'],
        extra_context=data.get('extraContext', '')
    )

    try:
        result = call_llm(prompt, pydantic_model=TailoredSnippet)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/actions/cover-letter", methods=["POST"])
def generate_cover_letter():
    data = request.json
    prompt = PROMPT_TEMPLATES["cover_letter"].format(
        role=data['role'],
        company=data['company'],
        jd_summary=data['jdSummary'],
        matches=", ".join(data['matches']),
        extra_context=data.get('extraContext', '')
    )

    try:
        text_output = call_llm(prompt)
        return jsonify({"text": text_output})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/jd/detect-fraud', methods=['POST'])
def detect_fraud():
    data = request.json
    jd_text = data.get('jdText', '')
    
    prompt = PROMPT_TEMPLATES["fraud_detection"].format(jd_text=jd_text)
    
    try:
        result = call_llm(prompt, pydantic_model=FraudDetectionResult)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500

# Placeholder for Supermemory API endpoints
@app.route("/api/memory/save", methods=["POST"])
def save_memory():
    data = request.json
    print(f"Saving memory to Supermemory: {data}")
    return jsonify({"id": "some_unique_id"})

@app.route("/api/memory/search", methods=["POST"])
def search_memory():
    data = request.json
    print(
        f"Searching Supermemory for query: {data.get('query')} and tags: {data.get('tags')}"
    )
    return jsonify({"items": []})

if __name__ == "__main__":
    app.run(debug=True)