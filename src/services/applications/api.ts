import { supabase } from "@/integrations/supabase/client";
import { FetchApplicationsParams } from './types';

export const fetchApplicationsFromSupabase = async ({
  center,
  radiusInMeters,
  statusFilter,
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
        status_filter: statusFilter,
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

export const fetchStatusCounts = async (
  center: [number, number],
  radiusInMeters: number
) => {
  try {
    const { data, error } = await supabase.rpc(
      'get_applications_status_counts',
      {
        center_lat: center[0],
        center_lng: center[1],
        radius_meters: radiusInMeters
      }
    ).throwOnError();

    if (error) throw error;

    // Convert to expected format
    const counts = {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    };

    data?.forEach((row: { status: string; count: number }) => {
      counts[row.status as keyof typeof counts] = row.count;
    });

    return counts;

  } catch (error: any) {
    console.error('Error fetching status counts:', error);
    return {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    };
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