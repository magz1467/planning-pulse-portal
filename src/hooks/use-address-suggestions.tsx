import { useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";

interface AddressSuggestion {
  postcode: string;
  address?: string;
  admin_district: string;
  country: string;
}

export const useAddressSuggestions = (search: string) => {
  const [data, setData] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setData([]);
        return;
      }

      setIsLoading(true);
      try {
        // Check if the search string contains coordinates
        const coordsMatch = debouncedSearch.match(/^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/);
        
        let url;
        if (coordsMatch) {
          // Use reverse geocoding endpoint for coordinates
          const [_, lat, lon] = coordsMatch;
          url = `https://api.postcodes.io/postcodes?lon=${lon}&lat=${lat}`;
        } else {
          // Use postcode search endpoint
          url = `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`;
        }

        const response = await fetch(url);
        const json = await response.json();

        if (json.status === 200) {
          if (coordsMatch) {
            // Handle reverse geocoding response
            setData(json.result.map((item: any) => ({
              postcode: item.postcode,
              address: `${item.admin_district}, ${item.country}`,
              admin_district: item.admin_district,
              country: item.country
            })));
          } else {
            // Handle postcode autocomplete response
            setData(json.result.map((postcode: string) => ({
              postcode,
              admin_district: "",
              country: "United Kingdom"
            })));
          }
        } else {
          setData([]);
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  return { data, isLoading };
};