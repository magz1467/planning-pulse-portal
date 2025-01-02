import { useSearchParams, useLocation } from "react-router-dom";
import { useEffect } from "react";

interface URLState {
  postcode: string;
  tab: 'recent' | 'completed';
  filter?: string;
  applicationId: number | null;
}

export const useURLState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Get initial values from URL params or location state
  const initialPostcode = searchParams.get('postcode') || location.state?.postcode || 'SW1A 0AA';
  const initialTab = (searchParams.get('tab') || location.state?.tab || 'recent') as 'recent' | 'completed';
  const initialFilter = searchParams.get('filter') || location.state?.initialFilter;
  const initialApplicationId = searchParams.get('application') ? parseInt(searchParams.get('application')!) : null;

  const updateURLParams = (state: Partial<URLState>) => {
    const params = new URLSearchParams(searchParams);
    
    if (state.postcode) params.set('postcode', state.postcode);
    if (state.tab) params.set('tab', state.tab);
    if (state.filter) {
      params.set('filter', state.filter);
    }
    if (state.applicationId) {
      params.set('application', state.applicationId.toString());
    } else if (state.applicationId === null) {
      params.delete('application');
    }
    
    setSearchParams(params, { replace: true });
  };

  return {
    initialPostcode,
    initialTab,
    initialFilter,
    initialApplicationId,
    updateURLParams
  };
};