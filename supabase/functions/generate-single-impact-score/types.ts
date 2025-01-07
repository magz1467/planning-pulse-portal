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