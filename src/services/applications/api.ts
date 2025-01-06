import { supabase } from "@/integrations/supabase/client";
import { FetchApplicationsParams, StatusCounts } from './types';
import { transformApplicationData } from '@/utils/applicationTransforms';

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
): Promise<number> => {
  const { count, error } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .not('geom', 'is', null)
    .filter('geom', 'not.is', null);

  if (error) throw error;
  return count || 0;
};

export const fetchStatusCounts = async (
  center: [number, number],
  radiusInMeters: number
): Promise<StatusCounts> => {
  try {
    const { data, error } = await supabase.rpc(
      'get_applications_status_counts',
      {
        center_lat: center[0],
        center_lng: center[1],
        radius_meters: radiusInMeters
      }
    );

    if (error) throw error;

    const counts: StatusCounts = {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    };

    if (Array.isArray(data)) {
      data.forEach((row: { status: string; count: number }) => {
        if (row.status in counts) {
          counts[row.status as keyof StatusCounts] = row.count;
        }
      });
    }

    return counts;
  } catch (error) {
    console.error('Error fetching status counts:', error);
    return {
      'Under Review': 0,
      'Approved': 0,
      'Declined': 0,
      'Other': 0
    };
  }
};