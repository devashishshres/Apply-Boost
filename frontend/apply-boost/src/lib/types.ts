// Type definitions for Apply-Boost application

export interface JobDescriptionExtraction {
  summary: string;
  skills: string[];
  mustHaves: string[];
}

export interface SkillsMapping {
  matches: string[];
  gaps: string[];
}

export interface TailoredResume {
  summary: string;
  bullets: string[];
}

export interface GeneratedResults {
  recruiterMessage: string;
  screeningQuestions: string[];
  coverLetter: string;
  tailoredResume: TailoredResume;
  skillsMapping: SkillsMapping;
  jdExtraction: JobDescriptionExtraction;
  company: string;
  role: string;
}

export interface FraudDetection {
  is_suspicious: boolean;
  reason: string;
  confidence_score: number;
}

export interface MemoryItem {
  type: string;
  company: string;
  role: string;
  text: string;
  tags: string[];
  link?: string;
}

export interface ApiError {
  message: string;
  status?: number;
}