export interface ApplicationData {
  application_id: number;
  description: string;
  development_type: string;
  application_type: string;
  application_details: any;
}

export interface BatchStatus {
  id: number;
  batch_size: number;
  completed_count: number;
  status: string;
  error_message: string | null;
}

export interface ErrorDetail {
  id: number;
  error: string;
}

export interface ProcessingResult {
  success: boolean;
  processed: number;
  errors: number;
  errorDetails?: ErrorDetail[];
  message: string;
}