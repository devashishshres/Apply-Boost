import os
import json
import re
from flask import Flask, request, jsonify
from pydantic import BaseModel, Field, ValidationError, field_validator
import litellm
from dotenv import load_dotenv

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
    summary: str = Field(
        ..., description="A 2-sentence summary of the job description."
    )
    skills: list[str] = Field(..., description="A list of 8 key skills from the JD.")
    mustHaves: list[str] = Field(
        ..., description="A list of 3 must-have requirements from the JD."
    )


class ResumeMap(BaseModel):
    matches: list[str] = Field(
        ..., description="A list of skills that match between the JD and resume."
    )
    gaps: list[str] = Field(
        ...,
        description="A list of skills from the JD that are missing from the resume.",
    )


class TailoredSnippet(BaseModel):
    summary: str = Field(..., description="A 2-3 line rewritten resume summary.")
    bullets: list[str] = Field(..., description="A list of 3 rewritten resume bullets.")


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
        # Pydantic's schema is not directly passed to LiteLLM,
        # but the prompt should instruct the LLM on the required format.
        # We will add a JSON format instruction to the prompt itself.

    try:
        response = litellm.completion(
            model="gemini/gemini-1.5-flash-latest",
            messages=messages,
            response_format=response_format,
        )

        raw_output = response.choices[0].message.content

        if pydantic_model:
            # Manually parse the JSON string and validate with Pydantic
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

    prompt = f"""Extract 8 key skills and 3 must-have requirements from the following Job Description (JD). Return a single JSON object with the following structure:
{{
  "summary": "A 2-sentence summary of the job description.",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "mustHaves": ["must_have1", "must_have2", "must_have3"]
}}
JD:
{jd_text}
"""
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

    prompt = f"""Given the following list of JD skills and a resume text, compare them and identify which skills from the list are present in the resume ("matches") and which are not ("gaps"). Return a single JSON object with the following structure:
{{
  "matches": ["matched_skill1", "matched_skill2"],
  "gaps": ["missing_skill1", "missing_skill2"]
}}
JD Skills: {", ".join(jd_skills)}
Resume Text: {resume_text}
"""
    try:
        result = call_llm(prompt, pydantic_model=ResumeMap)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/actions/outreach", methods=["POST"])
def generate_outreach():
    data = request.json
    prompt = f"""Write a 120-150 word recruiter message for a {data['role']} role at {data['company']}. The JD summary is: "{data['jdSummary']}". My top matching skills are: "{', '.join(data['matches'])}". I also have this extra context: "{data.get('extraContext', '')}". The message should be friendly, specific, and ask one smart question. Return plain text."""

    try:
        text_output = call_llm(prompt)
        return jsonify({"text": text_output})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/actions/recruiter-questions", methods=["POST"])
def generate_questions():
    data = request.json
    prompt = f"""Based on this JD summary: "{data['jdSummary']}" and key skills: "{', '.join(data['skills'])}", list 5 likely recruiter screening questions for this role. One line per question. Return plain text."""

    try:
        questions_output = call_llm(prompt)
        # Split the output into a list of strings
        questions_list = [q.strip() for q in questions_output.split("\n") if q.strip()]
        return jsonify({"questions": questions_list})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/actions/tailor", methods=["POST"])
def tailor_resume():
    data = request.json
    prompt = f"""Rewrite a 2-3 line summary and top 3 bullets for a resume to fit the following JD summary and skills. Keep facts from my original resume and extra context. No buzzwords. Return a single JSON object with the structure:
{{
  "summary": "new summary",
  "bullets": ["bullet1", "bullet2", "bullet3"]
}}
JD Summary: {data['jdSummary']}
JD Skills: {', '.join(data['skills'])}
My Resume Text: {data['resumeText']}
Extra Context: {data.get('extraContext', '')}
"""
    try:
        result = call_llm(prompt, pydantic_model=TailoredSnippet)
        return jsonify(result)
    except (ValueError, RuntimeError) as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/actions/cover-letter", methods=["POST"])
def generate_cover_letter():
    data = request.json
    prompt = f"""Write a concise cover letter (<=300 words) for a {data['role']} role at {data['company']}. The letter should use this JD summary: "{data['jdSummary']}", my matching skills: "{', '.join(data['matches'])}", and extra context: "{data.get('extraContext', '')}". Start by mentioning the role in the first sentence. Use concrete examples and a natural tone. Return plain text."""

    try:
        text_output = call_llm(prompt)
        return jsonify({"text": text_output})
    except RuntimeError as e:
        return jsonify({"error": str(e)}), 500


# Placeholder for Supermemory API endpoints
# You would replace this with actual logic to call the Supermemory API
@app.route("/api/memory/save", methods=["POST"])
def save_memory():
    # Placeholder logic
    data = request.json
    print(f"Saving memory to Supermemory: {data}")
    return jsonify({"id": "some_unique_id"})


@app.route("/api/memory/search", methods=["POST"])
def search_memory():
    # Placeholder logic
    data = request.json
    print(
        f"Searching Supermemory for query: {data.get('query')} and tags: {data.get('tags')}"
    )
    # Return a dummy list of results
    return jsonify({"items": []})


if __name__ == "__main__":
    # Add your Gemini API key to a .env file or set it as an environment variable
    # e.g., export GEMINI_API_KEY="your-api-key"
    app.run(debug=True)
