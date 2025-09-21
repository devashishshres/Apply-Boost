# Apply-Boost Setup Instructions

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

✅ **API Integration**: Frontend now calls real backend endpoints
✅ **File Upload**: Resume file upload with validation
✅ **Error Handling**: Proper error messages and validation
✅ **Loading States**: Visual feedback during API calls
✅ **Real-time Results**: Displays actual generated content
✅ **Copy to Clipboard**: Easy copying of generated content
✅ **Responsive Design**: Works on all device sizes

## Environment Configuration

The frontend is configured to connect to the backend at `http://localhost:5000` by default. You can change this by updating the `NEXT_PUBLIC_API_URL` in `.env.local`.

## Next Steps

The application is now fully connected! You can:

-   Test with real job descriptions and resumes
-   Customize the API endpoints as needed
-   Add more features like job fraud detection
-   Implement memory saving/searching functionality
