import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PostcodeSuggestion {
  postcode: string;
  country: string;
  nhs_ha: string;
  admin_district: string;
}

export const useAddressSuggestions = (search: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  // Debounce the search input
  useState(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return useQuery({
    queryKey: ['postcode-suggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${debouncedSearch}/autocomplete`
      );
      const data = await response.json();
      
      if (!data.result) return [];
      
      // Fetch additional details for each postcode
      const detailsPromises = data.result.map(async (postcode: string) => {
        const detailsResponse = await fetch(
          `https://api.postcodes.io/postcodes/${postcode}`
        );
        const details = await detailsResponse.json();
        return details.result;
      });
      
      const results = await Promise.all(detailsPromises);
      return results.filter(Boolean);
    },
    enabled: debouncedSearch.length >= 2,
  });
};