export interface Application {
  id: number;
  application_id: number;
  title?: string;
  address: string;
  status: string;
  reference: string;
  description: string;
  submissionDate: string;
  coordinates: [number, number];
  postcode: string;
  applicant: string;
  decisionDue: string;
  type: string;
  ward: string;
  officer: string;
  consultationEnd: string;
  image?: string;
  image_map_url?: string;
  ai_title?: string;
  last_date_consultation_comments?: string;
  valid_date?: string;
  centroid?: {
    lat: number;
    lon: number;
  };
  impact_score: number | null;
  impact_score_details?: any;
  impacted_services?: any;
  image_link?: {
    mapillary?: string;
    generated_at?: string;
  } | null;
}

export interface Comment {
  id: number;
  created_at: string;
  comment: string;
  user_id?: string;
  application_id?: number;
  parent_id?: number;
  upvotes?: number;
  downvotes?: number;
  user_email?: string;
}

export interface ApplicationFeedback {
  id: number;
  application_id: number;
  user_id: string;
  feedback_type: string;
  created_at: string;
}
