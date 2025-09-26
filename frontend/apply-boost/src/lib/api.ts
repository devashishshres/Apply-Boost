// API service layer for communicating with the Apply-Boost backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export interface JDExtractResponse {
  summary: string;
  skills: string[];
  mustHaves: string[];
}

export interface ResumeMapResponse {
  matches: string[];
  gaps: string[];
}

export interface TailoredResumeResponse {
  feedback: string;
}

export interface TextResponse {
  text: string;
}

export interface QuestionsResponse {
  questions: string[];
}

export interface ChatbotResponse {
  response: string;
}

export interface FraudDetectionResponse {
  is_suspicious: boolean;
  reason: string;
  confidence_score: number;
}

export interface NameExtractionResponse {
  name: string;
  confidence: number;
}

class ApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    return response.json();
  }

  // Extract job description into summary, skills, and must-haves
  async extractJobDescription(jdText: string): Promise<JDExtractResponse> {
    return this.makeRequest<JDExtractResponse>("/api/jd/extract", {
      method: "POST",
      body: JSON.stringify({ jdText }),
    });
  }

  // Map resume skills against job description skills
  async mapResume(
    skills: string[],
    resumeText: string
  ): Promise<ResumeMapResponse> {
    return this.makeRequest<ResumeMapResponse>("/api/resume/map", {
      method: "POST",
      body: JSON.stringify({ skills, resumeText }),
    });
  }

  // Extract name from resume
  async extractName(resumeText: string): Promise<NameExtractionResponse> {
    return this.makeRequest<NameExtractionResponse>(
      "/api/resume/extract-name",
      {
        method: "POST",
        body: JSON.stringify({ resumeText }),
      }
    );
  }

  // Generate recruiter outreach message
  async generateOutreach(params: {
    role: string;
    company: string;
    jdSummary: string;
    matches: string[];
    extraContext?: string;
    applicantName?: string;
  }): Promise<TextResponse> {
    return this.makeRequest<TextResponse>("/api/actions/outreach", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Generate likely recruiter questions
  async generateRecruiterQuestions(params: {
    jdSummary: string;
    skills: string[];
  }): Promise<QuestionsResponse> {
    return this.makeRequest<QuestionsResponse>(
      "/api/actions/recruiter-questions",
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    );
  }

  // Generate tailored resume snippet
  async tailorResume(params: {
    jdSummary: string;
    skills: string[];
    resumeText: string;
    extraContext?: string;
  }): Promise<TailoredResumeResponse> {
    return this.makeRequest<TailoredResumeResponse>("/api/actions/tailor", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Generate cover letter
  async generateCoverLetter(params: {
    role: string;
    company: string;
    jdSummary: string;
    matches: string[];
    extraContext?: string;
    applicantName?: string;
  }): Promise<TextResponse> {
    return this.makeRequest<TextResponse>("/api/actions/cover-letter", {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  // Send message to chatbot
  async sendChatMessage(message: string): Promise<ChatbotResponse> {
    return this.makeRequest<ChatbotResponse>("/api/chatbot-response", {
      method: "POST",
      body: JSON.stringify({ message }),
    });
  }

  // Detect fraud in job description
  async detectFraud(jdText: string): Promise<FraudDetectionResponse> {
    return this.makeRequest<FraudDetectionResponse>("/api/jd/detect-fraud", {
      method: "POST",
      body: JSON.stringify({ jdText }),
    });
  }
}

export const apiService = new ApiService();
