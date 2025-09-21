PROMPT_TEMPLATES = {
# Job Description
    "jd_extract": """Extract 8 key skills and 3 must-have requirements from the following Job Description (JD). Return a single JSON object with the following structure:
{{
  "title": "The job title",
  "summary": "A 2-sentence summary of the job description.",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "mustHaves": ["must_have1", "must_have2", "must_have3"]
  "missionStatment": "A breif description about the company's mission and culture"
}}
JD:
{jd_text}
""",
# Resume Map
    "resume_map": """Given the following list of JD skills and a resume text, compare them and identify all the skills from the list that are present in the resume ("matches") and all the ones that are not ("gaps"). Based on the skills present in "matches" and the ones in "gaps" calculate the success rate of getting the job ("success"). Return a single JSON object with the following structure:
{{
  "matches": ["matched_skill1", "matched_skill2"],
  "gaps": ["missing_skill1", "missing_skill2"]
  "success": float
}}
JD Skills: {jd_skills}
Resume Text: {resume_text}
""",
# Outreach
    "outreach": """Write a 120-150 word recruiter message for a {role} role at {company}. The JD summary is: "{jd_summary}". My top matching skills are: "{matches}". I also have this extra context: "{extra_context}". The message should be friendly, specific, and ask a smart question about the job, position or company. Return in plain text.""",

    "recruiter_questions": """Based on this JD summary: "{jd_summary}" and key skills: "{skills}", list 5 likely recruiter screening questions for this role and company. One line per question in plain text.""",

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
# Cover Letter
    "cover_letter": """Write a concise cover letter (<=300 words) for a {role} role at {company}. The letter should use this JD summary: "{jd_summary}", my matching skills: "{matches}", and my extra context: "{extra_context}". Start by mentioning the role in the first sentence. Use concrete examples and a natural tone. Return in plain text.""",

    "fraud_detection": """You are a fraud detection expert. Analyze the following job posting for common red flags, such as generic descriptions, requests for personal financial information, or promises of unrealistic pay for that role. 
    
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
