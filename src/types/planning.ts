export interface Application {
  id: number;
  title: string;
  address: string;
  status: string;
  distance: string;
  reference: string;
  description: string;
  applicant: string;
  submissionDate: string;
  decisionDue: string;
  type: string;
  ward: string;
  officer: string;
  consultationEnd: string;
  image: string;
}

export interface Comment {
  id: number;
  content: string;
  author: string;
  timestamp: string;
}