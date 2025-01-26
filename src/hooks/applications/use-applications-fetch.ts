import { supabase } from "@/integrations/supabase/client";
import { transformApplicationData } from '@/utils/applicationTransforms';
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';

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

export const fetchApplicationsInRadius = async ({
  center,
  radius,
  page = 0,
  pageSize = 100
}: FetchApplicationsParams): Promise<ApplicationsResponse> => {
  console.log('🔍 Starting fetch with params:', { 
    center, 
    radius, 
    page, 
    pageSize,
    timestamp: new Date().toISOString()
  });

  try {
    const { data, error } = await supabase.functions.invoke('fetch-searchland-search', {
      body: {
        lat: center[0],
        lng: center[1],
        radius: radius,
        page: page + 1, // Searchland API uses 1-based pagination
        limit: pageSize
      }
    });

    if (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }

    if (!data || !data.data) {
      console.log('No applications found');
      return {
        applications: [],
        totalCount: 0,
        rawData: null
      };
    }

    console.log(`📦 Raw applications data:`, data.data?.map(app => ({
      id: app.id,
      reference: app.reference,
      description: app.description
    })));

    const transformedApplications = data.data
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
      totalCount: data.total || 0,
      rawData: data
    };

  } catch (error: any) {
    console.error('Failed to fetch applications:', error);
    console.error('Error details:', {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code
    });
    throw error;
  }
}