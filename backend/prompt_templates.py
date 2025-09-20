PROMPT_TEMPLATES = {
    "jd_extract": """Extract 8 key skills and 3 must-have requirements from the following Job Description (JD). Return a single JSON object with the following structure:
{{
  "summary": "A 2-sentence summary of the job description.",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "mustHaves": ["must_have1", "must_have2", "must_have3"]
}}
JD:
{jd_text}
""",

    "resume_map": """Given the following list of JD skills and a resume text, compare them and identify which skills from the list are present in the resume ("matches") and which are not ("gaps"). Return a single JSON object with the following structure:
{{
  "matches": ["matched_skill1", "matched_skill2"],
  "gaps": ["missing_skill1", "missing_skill2"]
}}
JD Skills: {jd_skills}
Resume Text: {resume_text}
""",

    "outreach": """Write a 120-150 word recruiter message for a {role} role at {company}. The JD summary is: "{jd_summary}". My top matching skills are: "{matches}". I also have this extra context: "{extra_context}". The message should be friendly, specific, and ask one smart question. Return plain text.""",

    "recruiter_questions": """Based on this JD summary: "{jd_summary}" and key skills: "{skills}", list 5 likely recruiter screening questions for this role. One line per question. Return plain text.""",

    "tailor_resume": """Rewrite a 2-3 line summary and top 3 bullets for a resume to fit the following JD summary and skills. Keep facts from my original resume and extra context. No buzzwords. Return a single JSON object with the structure:
{{
  "summary": "new summary",
  "bullets": ["bullet1", "bullet2", "bullet3"]
}}
JD Summary: {jd_summary}
JD Skills: {skills}
My Resume Text: {resume_text}
Extra Context: {extra_context}
""",

    "cover_letter": """Write a concise cover letter (<=300 words) for a {role} role at {company}. The letter should use this JD summary: "{jd_summary}", my matching skills: "{matches}", and extra context: "{extra_context}". Start by mentioning the role in the first sentence. Use concrete examples and a natural tone. Return plain text.""",

    "fraud_detection": """You are a fraud detection expert. Analyze the following job posting for common red flags, such as generic descriptions, requests for personal financial information, or promises of unrealistic pay. 
    
Return a single JSON object with the following structure:
{{
  "is_suspicious": boolean,
  "reason": "string",
  "confidence_score": float
}}
    
If no major red flags are found, set is_suspicious to false. If red flags are present, set it to true and provide a concise reason. The confidence score should reflect how strongly you suspect fraud (0.0 for no suspicion, 1.0 for high suspicion).
    
Job Posting:
{jd_text}
"""
}