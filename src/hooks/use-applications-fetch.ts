import { useState } from 'react';
import { Application } from "@/types/planning";
import { supabase } from "@/integrations/supabase/client";
import { transformApplicationData } from '@/utils/applicationTransforms';
import { LatLngTuple } from 'leaflet';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import debounce from 'lodash/debounce';

// Cache duration in milliseconds (5 minutes)
const CACHE_TIME = 5 * 60 * 1000;

export const useApplicationsFetch = () => {
  const [totalCount, setTotalCount] = useState(0);
  const queryClient = useQueryClient();

  // Create a cache key based on search parameters
  const createCacheKey = (center: LatLngTuple, radius: number, page: number = 0, pageSize: number = 100) => {
    return ['applications', center[0], center[1], radius, page, pageSize];
  };

  // Debounced fetch function
  const debouncedFetch = debounce(async (
    center: LatLngTuple,
    radius: number,
    page: number = 0,
    pageSize: number = 100
  ) => {
    console.log('🔍 Fetching applications:', { center, radius, page, pageSize });

    try {
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
        throw error;
      }

      if (!data) {
        console.log('No applications found');
        return { applications: [], totalCount: 0 };
      }

      const { applications: appsData, total_count, status_counts } = data[0];

      console.log(`📦 Raw applications data:`, appsData?.map(app => ({
        id: app.id,
        class_3: app.class_3,
        title: app.title
      })));

      // Pre-compute coordinate transformations
      const transformedApplications = appsData
        ?.map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null);

      console.log('✨ Transformed applications:', transformedApplications?.map(app => ({
        id: app.id,
        class_3: app.class_3,
        title: app.title
      })));

      return {
        applications: transformedApplications || [],
        totalCount: total_count || 0,
        statusCounts: status_counts || {}
      };
    } catch (error: any) {
      console.error('Failed to fetch applications:', error);
      throw error;
    }
  }, 300); // 300ms debounce

  const fetchApplicationsInRadius = async (
    center: LatLngTuple,
    radius: number,
    page: number = 0,
    pageSize: number = 100
  ) => {
    const cacheKey = createCacheKey(center, radius, page, pageSize);
    
    // Check cache first
    const cachedData = queryClient.getQueryData(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    const result = await debouncedFetch(center, radius, page, pageSize);
    
    // Cache the result
    queryClient.setQueryData(cacheKey, result, {
      cacheTime: CACHE_TIME
    });

    return result;
  };

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: () => fetchApplicationsInRadius([51.5074, -0.1278], 1000),
    staleTime: CACHE_TIME,
    cacheTime: CACHE_TIME,
    refetchOnWindowFocus: false
  });

  return {
    applications: applications.applications || [],
    isLoading,
    totalCount,
    error,
    fetchApplicationsInRadius,
  };
};