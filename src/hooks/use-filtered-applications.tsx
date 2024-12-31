import { useMemo } from 'react';
import { Tables } from '@/integrations/supabase/types';

type Application = Tables<'applications'>;

interface ActiveFilters {
  status?: string;
  type?: string;
  search?: string;
}

export const useFilteredApplications = (applications: Application[], activeFilters: ActiveFilters) => {
  return useMemo(() => {
    let filtered = [...applications];

    // Filter by status
    if (activeFilters.status) {
      filtered = filtered.filter(app => {
        if (activeFilters.status === 'Under Review') {
          return app.status === 'Application Under Consideration';
        }
        return app.status === activeFilters.status;
      });
    }

    // Filter by type
    if (activeFilters.type) {
      filtered = filtered.filter(app => app.application_type === activeFilters.type);
    }

    // Filter by search
    if (activeFilters.search) {
      const searchLower = activeFilters.search.toLowerCase();
      filtered = filtered.filter(app => {
        const searchableFields = [
          app.description,
          app.street_name,
          app.postcode,
          app.lpa_app_no,
          app.ai_title
        ];
        return searchableFields.some(field => 
          field?.toLowerCase().includes(searchLower)
        );
      });
    }

    return filtered;
  }, [applications, activeFilters]);
};