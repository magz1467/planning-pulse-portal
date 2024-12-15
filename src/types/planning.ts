export interface Application {
  id: number;
  title: string;
  address: string;
  status: string;
  distance: string;
  reference: string;
  type: string;
  description?: string;
  applicant?: string;
  submissionDate?: string;
  decisionDue?: string;
  ward?: string;
  officer?: string;
  consultationEnd?: string;
  image?: string;
}

export interface Comment {
  id: number;
  text: string;
  author: string;
  timestamp: Date;
  date: Date;
}