import { useApplicationsFetch } from "@/hooks/use-applications-fetch";

export const useApplicationsData = () => {
  const {
    applications,
    isLoading,
    totalCount,
    statusCounts,
    error,
    fetchApplicationsInRadius,
  } = useApplicationsFetch();

  return {
    applications,
    isLoading,
    totalCount,
    statusCounts,
    error,
    fetchApplicationsInRadius,
  };
};