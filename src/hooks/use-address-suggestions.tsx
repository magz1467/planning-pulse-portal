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
        // First try the autocomplete endpoint for partial postcodes
        const autocompleteResponse = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`
        );
        
        if (!autocompleteResponse.ok) {
          if (autocompleteResponse.status !== 404) {
            throw new Error('Postcode API error');
          }
          return []; // No results found
        }

        const autocompleteData = await autocompleteResponse.json();
        
        if (autocompleteData.result) {
          // Fetch details for each suggested postcode
          const detailsPromises = autocompleteData.result.map(async (postcode: string) => {
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

        // If no autocomplete results or search doesn't include numbers, try general address search
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