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
}