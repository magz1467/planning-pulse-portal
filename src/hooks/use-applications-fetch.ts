import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";

export const useApplicationsFetch = (coordinates: [number, number] | null, radius: number = 1000) => {
  return useQuery({
    queryKey: ["applications", coordinates, radius],
    queryFn: async () => {
      if (!coordinates) {
        return [];
      }

      const [lat, lng] = coordinates;

      const { data, error } = await supabase
        .rpc('get_applications_within_radius', {
          center_lat: lat,
          center_lng: lng,
          radius_meters: radius
        });

      if (error) {
        console.error("Error fetching applications:", error);
        throw error;
      }

      return data as Application[];
    },
    enabled: !!coordinates,
  });
};