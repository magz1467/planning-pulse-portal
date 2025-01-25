import { useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";

export const usePostcodeSearch = (fetchPins: (bbox: string) => Promise<void>) => {
  const { toast } = useToast();

  const handlePostcodeSelect = useCallback(async (postcode: string) => {
    if (!postcode) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid postcode to search",
        variant: "destructive"
      });
      return;
    }

    try {
      // Convert postcode to coordinates using a geocoding service
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
      );
      const data = await response.json();

      if (data.status === 200 && data.result) {
        const { longitude, latitude } = data.result;
        
        // Create a bounding box around the postcode (roughly 5km)
        // Note: Order must be minLng,minLat,maxLng,maxLat for Searchland API
        const bbox = `${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}`;
        await fetchPins(bbox);
      } else {
        toast({
          title: "Invalid Postcode",
          description: "Could not find coordinates for this postcode",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error geocoding postcode:', error);
      toast({
        title: "Error",
        description: "Could not process your search. Please try again.",
        variant: "destructive"
      });
    }
  }, [fetchPins, toast]);

  return { handlePostcodeSelect };
};