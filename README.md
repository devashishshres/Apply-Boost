# Apply-Boost

> Transform any job application into a winning strategy with AI-powered application materials generation.

## Overview

**Apply-Boost** is an intelligent job application assistant that leverages artificial intelligence to help job seekers create compelling, personalized application materials. By analyzing your resume against specific job descriptions, Apply-Boost generates tailored content that significantly improves your chances of landing interviews.

https://github.com/user-attachments/assets/7dc871e8-7255-4c07-90cf-5dfcc89265aa

## Problem Statement

Job applications today face several critical challenges:

- **Generic Applications**: Most applicants submit the same resume and cover letter for every job
- **Skills Mismatch**: Difficulty identifying and highlighting relevant skills for specific roles  
- **Time-Intensive Process**: Creating personalized application materials is extremely time-consuming
- **ATS Optimization**: Many resumes fail to pass Applicant Tracking Systems due to poor keyword alignment
- **Recruiter Outreach**: Crafting effective networking messages requires expertise most job seekers lack

Apply-Boost solves these problems by automating the creation of highly personalized, ATS-optimized application materials in minutes instead of hours.

## Key Features

### 🎨 **Intelligent Content Generation**
- **Personalized Cover Letters**: AI-crafted letters that highlight your most relevant experiences
- **Recruiter Outreach Messages**: Professional networking messages with strategic questions
- **Resume Optimization**: Tailored bullet points and summaries aligned with job requirements
- **Interview Preparation**: Likely screening questions based on the job description

### 🔍 **Smart Analysis**
- **Skills Gap Analysis**: Identifies matches and gaps between your resume and job requirements
- **Job Fraud Detection**: AI-powered screening for suspicious job postings
- **ATS Compatibility**: Ensures generated content is optimized for applicant tracking systems

### 💼 **Professional Features**
- **Real-time Processing**: Instant generation of all application materials
- **Copy-to-Clipboard**: Easy copying of generated content for immediate use
- **PDF Export**: Download cover letters as PDF documents

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 15](https://nextjs.org/) with TypeScript
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom component library
- **UI Components**: [Radix UI](https://www.radix-ui.com/) primitives with [Lucide React](https://lucide.dev/) icons
- **PDF Processing**: [PDF.js](https://mozilla.github.io/pdf.js/) for text extraction
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF) for document creation

### Backend
- **Framework**: [Flask](https://flask.palletsprojects.com/) (Python web framework)
- **AI Integration**: [LiteLLM](https://github.com/BerriAI/litellm) for multi-provider LLM access
- **Data Validation**: [Pydantic](https://pydantic.dev/) for request/response validation
- **Memory System**: [Supermemory](https://supermemory.ai/) for intelligent content storage
- **Environment Management**: Python-dotenv for configuration

### AI & APIs
- **Primary LLM**: Google Gemini API for content generation
- **Structured Output**: Pydantic models ensure consistent AI responses
- **Multi-model Support**: LiteLLM enables switching between different AI providers

## 🎯 How It Works

1. **Upload & Analyze**: Upload your resume and paste the target job description
2. **AI Processing**: Advanced AI extracts key information from both documents
3. **Skills Mapping**: Intelligent matching identifies your strengths and areas for improvement  
4. **Content Generation**: Personalized application materials are created in seconds
5. **Review & Apply**: Copy or download your tailored content and apply with confidence

# Setup Instructions

This guide will help you connect the frontend and backend components of Apply-Boost.

## Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Install Python dependencies:

    ```bash
    pip install -r requirements.txt
    ```

3. Set up environment variables by creating a `.env` file in the backend directory:

    ```
    GEMINI_API_KEY=your_gemini_api_key_here
    ```

4. Start the Flask backend server:

    ```bash
    python app.py
    ```

    The backend will run on `http://localhost:5000`

## Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend/apply-boost
    ```

2. Install Node.js dependencies:

    ```bash
    npm install
    ```

3. Start the Next.js development server:

    ```bash
    npm run dev
    ```

    The frontend will run on `http://localhost:3000`

## Usage

1. Make sure both backend and frontend servers are running
2. Open your browser to `http://localhost:3000`
3. Upload your resume (PDF, DOC, DOCX, or TXT)
4. Paste the job description
5. Add any additional context (optional)
6. Click "Generate My Application Materials"
7. View your generated:
    - Recruiter outreach message
    - Likely screening questions
    - Tailored cover letter
    - Optimized resume content

## API Endpoints Connected

The frontend now calls these backend endpoints:

-   `/api/jd/extract` - Extracts job description details
-   `/api/resume/map` - Maps resume skills to job requirements
-   `/api/actions/outreach` - Generates recruiter message
-   `/api/actions/recruiter-questions` - Generates screening questions
-   `/api/actions/cover-letter` - Generates cover letter
-   `/api/actions/tailor` - Creates tailored resume content

## Features Added

✅ **API Integration**: Frontend now calls real backend endpoints \
✅ **File Upload**: Resume file upload with validation\
✅ **Error Handling**: Proper error messages and validation\
✅ **Loading States**: Visual feedback during API calls\
✅ **Real-time Results**: Displays actual generated content\
✅ **Copy to Clipboard**: Easy copying of generated content\
✅ **Responsive Design**: Works on all device sizes\

## Environment Configuration

The frontend is configured to connect to the backend at `http://localhost:5000` by default. You can change this by updating the `NEXT_PUBLIC_API_URL` in `.env.local`.

## Next Steps

The application is now fully connected! You can:

-   Test with real job descriptions and resumes
-   Customize the API endpoints as needed
-   Add more features like job fraud detection
-   Implement memory saving/searching functionality
