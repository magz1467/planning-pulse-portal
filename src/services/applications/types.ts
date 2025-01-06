import { Application } from "@/types/planning";

export interface FetchApplicationsParams {
  center: [number, number];
  radiusInMeters: number;
  pageSize?: number;
  pageNumber?: number;
}

export interface ApplicationsResponse {
  data: Application[];
  count: number;
}

export interface ApplicationsError {
  message: string;
  details?: string;
  hint?: string;
  code?: string;
}

export interface StatusCounts {
  'Under Review': number;
  'Approved': number;
  'Declined': number;
  'Other': number;
}