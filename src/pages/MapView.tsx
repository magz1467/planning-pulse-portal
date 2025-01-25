import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MapContent } from "@/components/map/MapContent";
import { useIsMobile } from "@/hooks/use-mobile";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();

  const fetchPins = async (bbox: string) => {
    console.log('🔍 Starting to fetch pins...', bbox);
    setIsLoading(true);
    
    try {
      const { data: response, error } = await supabase.functions.invoke('fetch-searchland-pins', {
        body: { bbox }
      });

      if (error) {
        console.error('❌ Error fetching pins:', error);
        throw error;
      }

      if (!response?.applications) {
        console.log('No pins data in response:', response);
        setApplications([]);
        setStatusCounts({
          'Under Review': 0,
          'Approved': 0,
          'Declined': 0,
          'Other': 0
        });
        toast({
          title: "No applications found",
          description: "Try searching in a different area",
          variant: "default"
        });
        return;
      }

      console.log(`📦 Received ${response.applications.length} applications from API`);

      // Transform pins to Application format
      const transformedData = response.applications?.map((pin: any) => ({
        id: pin.id || Math.random(),
        title: 'Planning Application',
        description: pin.reference || 'No reference available',
        address: 'Location details pending',
        status: pin.status || 'Under Review',
        reference: pin.reference || '',
        coordinates: pin.coordinates ? 
          [pin.coordinates[1], pin.coordinates[0]] as [number, number] :
          coordinates,
        postcode: 'N/A',
      } as Application));

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

    } catch (error: any) {
      console.error('💥 Error in fetchPins:', error);
      let errorMessage = "Error loading applications. Please try again later.";
      
      if (error.message?.includes('Not Found')) {
        errorMessage = "No planning applications found in this area. Try a different location.";
      } else if (error.message?.includes('API key')) {
        errorMessage = "Authentication error. Please contact support.";
      }
      
      toast({
        title: "Error loading applications",
        description: errorMessage,
        variant: "destructive"
      });
      setApplications([]);
      setStatusCounts({
        'Under Review': 0,
        'Approved': 0,
        'Declined': 0,
        'Other': 0
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
        
        // Create a bounding box around the postcode (roughly 5km)
        // Note: Order must be minLng,minLat,maxLng,maxLat for Searchland API
        const bbox = `${longitude - 0.05},${latitude - 0.05},${longitude + 0.05},${latitude + 0.05}`;
        await fetchPins(bbox);
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