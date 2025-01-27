import { useState } from 'react';
import { Application } from "@/types/planning";
import { supabase } from "@/integrations/supabase/client";
import { transformApplicationData } from '@/utils/applicationTransforms';
import { LatLngTuple } from 'leaflet';
import { useToast } from '@/hooks/use-toast';

export interface FetchApplicationsParams {
  center: LatLngTuple;
  radius: number;
  page?: number;
  pageSize?: number;
}

export interface ApplicationsResponse {
  applications: Application[];
  totalCount: number;
  rawData: any;
}

const MAX_RETRIES = 2;
const INITIAL_TIMEOUT = 15000; // 15 seconds

export const fetchApplicationsInRadius = async ({
  center,
  radius,
  page = 0,
  pageSize = 100
}: FetchApplicationsParams): Promise<ApplicationsResponse> => {
  let retries = 0;
  
  while (retries <= MAX_RETRIES) {
    try {
      console.log('🔍 Starting fetch with params:', { 
        center, 
        radius, 
        page, 
        pageSize,
        retryAttempt: retries,
        timestamp: new Date().toISOString()
      });

      const { data, error } = await supabase
        .rpc('get_applications_with_counts_optimized', {
          center_lng: center[1],
          center_lat: center[0],
          radius_meters: radius,
          page_size: pageSize,
          page_number: page
        });

      if (error) {
        console.error('Error fetching applications:', error);
        if (retries < MAX_RETRIES) {
          retries++;
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
          continue;
        }
        throw error;
      }

      if (!data || !data[0]) {
        console.log('No applications found');
        return {
          applications: [],
          totalCount: 0,
          rawData: null
        };
      }

      const { applications: appsData, total_count } = data[0];

      console.log(`📦 Raw applications data:`, appsData?.map(app => ({
        id: app.id,
        class_3: app.class_3,
        title: app.title,
        final_impact_score: app.final_impact_score
      })));

      const transformedApplications = appsData
        ?.map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null);

      console.log('✨ Transformed applications:', transformedApplications?.map(app => ({
        id: app.id,
        class_3: app.class_3,
        title: app.title,
        final_impact_score: app.final_impact_score
      })));

      return {
        applications: transformedApplications || [],
        totalCount: total_count || 0,
        rawData: data[0]
      };

    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        retryAttempt: retries
      });
      
      if (retries === MAX_RETRIES) {
        throw error;
      }
      
      retries++;
      // Exponential backoff
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retries)));
    }
  }

  throw new Error('Failed to fetch applications after all retries');
};

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchApplications = async (
    center: LatLngTuple,
    radius: number,
    page = 0,
    pageSize = 100
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetchApplicationsInRadius({
        center,
        radius,
        page,
        pageSize
      });

      setApplications(response.applications);
      setTotalCount(response.totalCount);

    } catch (err: any) {
      console.error('Search error:', err);
      setError(err);
      
      toast({
        title: "Error loading applications",
        description: "There was a problem fetching the planning applications. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    error,
    fetchApplications,
  };
};