import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { transformApplicationData } from '@/utils/applicationTransforms';
import { LatLngTuple } from 'leaflet';
import { useApplicationError } from './use-application-error';
import { useApplicationStatus } from './use-application-status';
import { toast } from "@/components/ui/use-toast";

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { error, setError, handleError } = useApplicationError();
  const { statusCounts, calculateStatusCounts } = useApplicationStatus();

  const fetchApplicationsInRadius = async (
    center: LatLngTuple,
    radius: number,
    page = 0,
    pageSize = 100,
    retryCount = 0
  ) => {
    // Don't proceed if coordinates are invalid
    if (!center || !center[0] || !center[1]) {
      console.log('Invalid coordinates provided:', center);
      toast({
        title: "Invalid Location",
        description: "Please provide a valid location to search",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    console.log('🔍 Starting fetch with params:', { 
      center, 
      radius, 
      page, 
      pageSize,
      timestamp: new Date().toISOString()
    });

    try {
      const { data, error: rpcError } = await supabase.rpc(
        'get_applications_with_counts_optimized',
        {
          center_lat: center[0],
          center_lng: center[1],
          radius_meters: radius,
          page_size: pageSize,
          page_number: page
        }
      );

      if (rpcError) {
        // Handle timeout errors specifically
        if (rpcError.message.includes('statement timeout') || rpcError.code === '57014') {
          if (retryCount < 3) {
            console.log(`Retry attempt ${retryCount + 1} after timeout`);
            // Wait a bit before retrying with exponential backoff
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryCount)));
            return fetchApplicationsInRadius(center, radius, page, pageSize, retryCount + 1);
          }
          toast({
            title: "Search Timeout",
            description: "The search took too long. Please try a smaller radius or different location.",
            variant: "destructive",
          });
        } else {
          handleError(rpcError);
        }
        return;
      }

      if (!data || !Array.isArray(data)) {
        console.log('⚠️ No applications found or invalid response:', data);
        setApplications([]);
        setTotalCount(0);
        return;
      }

      // Extract applications from the response
      const { applications: appsData, total_count } = data[0] || { applications: [], total_count: 0 };

      console.log(`📦 Received ${appsData?.length || 0} raw applications`);

      const transformedApplications = appsData
        ?.map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null)
        // Sort by final_impact_score in descending order
        .sort((a, b) => {
          const scoreA = a.final_impact_score || 0;
          const scoreB = b.final_impact_score || 0;
          return scoreB - scoreA;
        });

      console.log('✨ Transformed applications:', transformedApplications?.map(app => ({
        id: app.id,
        class_3: app.class_3,
        title: app.title,
        final_impact_score: app.final_impact_score
      })));

      setApplications(transformedApplications || []);
      setTotalCount(total_count || 0);
      calculateStatusCounts(transformedApplications || []);

    } catch (error: any) {
      handleError(error);
    } finally {
      setIsLoading(false);
      console.log('🏁 Fetch completed');
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    statusCounts,
    error,
    fetchApplicationsInRadius,
  };
};