import { useState } from 'react';
import { Application } from "@/types/planning";
import { supabase } from "@/integrations/supabase/client";
import { transformApplicationData } from '@/utils/applicationTransforms';
import { LatLngTuple } from 'leaflet';
import { useToast } from '@/hooks/use-toast';

export const useApplicationsData = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [searchPoint, setSearchPoint] = useState<LatLngTuple | null>(null);
  const [statusCounts, setStatusCounts] = useState<{[key: string]: number}>({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  });
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
      const { data, error } = await supabase
        .rpc('get_applications_with_counts', {
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
          description: 'Please try again later',
          variant: 'destructive',
        });
        setApplications([]);
        setTotalCount(0);
        return;
      }

      if (!data) {
        console.log('No applications found');
        setApplications([]);
        setTotalCount(0);
        return;
      }

      const { applications: appsData, total_count, status_counts } = data;
      console.log(`📦 Received ${appsData?.length || 0} applications from database`);

      const transformedApplications = appsData
        ?.map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null);

      console.log('✨ Transformed applications:', transformedApplications?.length || 0);

      setApplications(transformedApplications || []);
      setTotalCount(total_count || 0);

      // Format status counts
      const formattedCounts = {
        'Under Review': 0,
        'Approved': 0,
        'Declined': 0,
        'Other': 0
      };
      
      if (status_counts) {
        Object.entries(status_counts).forEach(([status, count]) => {
          if (status in formattedCounts) {
            formattedCounts[status as keyof typeof formattedCounts] = count as number;
          }
        });
      }
      
      setStatusCounts(formattedCounts);

    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
      toast({
        title: 'Error fetching applications',
        description: 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    searchPoint,
    setSearchPoint,
    statusCounts,
    fetchApplicationsInRadius,
  };
};