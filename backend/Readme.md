### 1\. JD Extraction API 🔍

  * **Endpoint:** `/api/jd/extract`
  * **Method:** `POST`
  * **Description:** Analyzes a job description to extract a concise summary, key skills, and must-have requirements. It uses the Gemini LLM to process the text and return a structured JSON response.
  * **Expected Input (JSON):**
    ```json
    {
      "jdText": "string"
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "summary": "string",
      "skills": ["string", "string", ...],
      "mustHaves": ["string", "string", "string"]
    }
    ```
      * **summary:** A 2-sentence summary of the job description.
      * **skills:** A list of 8 key skills identified in the JD.
      * **mustHaves:** A list of 3 must-have requirements.

-----

### 2\. Resume Mapping API 🎯

  * **Endpoint:** `/api/resume/map`
  * **Method:** `POST`
  * **Description:** Compares skills extracted from a job description against a user's resume text to identify matching skills and skills that are a gap.
  * **Expected Input (JSON):**
    ```json
    {
      "skills": ["string", "string", ...],
      "resumeText": "string"
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "matches": ["string", "string", ...],
      "gaps": ["string", "string", ...]
    }
    ```
      * **matches:** A list of skills found in both the JD and the resume.
      * **gaps:** A list of skills from the JD that are not found in the resume.

-----

### 3\. Generate Recruiter Outreach API 👋

  * **Endpoint:** `/api/actions/outreach`
  * **Method:** `POST`
  * **Description:** Generates a personalized recruiter message (120-150 words) for a specific job role, company, and user's skills. The message is designed to be friendly and asks a single, smart question.
  * **Expected Input (JSON):**
    ```json
    {
      "role": "string",
      "company": "string",
      "jdSummary": "string",
      "matches": ["string", "string", ...],
      "extraContext": "string" (optional)
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "text": "string"
    }
    ```
      * **text:** The full, generated recruiter message.

-----

### 4\. Generate Recruiter Questions API ❓

  * **Endpoint:** `/api/actions/recruiter-questions`
  * **Method:** `POST`
  * **Description:** Generates a list of 5 likely screening questions a recruiter might ask for a given role, based on the job description summary and key skills.
  * **Expected Input (JSON):**
    ```json
    {
      "jdSummary": "string",
      "skills": ["string", "string", ...]
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "questions": ["string", "string", "string", "string", "string"]
    }
    ```
      * **questions:** A list of 5 generated questions.

-----

### 5\. Tailor Resume Snippet API ✂️

  * **Endpoint:** `/api/actions/tailor`
  * **Method:** `POST`
  * **Description:** Rewrites a resume summary and three bullet points to align with a specific job description's summary and skills.
  * **Expected Input (JSON):**
    ```json
    {
      "jdSummary": "string",
      "skills": ["string", "string", ...],
      "resumeText": "string",
      "extraContext": "string" (optional)
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "summary": "string",
      "bullets": ["string", "string", "string"]
    }
    ```
      * **summary:** The rewritten 2-3 line resume summary.
      * **bullets:** A list of 3 rewritten bullet points.

-----

### 6\. Generate Cover Letter API ✉️

  * **Endpoint:** `/api/actions/cover-letter`
  * **Method:** `POST`
  * **Description:** Generates a concise cover letter (under 300 words) for a specific role and company, tailored to the user's matching skills.
  * **Expected Input (JSON):**
    ```json
    {
      "role": "string",
      "company": "string",
      "jdSummary": "string",
      "matches": ["string", "string", ...],
      "extraContext": "string" (optional)
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "text": "string"
    }
    ```
      * **text:** The full, generated cover letter.

-----

### 7\. Save Memory (Placeholder) 🧠

  * **Endpoint:** `/api/memory/save`
  * **Method:** `POST`
  * **Description:** A placeholder endpoint to save a generated item (like a cover letter or resume snippet) as a "memory" in a long-term storage system (e.g., Supermemory API).
  * **Expected Input (JSON):**
    ```json
    {
      "type": "string",
      "company": "string",
      "role": "string",
      "text": "string",
      "tags": ["string", ...],
      "link": "string" (optional)
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "id": "string"
    }
    ```
      * **id:** A unique identifier for the saved memory.

-----

### 8\. Search Memory (Placeholder) 🔎

  * **Endpoint:** `/api/memory/search`
  * **Method:** `POST`
  * **Description:** A placeholder endpoint to search for previously saved memories based on a query and/or tags.
  * **Expected Input (JSON):**
    ```json
    {
      "query": "string" (optional),
      "tags": ["string", ...] (optional)
    }
    ```
  * **Expected Output (JSON):**
    ```json
    {
      "items": [
        {
          "type": "string",
          "company": "string",
          "role": "string",
          "text": "string",
          "tags": ["string", ...],
          "link": "string"
        },
        ...
      ]
    }
    ```
      * **items:** A list of memory objects that match the search criteria.