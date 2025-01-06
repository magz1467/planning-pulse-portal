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

export interface ImpactScoreResponse {
  success: boolean;
  score?: number;
  details?: {
    category_scores: Record<string, number>;
    key_concerns: string[];
    recommendations: string[];
  };
  error?: string;
}

export interface ApplicationData {
  application_id: number;
  description: string;
  development_type?: string;
  application_type?: string;
  status: string;
  address: string;
  application_details?: Record<string, any>;
}