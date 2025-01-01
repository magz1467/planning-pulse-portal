import { useMemo } from 'react';
import { Application } from "@/types/planning";

interface ActiveFilters {
  status?: string;
  type?: string;
  search?: string;
}

export const useFilteredApplications = (
  applications: Application[],
  activeFilters: ActiveFilters,
  activeSort?: 'closingSoon' | 'newest' | null
) => {
  return useMemo(() => {
    console.log('useFilteredApplications - Input applications:', applications?.length);
    console.log('useFilteredApplications - Active filters:', activeFilters);
    console.log('useFilteredApplications - Active sort:', activeSort);
    
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

    // Sort applications if sort is active
    if (activeSort === 'closingSoon') {
      filtered.sort((a, b) => {
        const dateA = a.last_date_consultation_comments ? new Date(a.last_date_consultation_comments) : null;
        const dateB = b.last_date_consultation_comments ? new Date(b.last_date_consultation_comments) : null;
        const now = new Date();

        // Helper function to check if date is in the future
        const isFuture = (date: Date | null) => date && date > now;

        // If both dates are in the future
        if (isFuture(dateA) && isFuture(dateB)) {
          return dateA!.getTime() - dateB!.getTime();
        }
        
        // If only one date is in the future, prioritize it
        if (isFuture(dateA)) return -1;
        if (isFuture(dateB)) return 1;
        
        // If both dates are in the past, sort by most recent
        if (dateA && dateB) {
          return dateB.getTime() - dateA.getTime();
        }
        
        // Handle cases where one or both dates are null
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        
        return 0;
      });
    } else if (activeSort === 'newest') {
      filtered.sort((a, b) => {
        const dateA = a.valid_date ? new Date(a.valid_date) : null;
        const dateB = b.valid_date ? new Date(b.valid_date) : null;
        
        if (dateA && dateB) {
          return dateB.getTime() - dateA.getTime();
        }
        if (!dateA && !dateB) return 0;
        if (!dateA) return 1;
        if (!dateB) return -1;
        return 0;
      });
    }

    console.log('useFilteredApplications - Filtered applications:', filtered?.length);
    return filtered;
  }, [applications, activeFilters, activeSort]);
};