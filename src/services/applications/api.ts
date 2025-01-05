import { supabase } from "@/integrations/supabase/client";
import { FetchApplicationsParams } from './types';

export const fetchApplicationsFromSupabase = async ({
  center,
  radiusInMeters,
  pageSize = 100,
  pageNumber = 0
}: FetchApplicationsParams) => {
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
    ).throwOnError();

    if (!apps || !Array.isArray(apps)) {
      throw new Error('Invalid response format from database');
    }

    return apps;

  } catch (error: any) {
    throw error;
  }
};

export const fetchApplicationsCountFromSupabase = async (
  center: [number, number],
  radiusInMeters: number
) => {
  try {
    const { data: count, error } = await supabase.rpc(
      'get_applications_count_within_radius',
      {
        center_lat: center[0],
        center_lng: center[1],
        radius_meters: radiusInMeters
      }
    ).throwOnError();

    return count;

  } catch (error: any) {
    throw error;
  }
};