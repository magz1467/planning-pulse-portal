export interface Comment {
  id: number;
  created_at: string;
  comment: string;
  user_id?: string;
  application_id?: number;
  parent_id?: number;
  upvotes?: number;
  downvotes?: number;
  user?: {
    username?: string;
  };
  profiles?: {
    username?: string;
  };
}

export interface Application {
  id: number;
  title: string;
  address: string;
  status: string;
  distance?: string;
  reference: string;
  description: string;
  applicant?: string;
  submissionDate?: string;
  decisionDue?: string;
  type?: string;
  ward?: string;
  officer?: string;
  consultationEnd?: string;
  image?: string;
  coordinates?: [number, number];
  ai_title?: string;
  postcode?: string;
  impact_score?: number | null;
  impact_score_details?: Record<string, any>;
  image_map_url?: string | null;
  last_date_consultation_comments?: string | null;
  valid_date?: string | null;
  centroid?: any;
  impacted_services?: any;
  application_type_full?: string;
  class_3?: string | null;
  image_link?: {
    visualizations?: string[];
  };
}