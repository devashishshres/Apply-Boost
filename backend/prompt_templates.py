PROMPT_TEMPLATES = {
# Job Description
    "jd_extract": """As an expert job analyst, extract the most critical information from a Job Description (JD).
Your task is to identify the job title, a 2-sentence executive summary, 8 key technical skills, 3 non-negotiable must-haves, and a brief company mission statement.
Strictly return a single JSON object.

{{
  "title": "Job Title",
  "summary": "A 2-sentence summary of the job.",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"],
  "mustHaves": ["must_have1", "must_have2", "must_have3"],
  "missionStatement": "The company's mission statement or a summary of its purpose."
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
    "outreach": """
      You are a professional job seeker. Draft a concise recruiter message (120-150 words) to a recruiter about a specific role.

      The message must:

      Introduce yourself and express your interest in the role and company.

      Clearly state how your skills align with the job description.

      Include a smart, insightful question about the position or company culture.

      Maintain a friendly, professional, and confident tone.

      Role: {role}
      Company: {company}
      JD Summary: "{jd_summary}"
      My Top Matching Skills: {matches}
      Extra Context: {extra_context}
    """,

    "recruiter_questions": """Based on this JD summary: "{jd_summary}" and key skills: "{skills}", list 5 likely recruiter screening questions for this role and company. One line per question in plain text.""",

    "feedback_summary": """ou are a professional career advisor. Your task is to provide a detailed resume critique for a specific job opening. The critique must be delivered in a single JSON object.

    The JSON output should contain a single key, feedback, which holds all the analysis. Within this key, first find and list the flaws and weaknesses in the resume based on the job description. Then, in a separate section, provide concrete improvement points to address those flaws.

    The feedback should be comprehensive, actionable, and formatted as a single string. Use headings like "Flaws and Weaknesses" and "Improvement Points" within the string to organize the content clearly.
Return a single JSON object with the structure:
{{
  "feedback": "feedback and improvement in resume",
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