import { useState, useEffect } from "react";
import { useDebounce } from "./use-debounce";

interface AddressSuggestion {
  postcode: string;
  address?: string;
  admin_district: string;
  country: string;
}

export const useAddressSuggestions = (search: string) => {
  const [data, setData] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedSearch || debouncedSearch.length < 2) {
        setData([]);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const url = `https://api.postcodes.io/postcodes/${encodeURIComponent(debouncedSearch)}/autocomplete`;
        console.log('Fetching suggestions from:', url);
        
        const response = await fetch(url);
        const json = await response.json();

        if (json.status === 200 && json.result) {
          setData(json.result.map((postcode: string) => ({
            postcode,
            admin_district: "",
            country: "United Kingdom"
          })));
        } else {
          setData([]);
          if (json.error) {
            setError(json.error);
          }
        }
      } catch (error) {
        console.error("Error fetching address suggestions:", error);
        setError("Failed to fetch address suggestions. Please try again.");
        setData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuggestions();
  }, [debouncedSearch]);

  return { data, isLoading, error };
};