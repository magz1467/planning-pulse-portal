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
    console.log('useFilteredApplications - Input applications:', applications?.length);
    console.log('useFilteredApplications - Active filters:', activeFilters);
    
    let filtered = [...(applications || [])];

    // Filter by status
    if (activeFilters.status) {
      filtered = filtered.filter(app => {
        if (!app.status) {
          return activeFilters.status === "Other";
        }

        const appStatus = app.status.trim();
        const filterStatus = activeFilters.status;
        
        if (filterStatus === "Under Review") {
          return appStatus.toLowerCase().includes('under consideration');
        }
        
        if (filterStatus === "Other") {
          // Check if status doesn't match any predefined status
          const predefinedStatuses = ["Under Review", "Approved", "Declined"];
          const predefinedMatches = predefinedStatuses.some(status => {
            if (status === "Under Review") {
              return appStatus.toLowerCase().includes('under consideration');
            }
            return appStatus.toLowerCase().includes(status.toLowerCase());
          });
          return !predefinedMatches;
        }
        
        return appStatus.toLowerCase().includes(filterStatus.toLowerCase());
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

    console.log('useFilteredApplications - Filtered applications:', filtered?.length);
    return filtered;
  }, [applications, activeFilters]);
};