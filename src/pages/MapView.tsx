import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { TrialApplicationData } from "@/types/trial";
import { transformApplicationData } from "@/utils/applicationTransforms";
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
        // Call the Landhawk edge function
        const { data, error } = await supabase.functions.invoke('fetch-trial-data', {
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

        console.log('📦 Received Landhawk data:', data?.length || 0, 'records');

        // Transform the data to match the Application type
        const transformedData = (data as TrialApplicationData[]).map((item) => {
          console.log('🔄 Processing item:', item.id, 'Location:', item.location);
          
          if (!item.location?.coordinates) {
            console.warn('⚠️ Missing coordinates for item:', item.id);
            return null;
          }

          return {
            id: item.id,
            title: item.description || 'No description available',
            address: item.address || 'No address available',
            status: item.status || 'Under Review',
            reference: item.application_reference || '',
            description: item.description || '',
            submissionDate: item.submission_date ? new Date(item.submission_date).toISOString() : '',
            coordinates: item.location?.coordinates ? 
              [item.location.coordinates[1], item.location.coordinates[0]] as [number, number] :
              [51.5074, -0.1278] as [number, number],
            postcode: 'N/A',
            applicant: item.applicant_name || 'Not specified',
            decisionDue: item.decision_date?.toString() || '',
            type: item.application_type || 'Planning Application',
            ward: item.ward || 'Not specified',
            officer: 'Not assigned',
            consultationEnd: item.consultation_end_date?.toString() || '',
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