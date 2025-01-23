import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { toast } from "@/components/ui/use-toast";
import { FilterBar } from "@/components/FilterBar";
import { SortType } from "@/hooks/use-sort-applications";
import { PostcodeSearch } from "@/components/PostcodeSearch";

const MapView = () => {
  const isMobile = useIsMobile();
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapView, setIsMapView] = useState(true);
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([51.5074, -0.1278]); // Default to London
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

  const fetchSearchlandData = async (bbox: string) => {
    console.log('🔍 Starting to fetch Searchland data...', bbox);
    setIsLoading(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('fetch-searchland-data', {
        body: { bbox }
      });

      if (error) {
        console.error('❌ Error fetching Searchland data:', error);
        toast({
          title: "Error loading applications",
          description: "Please try again later",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Transform the data to match the Application type
      const transformedData = response?.applications?.map((item: any) => ({
        id: item.id || Math.random(),
        title: item.description || 'No description available',
        description: item.description || '',
        address: item.address || 'No address available',
        status: item.status || 'Under Review',
        reference: item.application_reference || '',
        submissionDate: item.submission_date ? new Date(item.submission_date).toISOString() : '',
        coordinates: item.location?.coordinates ? 
          [item.location.coordinates[1], item.location.coordinates[0]] as [number, number] :
          coordinates,
        postcode: item.postcode || 'N/A',
        applicant: item.applicant_name || 'Not specified',
        decisionDue: item.decision_date?.toString() || '',
        type: item.application_type || 'Planning Application',
        ward: item.ward || 'Not specified',
        officer: 'Not assigned',
        consultationEnd: item.consultation_end_date?.toString() || '',
        image: undefined,
        image_map_url: undefined,
        ai_title: undefined,
        last_date_consultation_comments: item.consultation_end_date?.toString(),
        valid_date: item.submission_date?.toString(),
        centroid: undefined,
        impact_score: null,
        impact_score_details: undefined,
        impacted_services: undefined,
        final_impact_score: null,
        engaging_title: item.description
      } as Application)) || [];

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
      
      if (transformedData.length === 0) {
        toast({
          title: "No applications found",
          description: "Try searching in a different area",
          variant: "default"
        });
      } else {
        toast({
          title: "Applications loaded",
          description: `Found ${transformedData.length} applications in this area`,
          variant: "default"
        });
      }

    } catch (error) {
      console.error('💥 Error in fetchSearchlandData:', error);
      toast({
        title: "Error loading applications",
        description: "Please try again later",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostcodeSelect = async (postcode: string) => {
    if (!postcode) {
      toast({
        title: "Invalid Postcode",
        description: "Please enter a valid postcode to search",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsLoading(true);
      // Convert postcode to coordinates using a geocoding service
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
      );
      const data = await response.json();

      if (data.status === 200 && data.result) {
        const { longitude, latitude } = data.result;
        setCoordinates([latitude, longitude]);
        
        // Create a bounding box around the postcode (roughly 2km)
        const bbox = `${longitude - 0.02},${latitude - 0.02},${longitude + 0.02},${latitude + 0.02}`;
        await fetchSearchlandData(bbox);
      } else {
        toast({
          title: "Invalid Postcode",
          description: "Could not find coordinates for this postcode",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error geocoding postcode:', error);
      toast({
        title: "Error",
        description: "Could not process your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="p-4 bg-white border-b">
          <PostcodeSearch
            onSelect={handlePostcodeSelect}
            placeholder="Search postcode to find planning applications"
            className="w-full max-w-xl mx-auto mb-4"
          />
        </div>
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
          coordinates={coordinates}
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