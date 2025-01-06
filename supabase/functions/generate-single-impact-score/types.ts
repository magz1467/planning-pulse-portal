export interface ApplicationData {
  description: string;
  application_id: number;
  status: string;
  [key: string]: any;
}

export interface ImpactScoreResponse {
  success: boolean;
  score?: number;
  details?: {
    category_scores: Record<string, Record<string, number>>;
    key_concerns: string[];
    recommendations: string[];
  };
  error?: string;
}

export interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
}