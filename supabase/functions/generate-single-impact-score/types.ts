export interface ApplicationData {
  description: string;
  application_id: number;
  status: string;
  [key: string]: any;
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

export interface ImpactScoreResponse {
  success: boolean;
  score?: number;
  details?: {
    category_scores: {
      environmental: {
        score: number;
        details: string;
      };
      social: {
        score: number;
        details: string;
      };
      infrastructure: {
        score: number;
        details: string;
      };
    };
    key_concerns: string[];
    recommendations: string[];
  };
  error?: string;
}