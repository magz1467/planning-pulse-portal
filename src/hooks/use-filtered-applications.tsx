import { useMemo } from 'react';
import { Application } from "@/types/planning";

interface ActiveFilters {
  status?: string;
  type?: string;
  search?: string;
}

export const useFilteredApplications = (
  applications: Application[],
  activeFilters: ActiveFilters
) => {
  return useMemo(() => {
    let filtered = [...applications];

    // Filter by status
    if (activeFilters.status) {
      filtered = filtered.filter(app => {
        const appStatus = (app.status || '').trim().toLowerCase();
        const filterStatus = activeFilters.status.toLowerCase();
        
        if (filterStatus === 'other') {
          // Check if status doesn't match any predefined status
          const predefinedStatuses = ['under review', 'approved', 'declined'];
          return !predefinedStatuses.includes(appStatus);
        }
        
        return appStatus === filterStatus;
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