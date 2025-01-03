import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';
import { calculateDistance } from '@/utils/distance';

const PAGE_SIZE = 100;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;
const RADIUS = 1000;

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();

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
    console.log('Current filters:', filters);
    
    try {
      const { data, error } = await supabase.functions.invoke('get-applications-with-counts', {
        body: {
          center_lng: center[1],
          center_lat: center[0],
          radius_meters: RADIUS,
          page_size: PAGE_SIZE,
          page_number: currentPage
        }
      });

      if (error) {
        console.error('Data fetch error:', error);
        throw error;
      }

      if (!data || !data.applications || data.applications.length === 0) {
        console.log('No applications found in radius', RADIUS, 'meters from', center);
        setApplications([]);
        setTotalCount(0);
        return;
      }

      console.log('Raw applications data:', data);
      console.log('Status counts:', data.statusCounts);

      const transformedData = data.applications?.map((app: any) => {
        const geomObj = app.geom;
        let coordinates: [number, number] | null = null;

        if (geomObj && typeof geomObj === 'object' && 'coordinates' in geomObj) {
          coordinates = [
            geomObj.coordinates[1] as number,
            geomObj.coordinates[0] as number
          ];
        }

        if (!coordinates) {
          console.log('Missing coordinates for application:', app.application_id);
          return null;
        }

        // Calculate distance in miles
        const distanceInKm = calculateDistance(center, coordinates);
        const distanceInMiles = distanceInKm * 0.621371;
        const formattedDistance = `${distanceInMiles.toFixed(1)} mi`;

        let imageUrl = '/placeholder.svg';
        if (app.application_details && typeof app.application_details === 'object') {
          const details = app.application_details as any;
          if (details.images && Array.isArray(details.images) && details.images.length > 0) {
            const imgUrl = details.images[0];
            imageUrl = imgUrl.startsWith('http') ? imgUrl : `${process.env.VITE_SUPABASE_URL}/storage/v1/object/public/images/${imgUrl}`;
          }
        }

        return {
          id: app.application_id,
          title: app.description || '',
          address: `${app.site_name || ''} ${app.street_name || ''} ${app.locality || ''} ${app.postcode || ''}`.trim(),
          status: app.status || '',
          distance: formattedDistance,
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
          coordinates,
          ai_title: app.ai_title
        };
      }).filter((app): app is Application & { coordinates: [number, number] } => 
        app !== null && app.coordinates !== null
      );
      
      console.log('Transformed applications:', transformedData);
      setApplications(transformedData || []);
      setTotalCount(data.total || 0);
    } catch (error: any) {
      console.error('Error in fetchApplicationsInRadius:', error);
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
    PAGE_SIZE
  };
};