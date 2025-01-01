import { useMemo } from 'react';
import { Application } from "@/types/planning";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

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
        let dateA: Date | null = null;
        let dateB: Date | null = null;
        
        try {
          if (a.last_date_consultation_comments) {
            dateA = new Date(a.last_date_consultation_comments);
            if (isNaN(dateA.getTime())) dateA = null;
          }
        } catch (e) {
          console.log('Invalid date format for app:', a.id);
          dateA = null;
        }
        
        try {
          if (b.last_date_consultation_comments) {
            dateB = new Date(b.last_date_consultation_comments);
            if (isNaN(dateB.getTime())) dateB = null;
          }
        } catch (e) {
          console.log('Invalid date format for app:', b.id);
          dateB = null;
        }

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Helper function to check if date is in the future
        const isFuture = (date: Date | null) => date && date > now;
        
        // Helper function to check if date is within next 7 days
        const isClosingSoon = (date: Date | null) => {
          if (!date) return false;
          const diffTime = date.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          return diffDays > 0 && diffDays <= 7;
        };

        // If both dates are in the future
        if (isFuture(dateA) && isFuture(dateB)) {
          // If both are closing soon, sort by closest date
          if (isClosingSoon(dateA) && isClosingSoon(dateB)) {
            return dateA!.getTime() - dateB!.getTime();
          }
          // If only one is closing soon, prioritize it
          if (isClosingSoon(dateA)) return -1;
          if (isClosingSoon(dateB)) return 1;
          // Otherwise sort by date
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
        let dateA: Date | null = null;
        let dateB: Date | null = null;

        try {
          if (a.valid_date) {
            dateA = new Date(a.valid_date);
            if (isNaN(dateA.getTime())) dateA = null;
          }
        } catch (e) {
          console.log('Invalid valid_date format for app:', a.id);
          dateA = null;
        }

        try {
          if (b.valid_date) {
            dateB = new Date(b.valid_date);
            if (isNaN(dateB.getTime())) dateB = null;
          }
        } catch (e) {
          console.log('Invalid valid_date format for app:', b.id);
          dateB = null;
        }
        
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
