export interface BulletReview {
  original: string;
  improved: string;
}

export interface SectionScores {
  formatting: number;
  keywords: number;
  experience: number;
  skills: number;
  impact: number;
  readability: number;
  repetition: number;
  grammar: number;
  parse_rate: number;
}

export interface RecruiterSimulation {
  first_impression: string;
  likely_concerns: string[];
  likely_outcome: string;
}

export interface JdMatch {
  match_score: number;
  role_match: string;
  missing_skills: string[];
  matched_skills: string[];
}

export interface AtsReport {
  overall_score: number;
  grade: string;
  scores: SectionScores;
  ats_essentials: Record<string, boolean>;
  ats_warnings: string[];
  risks: string[];
  suggestions: string[];
  strong_keywords: string[];
  missing_keywords: string[];
  feedback: string[];
  bullet_reviews: BulletReview[];
  recruiter_simulation: RecruiterSimulation;
  jd_match: JdMatch | null;
}
