import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

interface PostcodeSuggestion {
  postcode: string;
  country: string;
  nhs_ha: string;
  admin_district: string;
  address?: string;
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
    queryKey: ['address-suggestions', debouncedSearch],
    queryFn: async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) return [];
      
      try {
        // First try postcode lookup
        const postcodeResponse = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`
        );
        const postcodeData = await postcodeResponse.json();
        
        if (postcodeData.result) {
          // Fetch additional details for each postcode
          const detailsPromises = postcodeData.result.map(async (postcode: string) => {
            const detailsResponse = await fetch(
              `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
            );
            const details = await detailsResponse.json();
            return details.result;
          });
          
          const results = await Promise.all(detailsPromises);
          return results.filter(Boolean);
        }
        
        // If no postcode results, try address lookup
        const addressResponse = await fetch(
          `https://api.postcodes.io/postcodes?q=${encodeURIComponent(debouncedSearch)}`
        );
        const addressData = await addressResponse.json();
        
        if (addressData.result) {
          return addressData.result.map((result: any) => ({
            ...result,
            address: `${result.admin_ward || ''} ${result.admin_district}`.trim(),
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
      }
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};