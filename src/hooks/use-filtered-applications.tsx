import { useMemo } from 'react';
import { Application } from "@/types/planning";
import { useApplicationFiltering } from './use-application-filtering';
import { useApplicationSorting, SortType } from './use-application-sorting';

interface ActiveFilters {
  status?: string;
  type?: string;
  search?: string;
}

export const useFilteredApplications = (
  applications: Application[],
  activeFilters: ActiveFilters,
  activeSort?: SortType
) => {
  return useMemo(() => {
    console.log('useFilteredApplications - Input applications:', applications?.length);
    console.log('useFilteredApplications - Active filters:', activeFilters);
    console.log('useFilteredApplications - Active sort:', activeSort);
    
    // First apply filters
    const filteredApplications = useApplicationFiltering(applications, activeFilters);
    
    // Then apply sorting
    const sortedApplications = useApplicationSorting({
      type: activeSort || null,
      applications: filteredApplications
    });

    console.log('useFilteredApplications - Filtered applications:', sortedApplications?.length);
    return sortedApplications;
  }, [applications, activeFilters, activeSort]);
};