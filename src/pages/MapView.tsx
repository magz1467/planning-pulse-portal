import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { toast } from "@/components/ui/use-toast";
import { FilterBar } from "@/components/FilterBar";
import { SortType } from "@/hooks/use-sort-applications";

const MapView = () => {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMapView, setIsMapView] = useState(true);
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [activeFilters, setActiveFilters] = useState<{
    status?: string;
    type?: string;
    classification?: string;
  }>({});
  const [statusCounts, setStatusCounts] = useState<{
    'Under Review': number;
    'Approved': number;
    'Declined': number;
    'Other': number;
  }>({
    'Under Review': 0,
    'Approved': 0,
    'Declined': 0,
    'Other': 0
  });

  useEffect(() => {
    const fetchSearchlandData = async () => {
      console.log('🔍 Starting to fetch Searchland data...');
      setIsLoading(true);
      
      try {
        const { data: response, error } = await supabase.functions.invoke('fetch-searchland-data', {
          body: {
            bbox: '-0.5,51.3,-0.1,51.5' // London area
          }
        });

        if (error) {
          console.error('❌ Error fetching Searchland data:', error);
          toast({
            title: "Error loading applications",
            description: "Please try again later",
            variant: "destructive"
          });
          return;
        }

        // Transform the data to match the Application type
        const transformedData = response?.applications?.map((item: any) => ({
          id: item.id || Math.random(),
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
        })) || [];

        console.log('✨ Transformed data:', {
          totalTransformed: transformedData.length,
          firstItem: transformedData[0]
        });

        // Calculate status counts
        const counts = transformedData.reduce((acc, app) => {
          const status = app.status.toLowerCase();
          if (status.includes('review') || status.includes('pending')) {
            acc['Under Review']++;
          } else if (status.includes('approved')) {
            acc['Approved']++;
          } else if (status.includes('declined') || status.includes('refused')) {
            acc['Declined']++;
          } else {
            acc['Other']++;
          }
          return acc;
        }, {
          'Under Review': 0,
          'Approved': 0,
          'Declined': 0,
          'Other': 0
        });

        setStatusCounts(counts);
        setApplications(transformedData);
      } catch (error) {
        console.error('💥 Error in fetchSearchlandData:', error);
        toast({
          title: "Error loading applications",
          description: "Please try again later",
          variant: "destructive"
        });
      } finally {
        setTimeout(() => {
          setIsLoading(false);
        }, 1500);
      }
    };

    fetchSearchlandData();
  }, []);

  const handleFilterChange = (filterType: string, value: string) => {
    setActiveFilters(prev => {
      if (value === prev[filterType as keyof typeof prev]) {
        const newFilters = { ...prev };
        delete newFilters[filterType as keyof typeof prev];
        return newFilters;
      }
      return {
        ...prev,
        [filterType]: value
      };
    });
  };

  const handleSortChange = (sortType: SortType) => {
    setActiveSort(sortType);
  };

  const handleToggleView = () => {
    setIsMapView(!isMapView);
  };
  
  return (
    <ErrorBoundary>
      <div className="flex flex-col h-screen">
        <FilterBar 
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
          activeFilters={activeFilters}
          activeSort={activeSort}
          isMapView={isMapView}
          onToggleView={handleToggleView}
          applications={applications}
          statusCounts={statusCounts}
        />
        <MapContent 
          applications={applications}
          selectedId={selectedId}
          coordinates={[51.5074, -0.1278]} // Default to London coordinates
          isMobile={isMobile}
          isMapView={isMapView}
          onMarkerClick={(id) => {
            console.log('🖱️ Marker clicked:', id);
            setSelectedId(id);
          }}
          isLoading={isLoading}
        />
      </div>
    </ErrorBoundary>
  );
};

export default MapView;