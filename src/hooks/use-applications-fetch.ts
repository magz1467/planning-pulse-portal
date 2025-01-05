import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { MAP_DEFAULTS } from '@/utils/mapConstants';
import { transformApplicationData } from '@/utils/applicationTransforms';
import { fetchApplicationsFromSupabase, fetchApplicationsCountFromSupabase } from '@/services/applicationsService';

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchApplicationsInRadius = async (
    center: [number, number],
    filters?: { status?: string; type?: string }
  ) => {
    setIsLoading(true);
    
    try {
      // Convert kilometers to meters for the database query
      const radiusInMeters = MAP_DEFAULTS.searchRadius * 1000;
      
      if (!center || !Array.isArray(center) || center.length !== 2) {
        throw new Error('Invalid coordinates provided');
      }

      // First get the count
      const count = await fetchApplicationsCountFromSupabase(center, radiusInMeters);
      setTotalCount(count || 0);

      if (count === 0) {
        toast({
          title: "No results found",
          description: "No planning applications were found in this area. Try searching a different location.",
          variant: "default",
        });
        setApplications([]);
        return;
      }

      // Then fetch the applications
      const apps = await fetchApplicationsFromSupabase({
        center,
        radiusInMeters
      });

      const transformedData = apps
        .map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null);
      
      setApplications(transformedData);

    } catch (error: any) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive"
      });
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    fetchApplicationsInRadius
  };
};