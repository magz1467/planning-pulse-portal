import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const MapView = () => {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTrialData = async () => {
      const { data, error } = await supabase
        .from('trial_application_data')
        .select('*');

      if (error) {
        console.error('Error fetching trial data:', error);
        return;
      }

      // Transform the data to match the Application type
      const transformedData = data.map((item, index) => ({
        id: item.id,
        title: item.description || 'No description available',
        address: item.address || 'No address available',
        status: 'Under Review',
        reference: item.application_reference || '',
        description: item.description || '',
        submissionDate: item.submission_date ? new Date(item.submission_date).toISOString() : '',
        coordinates: item.location?.coordinates ? 
          [item.location.coordinates[1], item.location.coordinates[0]] as [number, number] :
          [51.5074, -0.1278] as [number, number],
        postcode: 'N/A',
      }));

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