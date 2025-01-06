export interface ImpactScoreRequest {
  applicationId: number;
  description: string;
}

export interface ImpactScoreResponse {
  score: number;
  details: {
    [key: string]: any;
  };
}

export interface ImpactScoreError {
  message: string;
  details?: string;
}

export interface PerplexityResponse {
  success: boolean;
  data?: {
    overall_score: number;
    category_scores: Record<string, number>;
    key_concerns: string[];
    recommendations: string[];
  };
  error?: string;
}