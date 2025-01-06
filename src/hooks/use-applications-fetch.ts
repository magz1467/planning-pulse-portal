import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";

export const useApplicationsWithinRadius = (
  center: [number, number] | null,
  radius: number = 1000,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["applications", center, radius],
    queryFn: async () => {
      if (!center) return [];
      
      const { data, error } = await supabase
        .rpc("get_applications_within_radius", {
          center_lat: center[0],
          center_lng: center[1],
          radius_meters: radius
        })
        .timeout(30000); // Increase timeout to 30 seconds

      if (error) throw error;
      return data as Application[];
    },
    enabled: enabled && !!center,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};