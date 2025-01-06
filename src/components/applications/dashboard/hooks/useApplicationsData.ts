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
      // First try to get applications
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
          description: 'Please try again later',
          variant: 'destructive',
        });
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

      // Then get status counts
      const { data: counts, error: countsError } = await supabase
        .rpc('get_applications_status_counts', {
          center_lat: center[0],
          center_lng: center[1],
          radius_meters: radius
        });

      if (countsError) {
        console.error('Error fetching counts:', countsError);
      } else {
        const formattedCounts = {
          'Under Review': 0,
          'Approved': 0,
          'Declined': 0,
          'Other': 0
        };
        
        if (Array.isArray(counts)) {
          counts.forEach((row: { status: string; count: number }) => {
            if (row.status in formattedCounts) {
              formattedCounts[row.status as keyof typeof formattedCounts] = row.count;
            }
          });
        }
        
        setStatusCounts(formattedCounts);
      }

      // Finally get total count
      const { data: countData, error: countError } = await supabase
        .rpc('get_applications_count_within_radius', {
          center_lng: center[1],
          center_lat: center[0],
          radius_meters: radius
        });

      if (countError) {
        console.error('Error fetching count:', countError);
      } else {
        setTotalCount(countData || 0);
      }

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