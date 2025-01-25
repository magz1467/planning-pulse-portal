import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/planning";
import { SortType } from "@/hooks/use-sort-applications";

export const useMapData = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isMapView, setIsMapView] = useState(true);
  const [activeSort, setActiveSort] = useState<SortType>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([51.5074, -0.1278]);
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

  const fetchPins = useCallback(async (bbox: string) => {
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
  }, [coordinates, toast]);

  return {
    applications,
    selectedId,
    setSelectedId,
    isLoading,
    isMapView,
    setIsMapView,
    activeSort,
    setActiveSort,
    coordinates,
    setCoordinates,
    activeFilters,
    setActiveFilters,
    statusCounts,
    fetchPins
  };
};