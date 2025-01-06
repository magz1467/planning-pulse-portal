export interface ImpactScoreResponse {
  success: boolean;
  score?: number;
  details?: Record<string, any>;
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