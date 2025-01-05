import { supabase } from "@/integrations/supabase/client";
import { LatLngTuple } from 'leaflet';

export const fetchApplicationsFromSupabase = async (
  center: LatLngTuple,
  radiusInMeters: number,
  pageSize = 100,
  pageNumber = 0
) => {
  console.log('Fetching applications with params:', {
    center_longitude: center[1],
    center_latitude: center[0],
    radius_meters: radiusInMeters,
    page_size: pageSize,
    page_number: pageNumber
  });

  try {
    const { data: apps, error } = await supabase.rpc(
      'get_applications_within_radius',
      {
        center_lng: center[1],
        center_lat: center[0],
        radius_meters: radiusInMeters,
        page_size: pageSize,
        page_number: pageNumber
      }
    );

    if (error) {
      console.error('Supabase RPC error:', {
        error,
        params: {
          center,
          radiusInMeters,
          pageSize,
          pageNumber
        }
      });
      throw error;
    }

    if (!apps || !Array.isArray(apps)) {
      console.error('Invalid response format:', apps);
      throw new Error('Invalid response format from database');
    }

    console.log('Successfully fetched applications:', {
      count: apps.length,
      firstApp: apps[0],
      lastApp: apps[apps.length - 1]
    });

    return apps;

  } catch (error: any) {
    console.error('Error fetching applications:', {
      error,
      message: error.message,
      params: {
        center,
        radiusInMeters,
        pageSize,
        pageNumber
      }
    });
    throw error;
  }
};

export const fetchApplicationsCountFromSupabase = async (
  center: LatLngTuple,
  radiusInMeters: number
) => {
  console.log('Fetching applications count with params:', {
    center_longitude: center[1],
    center_latitude: center[0],
    radius_meters: radiusInMeters
  });

  try {
    const { data: count, error } = await supabase.rpc(
      'get_applications_count_within_radius',
      {
        center_lng: center[1],
        center_lat: center[0],
        radius_meters: radiusInMeters
      }
    );

    if (error) {
      console.error('Supabase RPC count error:', {
        error,
        params: {
          center,
          radiusInMeters
        }
      });
      throw error;
    }

    console.log('Successfully fetched applications count:', count);
    return count;

  } catch (error: any) {
    console.error('Error fetching applications count:', {
      error,
      message: error.message,
      params: {
        center,
        radiusInMeters
      }
    });
    throw error;
  }
};