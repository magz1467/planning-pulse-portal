import { useState } from 'react';
import { Application } from "@/types/planning";
import { supabase } from "@/integrations/supabase/client";
import { transformApplicationData } from '@/utils/applicationTransforms';
import { LatLngTuple } from 'leaflet';
import { useToast } from "@/hooks/use-toast";

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchApplicationsInRadius = async (
    center: LatLngTuple,
    radius: number,
    page = 0,
    pageSize = 100
  ) => {
    setIsLoading(true);
    console.log('🔍 Fetching applications:', { center, radius, page, pageSize });

    try {
      const { data: applications, error } = await supabase
        .rpc('get_applications_within_radius', {
          center_lng: center[1],
          center_lat: center[0],
          radius_meters: radius,
          page_size: pageSize,
          page_number: page
        });

      if (error) {
        console.error('Error fetching applications:', error);
        toast({
          title: 'Error fetching applications',
          description: error.message,
          variant: 'destructive',
        });
        setApplications([]);
        setTotalCount(0);
        return;
      }

      if (!applications) {
        console.log('No applications found');
        setApplications([]);
        setTotalCount(0);
        return;
      }

      console.log(`📦 Received ${applications?.length || 0} applications from database`);

      const transformedApplications = applications
        ?.map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null);

      console.log('✨ Transformed applications:', transformedApplications?.length || 0);

      setApplications(transformedApplications || []);

      // Get total count
      const { data: countData, error: countError } = await supabase
        .rpc('get_applications_count_within_radius', {
          center_lng: center[1],
          center_lat: center[0],
          radius_meters: radius
        });

      if (countError) {
        console.error('Error fetching count:', countError);
        toast({
          title: 'Error fetching count',
          description: countError.message,
          variant: 'destructive',
        });
      } else {
        setTotalCount(countData || 0);
      }

    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: 'Error fetching applications',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      // Show more detailed error information
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    fetchApplicationsInRadius,
  };
};