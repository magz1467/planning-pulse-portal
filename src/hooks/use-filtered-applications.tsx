import { useMemo } from 'react';
import { Application } from "@/types/planning";

interface ActiveFilters {
  status?: string;
  type?: string;
  search?: string;
}

const predefinedStatuses = ['under review', 'approved', 'declined'];

export const useFilteredApplications = (
  applications: Application[],
  activeFilters: ActiveFilters
) => {
  return useMemo(() => {
    let filtered = [...applications];

    // Filter by status
    if (activeFilters.status) {
      filtered = filtered.filter(app => {
        const appStatus = app.status?.toLowerCase() || '';
        const filterStatus = activeFilters.status.toLowerCase();
        
        if (filterStatus === 'other') {
          return !predefinedStatuses.includes(appStatus);
        }
        
        if (filterStatus === 'under review') {
          return appStatus.includes('under consideration') || 
                 appStatus.includes('under review');
        }
        return appStatus.includes(filterStatus);
      });
    }

    // Filter by search
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      filtered = filtered.filter(app => {
        const searchableFields = [
          app.description,
          app.address,
          app.reference,
          app.title
        ];
        return searchableFields.some(field => 
          field?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [applications, activeFilters]);
};