import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { TrialApplicationData } from "@/types/trial";

const MapView = () => {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrialData = async () => {
      console.log('Fetching trial data...');
      const { data, error } = await supabase
        .from('trial_application_data')
        .select('*');

      if (error) {
        console.error('Error fetching trial data:', error);
        return;
      }

      console.log('Received trial data:', data);

      // Transform the data to match the Application type
      const transformedData = (data as TrialApplicationData[]).map((item) => ({
        id: item.id,
        title: item.description || 'No description available',
        address: item.address || 'No address available',
        status: 'Under Review',
        reference: item.application_reference || '',
        description: item.description || '',
        submissionDate: item.submission_date ? new Date(item.submission_date).toISOString() : '',
        coordinates: item.location?.coordinates ? 
          // Note: Leaflet uses [lat, lng] format, so we need to swap the coordinates
          [item.location.coordinates[1], item.location.coordinates[0]] as [number, number] :
          [51.5074, -0.1278] as [number, number],
        postcode: 'N/A',
        // Adding required properties from Application type with default values
        applicant: 'Not specified',
        decisionDue: '',
        type: 'Planning Application',
        ward: 'Not specified',
        officer: 'Not assigned',
        consultationEnd: '',
        image: undefined,
        image_map_url: undefined,
        ai_title: undefined,
        last_date_consultation_comments: undefined,
        valid_date: undefined,
        centroid: undefined,
        impact_score: null,
        impact_score_details: undefined,
        impacted_services: undefined
      }));

      console.log('Transformed data:', transformedData);
      setApplications(transformedData);
    };

    fetchTrialData();
  }, []);
  
  return (
    <ErrorBoundary>
      <MapContent 
        applications={applications}
        selectedId={selectedId}
        coordinates={[51.5074, -0.1278]} // Default to London coordinates
        isMobile={isMobile}
        isMapView={true}
        onMarkerClick={(id) => setSelectedId(id)}
      />
    </ErrorBoundary>
  );
};

export default MapView;