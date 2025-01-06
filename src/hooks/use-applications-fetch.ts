import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { transformApplicationData } from '@/utils/applicationTransforms';

export const useApplicationsFetch = (coordinates: [number, number] | null, radius: number = 1000) => {
  return useQuery({
    queryKey: ["applications", coordinates, radius],
    queryFn: async () => {
      if (!coordinates) {
        return [];
      }

      const [lat, lng] = coordinates;
      console.log('Fetching applications for coordinates:', { lat, lng, radius });

      try {
        const { data, error } = await supabase
          .rpc('get_applications_within_radius', {
            center_lat: lat,
            center_lng: lng,
            radius_meters: radius
          });

        if (error) {
          console.error("Error fetching applications:", error);
          throw new Error(`Failed to fetch applications: ${error.message}`);
        }

        if (!data) {
          console.log('No applications found');
          return [];
        }

        // Transform the data to match the Application type
        const applications = data.map(app => transformApplicationData(app, coordinates));
        console.log(`Found ${applications.length} applications`);
        return applications.filter((app): app is Application => app !== null);
      } catch (error) {
        console.error("Error in useApplicationsFetch:", error);
        throw error;
      }
    },
    enabled: !!coordinates,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 10000),
  });
};