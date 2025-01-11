import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { TrialApplicationData } from "@/types/trial";
import { toast } from "@/components/ui/use-toast";

const MapView = () => {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLandhawkData = async () => {
      console.log('🔍 Starting to fetch Landhawk data...');
      setIsLoading(true);
      
      try {
        const { data: response, error } = await supabase.functions.invoke('fetch-trial-data', {
          body: {
            bbox: '-0.5,51.3,-0.1,51.5' // London area
          }
        });

        if (error) {
          console.error('❌ Error fetching Landhawk data:', error);
          toast({
            title: "Error loading applications",
            description: "Please try again later",
            variant: "destructive"
          });
          return;
        }

        // Check if response has the expected structure
        const data = response?.features || [];
        console.log('📦 Received Landhawk data:', data.length || 0, 'records');

        // Transform the data to match the Application type
        const transformedData = data.map((item: any) => {
          console.log('🔄 Processing item:', item.id, 'Location:', item.geometry);
          
          if (!item.geometry?.coordinates) {
            console.warn('⚠️ Missing coordinates for item:', item.id);
            return null;
          }

          return {
            id: item.id || Math.random(),
            title: item.properties?.description || 'No description available',
            address: item.properties?.address || 'No address available',
            status: item.properties?.status || 'Under Review',
            reference: item.properties?.application_reference || '',
            description: item.properties?.description || '',
            submissionDate: item.properties?.submission_date ? new Date(item.properties.submission_date).toISOString() : '',
            coordinates: item.geometry?.coordinates ? 
              [item.geometry.coordinates[1], item.geometry.coordinates[0]] as [number, number] :
              [51.5074, -0.1278] as [number, number],
            postcode: 'N/A',
            applicant: item.properties?.applicant_name || 'Not specified',
            decisionDue: item.properties?.decision_date?.toString() || '',
            type: item.properties?.application_type || 'Planning Application',
            ward: item.properties?.ward || 'Not specified',
            officer: 'Not assigned',
            consultationEnd: item.properties?.consultation_end_date?.toString() || '',
            image: undefined,
            image_map_url: undefined,
            ai_title: undefined,
            last_date_consultation_comments: undefined,
            valid_date: undefined,
            centroid: undefined,
            impact_score: null,
            impact_score_details: undefined,
            impacted_services: undefined
          } as Application;
        }).filter((app): app is Application => app !== null);

        console.log('✨ Transformed data:', {
          totalTransformed: transformedData.length,
          firstItem: transformedData[0],
          hasCoordinates: transformedData.some(app => app.coordinates)
        });

        setApplications(transformedData);
      } catch (error) {
        console.error('💥 Error in fetchLandhawkData:', error);
        toast({
          title: "Error loading applications",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 2500);
      }
    };

    fetchLandhawkData();
  }, []);
  
  return (
    <ErrorBoundary>
      <MapContent 
        applications={applications}
        selectedId={selectedId}
        coordinates={[51.5074, -0.1278]} // Default to London coordinates
        isMobile={isMobile}
        isMapView={true}
        onMarkerClick={(id) => {
          console.log('🖱️ Marker clicked:', id);
          setSelectedId(id);
        }}
        isLoading={isLoading}
      />
    </ErrorBoundary>
  );
};

export default MapView;