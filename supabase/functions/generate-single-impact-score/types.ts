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
  id: string;
  model: string;
  created: number;
  response: string;
}