import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { LatLngBounds } from 'leaflet';

export const useApplicationsData = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const { toast } = useToast();
  const PAGE_SIZE = 100;

  const fetchApplicationsInBounds = async (bounds: LatLngBounds) => {
    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    
    setIsLoading(true);
    
    try {
      // First get the total count
      const { data: countData, error: countError } = await supabase
        .rpc('get_applications_count_in_bounds', {
          sw_lng: sw.lng,
          sw_lat: sw.lat,
          ne_lng: ne.lng,
          ne_lat: ne.lat
        });

      if (countError) throw countError;
      setTotalCount(countData || 0);

      // Then get the paginated data
      const { data, error } = await supabase
        .rpc('get_applications_in_bounds', {
          sw_lng: sw.lng,
          sw_lat: sw.lat,
          ne_lng: ne.lng,
          ne_lat: ne.lat,
          page_size: PAGE_SIZE,
          page_number: currentPage
        });

      if (error) throw error;

      if (!data || data.length === 0) {
        setApplications([]);
        return;
      }

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
          image: '/placeholder.svg',
          coordinates
        };
      }).filter((app): app is Application & { coordinates: [number, number] } => 
        app !== null && app.coordinates !== null
      );
      
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
    fetchApplicationsInBounds,
    PAGE_SIZE
  };
};