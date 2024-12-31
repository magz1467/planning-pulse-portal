import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';

export const useApplicationsData = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [searchPoint, setSearchPoint] = useState<LatLngTuple | null>(null);
  const { toast } = useToast();
  const PAGE_SIZE = 100;
  const MAX_RETRIES = 3;
  const RETRY_DELAY = 1000; // 1 second
  const RADIUS = 1000; // 1km in meters

  const fetchWithRetry = async (fn: () => Promise<any>, retries = MAX_RETRIES): Promise<any> => {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && error?.status === 500) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchWithRetry(fn, retries - 1);
      }
      throw error;
    }
  };

  const fetchApplicationsInRadius = async (
    center: LatLngTuple,
    filters?: { status?: string; type?: string }
  ) => {
    setIsLoading(true);
    console.log('Fetching applications with center:', center);
    
    try {
      // First get the total count
      let query = supabase.rpc('get_applications_count_within_radius', {
        center_lng: center[1],
        center_lat: center[0],
        radius_meters: RADIUS
      });

      const { data: countData, error: countError } = await fetchWithRetry(async () => 
        await query
      );

      if (countError) throw countError;
      setTotalCount(countData || 0);
      console.log('Total count:', countData);

      // Then get the paginated data
      let dataQuery = supabase.rpc('get_applications_within_radius', {
        center_lng: center[1],
        center_lat: center[0],
        radius_meters: RADIUS,
        page_size: PAGE_SIZE,
        page_number: currentPage
      });

      // Apply filters if they exist
      if (filters?.status) {
        dataQuery = dataQuery.eq('status', filters.status);
      }
      if (filters?.type) {
        dataQuery = dataQuery.eq('application_type', filters.type);
      }

      const { data, error } = await fetchWithRetry(async () => await dataQuery);

      if (error) throw error;

      if (!data || data.length === 0) {
        console.log('No applications found');
        setApplications([]);
        return;
      }

      console.log('Raw applications data:', data);

      // Transform the data to match the Application type
      const transformedData = data?.map(app => {
        const geomObj = app.geom;
        let coordinates: [number, number] | null = null;

        if (geomObj && typeof geomObj === 'object' && 'coordinates' in geomObj) {
          coordinates = [
            geomObj.coordinates[1] as number,
            geomObj.coordinates[0] as number
          ];
        }

        if (!coordinates) return null;

        // Extract image URL from application_details if it exists
        let imageUrl = '/placeholder.svg';
        if (app.application_details && typeof app.application_details === 'object') {
          const details = app.application_details as any;
          if (details.images && Array.isArray(details.images) && details.images.length > 0) {
            imageUrl = details.images[0];
          }
        }

        return {
          id: app.application_id,
          title: app.description || '',
          address: `${app.site_name || ''} ${app.street_name || ''} ${app.locality || ''} ${app.postcode || ''}`.trim(),
          status: app.status || '',
          distance: 'N/A',
          reference: app.lpa_app_no || '',
          description: app.description || '',
          applicant: typeof app.application_details === 'object' ? 
            (app.application_details as any)?.applicant || '' : '',
          submissionDate: app.valid_date || '',
          decisionDue: app.decision_target_date || '',
          type: app.application_type || '',
          ward: app.ward || '',
          officer: typeof app.application_details === 'object' ? 
            (app.application_details as any)?.officer || '' : '',
          consultationEnd: app.last_date_consultation_comments || '',
          image: imageUrl,
          coordinates
        };
      }).filter((app): app is Application & { coordinates: [number, number] } => 
        app !== null && app.coordinates !== null
      );
      
      console.log('Transformed applications:', transformedData);
      setApplications(transformedData || []);
    } catch (error: any) {
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    currentPage,
    setCurrentPage,
    fetchApplicationsInRadius,
    searchPoint,
    setSearchPoint,
    PAGE_SIZE
  };
};