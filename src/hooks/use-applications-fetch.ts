import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';
import { MAP_DEFAULTS } from '@/utils/mapConstants';
import { transformApplicationData } from '@/utils/applicationTransforms';
import { fetchApplicationsFromSupabase } from '@/services/applicationsService';

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
        center_longitude: center[1],
        center_latitude: center[0]
      });
      
      if (!center || !Array.isArray(center) || center.length !== 2) {
        console.error('❌ Invalid center coordinates:', center);
        toast({
          title: "Invalid location",
          description: "Could not determine the search location. Please try again.",
          variant: "destructive",
        });
        setApplications([]);
        setTotalCount(0);
        return;
      }

      const apps = await fetchApplicationsFromSupabase(center, radiusInMeters);

      if (apps.length === 0) {
        console.log('ℹ️ No applications found within radius', {
          center,
          radiusInMeters
        });
        toast({
          title: "No results found",
          description: "No planning applications were found in this area. Try searching a different location or increasing the search radius.",
          variant: "default",
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

      const transformedData = apps
        .map(app => transformApplicationData(app, center))
        .filter((app): app is Application => app !== null);
      
      console.log('📊 Final transformed data:', {
        totalApplications: transformedData.length,
        withCoordinates: transformedData.filter(app => app.coordinates).length,
        timestamp: new Date().toISOString()
      });
      
      setApplications(transformedData);
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