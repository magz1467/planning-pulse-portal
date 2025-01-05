import { supabase } from "@/integrations/supabase/client";
import { LatLngTuple } from 'leaflet';
import { MAP_DEFAULTS } from '@/utils/mapConstants';

export const fetchApplicationsFromSupabase = async (
  center: LatLngTuple,
  radiusInMeters: number,
  pageSize = 100,
  pageNumber = 0
) => {
  console.time('🕒 Database query execution');
  
  const { data: apps, error } = await supabase.rpc(
    'get_applications_within_radius',
    { 
      center_longitude: center[1],
      center_latitude: center[0],
      radius_meters: radiusInMeters,
      page_size: pageSize,
      page_number: pageNumber
    }
  );
  
  console.timeEnd('🕒 Database query execution');

  if (error) {
    console.error('❌ Database query error:', {
      error,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
    throw error;
  }

  if (!apps || !Array.isArray(apps)) {
    console.error('❌ Invalid response format:', apps);
    throw new Error('Invalid response format from database');
  }

  return apps;
};