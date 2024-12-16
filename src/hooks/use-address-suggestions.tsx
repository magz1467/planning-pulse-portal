import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PostcodeSuggestion {
  postcode: string;
  country: string;
  nhs_ha: string;
  admin_district: string;
}

export const useAddressSuggestions = (search: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return useQuery({
    queryKey: ['postcode-suggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      
      try {
        const response = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`
        );
        const data = await response.json();
        
        if (!data.result) return [];
        
        // Fetch additional details for each postcode
        const detailsPromises = data.result.map(async (postcode: string) => {
          const detailsResponse = await fetch(
            `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
          );
          const details = await detailsResponse.json();
          return details.result;
        });
        
        const results = await Promise.all(detailsPromises);
        return results.filter(Boolean);
      } catch (error) {
        console.error('Error fetching postcode suggestions:', error);
        return [];
      }
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};