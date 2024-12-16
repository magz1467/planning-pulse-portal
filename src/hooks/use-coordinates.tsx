import { useState, useEffect } from 'react';
import { LatLngTuple } from "leaflet";

export const useCoordinates = (postcode: string | undefined) => {
  const [coordinates, setCoordinates] = useState<LatLngTuple | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!postcode) return;
      
      setIsLoading(true);
      try {
        const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
        const data = await response.json();
        if (data.status === 200) {
          setCoordinates([data.result.latitude, data.result.longitude]);
        }
      } catch (error) {
        console.error("Error fetching coordinates:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchCoordinates();
    window.scrollTo(0, 0);
  }, [postcode]);

  return { coordinates, isLoading };
};