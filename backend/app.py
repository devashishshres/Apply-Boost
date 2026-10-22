import os
import json
import re
from flask import Flask, request, jsonify
from flask_cors import CORS
from pydantic import BaseModel, Field, ValidationError, field_validator
import litellm
from dotenv import load_dotenv

# Load environment variables before importing modules that read them
load_dotenv()

from database import save_memory, search_memory

# Import the prompt templates
from prompt_templates import PROMPT_TEMPLATES

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

# Set the Gemini API key from environment variables
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    print("WARNING: GEMINI_API_KEY not found in environment variables")
else:
    print(f"GEMINI_API_KEY loaded: {gemini_api_key[:8]}...")

# Set the API key for litellm
os.environ["GEMINI_API_KEY"] = gemini_api_key
litellm.api_key = gemini_api_key

GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini/gemini-3.5-flash-lite")

# =================================================================
# 1) Pydantic Models for Structured Output
# =================================================================


class JDExtract(BaseModel):
    title: str = Field(..., description="Title of the job role")
    summary: str = Field(
        ..., description="A 2-sentence summary of the job description."
    )
    skills: list[str] = Field(..., description="A list of 8 key skills from the JD.")
    mustHaves: list[str] = Field(
        ..., description="A list of 3 must-have requirements from the JD."
    )
    missionStatement: str = Field(..., description="statement of the companies ai")


class ResumeMap(BaseModel):
    matches: list[str] = Field(
        ..., description="A list of skills that match between the JD and resume."
    )
    gaps: list[str] = Field(
        ...,
        description="A list of skills from the JD that are missing from the resume.",
    )
    success: float = Field(..., description="confidence score for getting hired")


class ResumeFeedback(BaseModel):
    feedback: str = Field(
        ..., description="A brief feedback on the resume and also improvments points"
    )


class NameExtraction(BaseModel):
    name: str = Field(..., description="The full name of the person from the resume")
    confidence: float = Field(..., description="Confidence score (0-1) of the name extraction")


class FraudDetectionResult(BaseModel):
    is_suspicious: bool = Field(
        ..., description="True if the job posting is likely fraudulent."
    )
    reason: str = Field(..., description="The main reason for the suspicion.")
    confidence_score: float = Field(
        ..., ge=0.0, le=1.0, description="A confidence score from 0.0 to 1.0."
    )


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
        print(f"Making LLM call with model: {GEMINI_MODEL}")
        print(f"API Key present: {bool(os.getenv('GEMINI_API_KEY'))}")

        response = litellm.completion(
            model=GEMINI_MODEL,
            messages=messages,
            response_format=response_format,
        )

        raw_output = response.choices[0].message.content
        print(f"Raw LLM output: {raw_output[:200]}...")  # Debug output

        if pydantic_model:
            try:
                # Try to clean up common JSON issues
                cleaned_output = raw_output.strip()
                if not cleaned_output.startswith('{'):
                    # Look for JSON within the response
                    json_match = re.search(r'\{.*\}', cleaned_output, re.DOTALL)
                    if json_match:
                        cleaned_output = json_match.group(0)
                    else:
                        raise ValueError(f"No JSON found in response: {cleaned_output[:100]}")
                
                validated_output = pydantic_model.model_validate_json(cleaned_output)
                return validated_output.model_dump()
            except json.JSONDecodeError as e:
                print(f"JSON decode error: {e}")
                print(f"Raw output was: {raw_output}")
                raise ValueError(f"LLM returned malformed JSON: {str(e)}")

        return raw_output

    except ValidationError as e:
        print(f"Pydantic validation failed: {e}")
        raise ValueError("LLM returned malformed JSON.")
    except Exception as e:
        print(f"LLM call failed with error: {type(e).__name__}: {e}")
        # Return more specific error information
        if "api" in str(e).lower() or "key" in str(e).lower():
            raise RuntimeError(f"API authentication failed: {e}")
        elif "quota" in str(e).lower() or "limit" in str(e).lower():
            raise RuntimeError(f"API quota exceeded: {e}")
        else:
            raise RuntimeError(f"LLM API call failed: {e}")


# =================================================================
# 3) API Endpoints
# =================================================================


@app.route("/api/test", methods=["GET"])
def test_api():
    """Simple test endpoint to verify API is working"""
    try:
        # Test a simple LLM call
        result = call_llm("Say 'Hello, API is working!'")
        return jsonify({"status": "success", "message": result})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


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
        jd_skills=", ".join(jd_skills), resume_text=resume_text
    )

    try:
        result = call_llm(prompt, pydantic_model=ResumeMap)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/resume/extract-name", methods=["POST"])
def extract_name():
    data = request.json
    resume_text = data.get("resumeText", "")
    
    prompt = PROMPT_TEMPLATES["extract_name"].format(resume_text=resume_text)
    
    try:
        result = call_llm(prompt, pydantic_model=NameExtraction)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/actions/outreach", methods=["POST"])
def generate_outreach():
    data = request.json
    applicant_name = data.get("applicantName", "[Your Name]")  # Placeholder the user fills in
    
    prompt = PROMPT_TEMPLATES["outreach"].format(
        role=data["role"],
        company=data["company"],
        jd_summary=data["jdSummary"],
        matches=", ".join(data["matches"]),
        extra_context=data.get("extraContext", ""),
        applicant_name=applicant_name,
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
        jd_summary=data["jdSummary"], skills=", ".join(data["skills"])
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
    prompt = PROMPT_TEMPLATES["feedback_summary"].format(
        jd_summary=data["jdSummary"],
        skills=", ".join(data["skills"]),
        resume_text=data["resumeText"],
        extra_context=data.get("extraContext", ""),
    )

    try:
        result = call_llm(prompt, pydantic_model=ResumeFeedback)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/actions/cover-letter", methods=["POST"])
def generate_cover_letter():
    data = request.json
    applicant_name = data.get("applicantName", "[Your Name]")  # Placeholder the user fills in
    
    prompt = PROMPT_TEMPLATES["cover_letter"].format(
        role=data["role"],
        company=data["company"],
        jd_summary=data["jdSummary"],
        matches=", ".join(data["matches"]),
        extra_context=data.get("extraContext", ""),
        applicant_name=applicant_name,
    )

    try:
        text_output = call_llm(prompt)
        return jsonify({"text": text_output})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/jd/detect-fraud", methods=["POST"])
def detect_fraud():
    data = request.json
    jd_text = data.get("jdText", "")

    prompt = PROMPT_TEMPLATES["fraud_detection"].format(jd_text=jd_text)

    try:
        result = call_llm(prompt, pydantic_model=FraudDetectionResult)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


# =================================================================
# 4) Chatbot API Endpoint
# =================================================================
@app.route("/api/chatbot-response", methods=["POST"])
def chatbot_response():
    data = request.json
    user_message = data.get("message", "")
    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    # Each browser gets its own memory container so visitors never see each other's chats
    session_id = data.get("sessionId", "")
    if not re.fullmatch(r"[A-Za-z0-9-]{16,64}", session_id):
        return jsonify({"error": "Invalid session id."}), 400
    container_tag = f"apply-boost-chat-{session_id}"

    # 1. Search Supermemory for context based on the user's message
    search_results = search_memory(user_message, container_tag)
    context = ""
    if search_results:
        # Concatenate memory contents into a single context string
        context_items = [r.memory for r in search_results]
        context = " ".join(context_items)

    # 2. Build the prompt for the LLM
    # The prompt tells the LLM to use the context to answer the user's question
    prompt = f"""You are a helpful assistant. You have access to the following past conversations and memories. Use this information to inform your response. If the information isn't relevant, respond normally.

Memory Context:
{context}

User's Message:
{user_message}
"""

    # 3. Call the LLM to get a response
    try:
        ai_response = call_llm(prompt)

        # 4. Save the conversation to Supermemory for future context
        conversation_content = f"User: {user_message}\nAssistant: {ai_response}"
        save_memory(conversation_content, container_tag)

        # 5. Return the AI's response to the client
        return jsonify({"response": ai_response})

    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)