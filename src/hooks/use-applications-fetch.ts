import { useState } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';
import { calculateDistance } from '@/utils/distance';
import { MAP_DEFAULTS } from '@/utils/mapConstants';

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
    console.log('🔍 Starting fetchApplicationsInRadius:', {
      center,
      filters,
      timestamp: new Date().toISOString()
    });
    
    try {
      // Convert kilometers to meters for the database query
      const radiusInMeters = MAP_DEFAULTS.searchRadius * 1000;
      console.log('📏 Query parameters:', {
        radiusInMeters,
        center_lng: center[1],
        center_lat: center[0]
      });
      
      console.time('🕒 Database query execution');
      const { data: apps, error } = await supabase.rpc(
        'get_applications_within_radius',
        { 
          center_lng: center[1],
          center_lat: center[0],
          radius_meters: radiusInMeters,
          page_size: 100,
          page_number: 0
        }
      );
      console.timeEnd('🕒 Database query execution');

      if (error) {
        console.error('❌ Database query error:', {
          error,
          message: error.message,
          details: error.details
        });
        throw error;
      }

      if (!apps || apps.length === 0) {
        console.log('ℹ️ No applications found within radius', {
          center,
          radiusInMeters
        });
        setApplications([]);
        setTotalCount(0);
        return;
      }

      console.log('📊 Raw applications data:', {
        count: apps.length,
        firstApp: apps[0],
        lastApp: apps[apps.length - 1]
      });

      const transformedData = apps?.map((app: any) => {
        console.group(`🔄 Transforming application ${app.application_id}`);
        const geomObj = app.geom;
        let coordinates: [number, number] | null = null;

        if (geomObj && typeof geomObj === 'object' && 'coordinates' in geomObj) {
          coordinates = [
            geomObj.coordinates[1] as number,
            geomObj.coordinates[0] as number
          ];
          console.log('📍 Coordinates extracted:', coordinates);
        } else {
          console.warn('⚠️ Missing or invalid geometry for application:', app.application_id);
        }

        if (!coordinates) {
          console.warn('⚠️ No valid coordinates for application:', app.application_id);
          console.groupEnd();
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
            console.log('🖼️ Image URL processed:', imageUrl);
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

        console.log('✅ Transformed application:', {
          id: application.id,
          coordinates: application.coordinates,
          distance: application.distance
        });
        console.groupEnd();
        return application;
      }).filter((app): app is Application => app !== null);
      
      console.log('📊 Final transformed data:', {
        totalApplications: transformedData.length,
        withCoordinates: transformedData.filter(app => app.coordinates).length,
        timestamp: new Date().toISOString()
      });
      
      setApplications(transformedData || []);
      setTotalCount(transformedData.length);

    } catch (error: any) {
      console.error('❌ Error in fetchApplicationsInRadius:', {
        error,
        message: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      });
      toast({
        title: "Error fetching applications",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      console.log('🏁 Fetch operation completed', {
        timestamp: new Date().toISOString()
      });
    }
  };

  return {
    applications,
    isLoading,
    totalCount,
    fetchApplicationsInRadius
  };
};