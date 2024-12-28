export interface DevelopmentUpdate {
  external_id: string;
  title: string;
  address: string | null;
  status: string | null;
  description: string | null;
  applicant: string | null;
  submission_date: Date | null;
  decision_due: Date | null;
  type: string | null;
  ward: string | null;
  officer: string | null;
  consultation_end: Date | null;
  lat: number | null;
  lng: number | null;
  location: string | null;
  raw_data: any;
}

export interface BatchProcessResult {
  inserts: number;
  updates: number;
}
