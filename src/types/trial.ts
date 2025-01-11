export interface TrialApplicationData {
  id: number;
  created_at: string;
  application_reference: string | null;
  description: string | null;
  status: string | null;
  decision_date: string | null;
  submission_date: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  } | null;
  raw_data: any;
  source_url: string | null;
  address: string | null;
  url: string | null;
  ward: string | null;
  consultation_end_date: string | null;
  decision_details: any | null;
  application_type: string | null;
  applicant_name: string | null;
  agent_details: any | null;
  constraints: any | null;
}