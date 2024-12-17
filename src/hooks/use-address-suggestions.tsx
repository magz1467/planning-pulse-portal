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
        // Using Find that Address API for actual street addresses
        const response = await fetch(
          `https://api.getAddress.io/find/${encodeURIComponent(debouncedSearch)}?api-key=YOUR_API_KEY&expand=true`
        );
        
        // Fallback to postcodes.io if getAddress.io is not available
        if (!response.ok) {
          console.log('Falling back to postcodes.io');
          const postcodeResponse = await fetch(
            `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`
          );
          const postcodeData = await postcodeResponse.json();
          
          if (postcodeData.result) {
            const detailsPromises = postcodeData.result.map(async (postcode: string) => {
              const detailsResponse = await fetch(
                `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
              );
              const details = await detailsResponse.json();
              
              if (details.result) {
                return {
                  ...details.result,
                  postcode: details.result.postcode,
                  // Include full address information
                  address: `${details.result.thoroughfare || ''} ${details.result.admin_ward}, ${details.result.parish || details.result.admin_district}, ${details.result.postcode}`.trim()
                };
              }
              return null;
            });
            
            const results = await Promise.all(detailsPromises);
            return results.filter(Boolean);
          }
        }
        
        // Parse getAddress.io response
        const data = await response.json();
        return data.addresses.map((address: any) => ({
          postcode: address.postcode,
          address: `${address.line_1}${address.line_2 ? ', ' + address.line_2 : ''}, ${address.town}, ${address.postcode}`,
          country: address.country,
          admin_district: address.town
        }));
        
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        return [];
      }
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });
};