import { useApplicationsStatus } from '@/hooks/use-applications-status';
import { useSearchPoint } from '@/hooks/use-search-point';
import { useApplicationsFetch } from './use-applications-fetch';

export const useApplicationsData = () => {
  const { statusCounts, setStatusCounts } = useApplicationsStatus();
  const { 
    applications, 
    isLoading, 
    totalCount,
    currentPage,
    setCurrentPage,
    fetchApplicationsInRadius,
    PAGE_SIZE
  } = useApplicationsFetch();
  const { searchPoint, setSearchPoint } = useSearchPoint();

  return {
    applications,
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint,
    statusCounts,
    PAGE_SIZE
  };
};