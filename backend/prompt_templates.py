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
      
      If you did not get the recruiter name, address the message to the hiring team.

      Always sign the message with "Best regards, {applicant_name}" at the end.

      Role: {role}
      Company: {company}
      JD Summary: "{jd_summary}"
      My Top Matching Skills: {matches}
      Extra Context: {extra_context}
    """,

    "recruiter_questions": """Based on this JD summary: "{jd_summary}" and key skills: "{skills}", list 5 likely recruiter screening questions for this role and company. One line per question in plain text.""",

    "feedback_summary": """You are a professional career advisor. Your task is to provide a detailed resume critique for a specific job opening. 

Analyze the provided resume against the job description and provide structured feedback in JSON format.

The JSON output must contain a single key "feedback" with a comprehensive analysis string that includes:

1. A "Flaws and Weaknesses:" section listing numbered issues with the resume
2. An "Improvement Points:" section with numbered actionable recommendations

Format each point as: "1. **Title:** Description"

Be specific, actionable, and professional. Focus on ATS compatibility, skill alignment, and presentation improvements.

Return ONLY a valid JSON object with this exact structure:
{{
  "feedback": "Flaws and Weaknesses:\\n1. **Issue Title:** Detailed description...\\n\\nImprovement Points:\\n1. **Improvement Title:** Detailed recommendation..."
}}

JD Summary: {jd_summary}
JD Skills: {skills}
Resume Text: {resume_text}
Extra Context: {extra_context}
""",
# Cover Letter
    "cover_letter": """Write a concise cover letter (<=300 words) for a {role} role at {company}. The letter should use this JD summary: "{jd_summary}", my matching skills: "{matches}", and my extra context: "{extra_context}". Start by mentioning the role in the first sentence. Use concrete examples and a natural tone. Always end with "Sincerely, {applicant_name}". Return in plain text.""",

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
""",

    "extract_name": """You are an expert at extracting personal information from resumes. Your task is to identify the full name of the person from the resume text.

Look for the name in common locations:
1. At the top of the resume (usually the first line or header)
2. In contact information sections
3. In email addresses or signatures

Return a JSON object with the extracted name and confidence score.

If you cannot find a clear name, return "Unknown" with low confidence.

Resume Text:
{resume_text}
"""
}