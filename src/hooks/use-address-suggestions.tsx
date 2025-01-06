import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface PostcodeSuggestion {
  postcode: string;
  country: string;
  nhs_ha: string;
  admin_district: string;
  address?: string;
}

export const useAddressSuggestions = (search: string) => {
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { toast } = useToast();
  
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
        // If search includes numbers (likely a postcode), try postcode lookup first
        if (/\d/.test(debouncedSearch)) {
          const postcodeResponse = await fetch(
            `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`
          );
          
          if (!postcodeResponse.ok) {
            if (postcodeResponse.status === 404) {
              return []; // No results found
            }
            throw new Error('Postcode API error');
          }

          const postcodeData = await postcodeResponse.json();
          
          if (postcodeData.result) {
            const detailsPromises = postcodeData.result.map(async (postcode: string) => {
              const detailsResponse = await fetch(
                `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
              );
              
              if (!detailsResponse.ok) {
                return null;
              }

              const details = await detailsResponse.json();
              
              if (details.result) {
                return {
                  ...details.result,
                  postcode: details.result.postcode,
                  address: `${details.result.admin_ward}, ${details.result.parish || ''} ${details.result.admin_district}, ${details.result.postcode}`.trim()
                };
              }
              return null;
            });
            
            const results = await Promise.all(detailsPromises);
            return results.filter(Boolean);
          }
        }

        // If no postcode results or search doesn't include numbers, try general address search
        const generalResponse = await fetch(
          `https://api.postcodes.io/postcodes?q=${encodeURIComponent(debouncedSearch)}`
        );
        
        if (!generalResponse.ok) {
          throw new Error('Address search failed');
        }

        const generalData = await generalResponse.json();
        
        if (generalData.result && generalData.result.length > 0) {
          return generalData.result.map((result: any) => ({
            ...result,
            postcode: result.postcode,
            address: `${result.admin_ward}, ${result.parish || ''} ${result.admin_district}, ${result.postcode}`.trim()
          }));
        }
        
        return [];
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        toast({
          title: "Address lookup error",
          description: "There was a problem looking up addresses. Please try again later.",
          variant: "destructive"
        });
        return [];
      }
    },
    enabled: debouncedSearch.length >= 2,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 1, // Only retry once to avoid too many failed requests
  });
};