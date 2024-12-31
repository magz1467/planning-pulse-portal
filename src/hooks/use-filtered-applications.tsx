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
        if (activeFilters.status === 'Under Review') {
          return app.status.toLowerCase() === 'application under consideration';
        }
        return app.status === activeFilters.status;
      });
    }

    // Filter by type
    if (activeFilters.type) {
      filtered = filtered.filter(app => app.type === activeFilters.type);
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