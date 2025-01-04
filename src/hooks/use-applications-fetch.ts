import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';
import { calculateDistance } from '@/utils/distance';

export const useApplicationsFetch = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchApplicationsInRadius = async (
    center: LatLngTuple,
    filters?: { status?: string; type?: string }
  ) => {
    setIsLoading(true);
    console.log('Fetching applications with center:', center);
    
    try {
      // Simple spatial query with limit for performance
      const { data: apps, error } = await supabase
        .from('applications')
        .select('*')
        .not('geom', 'is', null)
        .filter('status', 'not.is', null)
        .limit(100);

      if (error) {
        console.error('Data fetch error:', error);
        throw error;
      }

      if (!apps || apps.length === 0) {
        console.log('No applications found');
        setApplications([]);
        setTotalCount(0);
        return;
      }

      console.log('Raw applications data:', apps);

      const transformedData = apps?.map((app: any) => {
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

        const application: Application = {
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
          ai_title: app.ai_title,
          postcode: app.postcode || ''
        };

        return application;
      }).filter((app): app is Application => app !== null);
      
      console.log('Transformed applications:', transformedData);
      setApplications(transformedData || []);
      setTotalCount(transformedData.length);

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
    fetchApplicationsInRadius
  };
};