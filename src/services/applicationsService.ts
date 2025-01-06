export { 
  fetchApplicationsFromSupabase,
  fetchApplicationsCountFromSupabase,
  fetchStatusCounts 
} from './applications/api';

export type { 
  FetchApplicationsParams,
  ApplicationsResponse,
  ApplicationsError,
  StatusCounts
} from './applications/types';