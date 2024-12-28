export interface Application {
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
  // New fields matching schema update
  entity: number | null;
  prefix: string | null;
  dataset: string | null;
  twitter: string | null;
  website: string | null;
  end_date: Date | null;
  typology: string | null;
  wikidata: string | null;
  wikipedia: string | null;
  entry_date: Date | null;
  start_date: Date | null;
  organisation_entity: string | null;
  parliament_thesaurus: string | null;
  statistical_geography: string | null;
  opendatacommunities_uri: string | null;
  local_planning_authority: string | null;
}

export interface BatchProcessResult {
  inserts: number;
  updates: number;
}