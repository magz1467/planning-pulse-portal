export interface Application {
  id: number;
  title: string;
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
  image_map_url?: string;
  coordinates: [number, number];
  postcode: string;
  ai_title?: string;
  last_date_consultation_comments?: string;
  valid_date?: string;
  centroid?: {
    coordinates: [number, number];
  };
  impact_score?: number | null;
  impact_score_details?: Record<string, any>;
}

export interface Comment {
  id: number;
  created_at: string;
  comment: string;
  user_id: string;
  application_id: number;
  parent_id?: number;
  upvotes?: number;
  downvotes?: number;
  user?: {
    email: string;
  };
}