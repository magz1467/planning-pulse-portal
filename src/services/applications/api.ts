import { supabase } from "@/integrations/supabase/client";
import { FetchApplicationsParams, ApplicationsError } from './types';
import { logFetchParams, logFetchError, logFetchSuccess } from './logging';

export const fetchApplicationsFromSupabase = async ({
  center,
  radiusInMeters,
  pageSize = 100,
  pageNumber = 0
}: FetchApplicationsParams) => {
  logFetchParams(center, radiusInMeters, pageSize, pageNumber);

  try {
    const { data: apps, error } = await supabase.rpc(
      'get_applications_within_radius',
      {
        center_lat: center[0],
        center_lng: center[1],
        radius_meters: radiusInMeters,
        page_size: pageSize,
        page_number: pageNumber
      }
    );

    if (error) {
      logFetchError(error, {
        center,
        radiusInMeters,
        pageSize,
        pageNumber
      });
      throw error;
    }

    if (!apps || !Array.isArray(apps)) {
      throw new Error('Invalid response format from database');
    }

    logFetchSuccess(apps);
    return apps;

  } catch (error: any) {
    logFetchError(error, {
      center,
      radiusInMeters,
      pageSize,
      pageNumber
    });
    throw error;
  }
};

export const fetchApplicationsCountFromSupabase = async (
  center: [number, number],
  radiusInMeters: number
) => {
  logFetchParams(center, radiusInMeters);

  try {
    const { data: count, error } = await supabase.rpc(
      'get_applications_count_within_radius',
      {
        center_lat: center[0],
        center_lng: center[1],
        radius_meters: radiusInMeters
      }
    );

    if (error) {
      logFetchError(error, { center, radiusInMeters });
      throw error;
    }

    console.log('Successfully fetched applications count:', count);
    return count;

  } catch (error: any) {
    logFetchError(error, { center, radiusInMeters });
    throw error;
  }
};