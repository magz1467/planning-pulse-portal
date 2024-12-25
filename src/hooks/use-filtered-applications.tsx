import { useState, useEffect } from 'react';
import { Application } from "@/types/planning";

export const useFilteredApplications = (
  applications: Application[],
  activeFilters: {
    status?: string;
    type?: string;
  },
  activeSort: 'closingSoon' | 'newest' | null
) => {
  const [filteredApplications, setFilteredApplications] = useState(applications);

  useEffect(() => {
    let filtered = [...applications];
    
    // Apply filters
    if (activeFilters.status) {
      filtered = filtered.filter(app => app.status === activeFilters.status);
    }
    if (activeFilters.type) {
      filtered = filtered.filter(app => app.type === activeFilters.type);
    }

    // Apply sorting
    if (activeSort) {
      filtered = [...filtered].sort((a, b) => {
        if (activeSort === 'closingSoon') {
          return new Date(a.decisionDue).getTime() - new Date(b.decisionDue).getTime();
        } else if (activeSort === 'newest') {
          return new Date(b.submissionDate).getTime() - new Date(a.submissionDate).getTime();
        }
        return 0;
      });
    }
    
    setFilteredApplications(filtered);
  }, [applications, activeFilters, activeSort]);

  return filteredApplications;
};