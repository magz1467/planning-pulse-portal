export interface Application {
  id: number;
  application_id: number;
  title: string | null;
  address: string;
  status: string;
  distance?: string;
  reference: string;
  description: string;
  applicant: string;
  submissionDate: string;
  decisionDue: string;
  type: string;
  ward: string;
  officer: string;
  consultationEnd: string;
  image?: string;
  coordinates: [number, number];
  ai_title?: string;
  postcode: string;
  impact_score: number | null;
  impact_score_details: any | null;
  image_map_url?: string | null;
  last_date_consultation_comments?: string | null;
  valid_date?: string | null;
  centroid?: { lat: number; lon: number } | null;
  class_3?: string;
  image_link?: {
    mapillary?: string;
    generated_at?: string;
  } | null;
  impacted_services?: any;
}

export interface Comment {
  id: number;
  created_at: string;
  comment: string;
  user_id?: string;
  application_id?: number;
  parent_id?: number;
  upvotes: number;
  downvotes: number;
  user_email?: string;
  user?: {
    username?: string;
  };
}

export interface ApplicationFeedback {
  id: number;
  application_id: number;
  user_id: string;
  feedback_type: string;
  created_at: string;
}