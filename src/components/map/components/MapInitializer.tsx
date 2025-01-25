import { useEffect, RefObject } from 'react';
import mapboxgl from 'mapbox-gl';
import { LatLngTuple } from 'leaflet';
import { toast } from '@/components/ui/use-toast';
import { supabase } from "@/integrations/supabase/client";

interface MapInitializerProps {
  mapContainer: RefObject<HTMLDivElement>;
  mapRef: RefObject<mapboxgl.Map>;
  coordinates: LatLngTuple;
}

export const MapInitializer = ({ mapContainer, mapRef, coordinates }: MapInitializerProps) => {
  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) {
        console.error('Map container not found');
        return;
      }

      try {
        // Initialize map with env variable first
        const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
        
        if (!token) {
          console.error('Mapbox token not found');
          toast({
            title: "Map Error",
            description: "Unable to initialize map. Please check configuration.",
            variant: "destructive"
          });
          return;
        }

        // Set Mapbox token
        mapboxgl.accessToken = token;

        try {
          // Create the map instance - note the coordinate order for Mapbox [lng, lat]
          const map = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/light-v11',
            center: [coordinates[1], coordinates[0]], // Convert to [lng, lat]
            zoom: 13,
          });

          // Add navigation controls
          map.addControl(new mapboxgl.NavigationControl(), 'top-right');

          // Log when map loads
          map.on('load', () => {
            console.log('🌍 Map loaded successfully');
          });

          // Log any map errors
          map.on('error', (e) => {
            console.error('🚨 Map error:', e);
            toast({
              title: "Map Error",
              description: "There was an error loading the map. Please try refreshing.",
              variant: "destructive"
            });
          });

          // Use Object.defineProperty to set the map reference
          Object.defineProperty(mapRef, 'current', {
            value: map,
            writable: true
          });
        } catch (error) {
          console.error('❌ Error creating map:', error);
          toast({
            title: "Map Error",
            description: "Failed to initialize map. Please try again later.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Failed to initialize map:', error);
        toast({
          title: "Map Error",
          description: "Unable to initialize map. Please try again later.",
          variant: "destructive"
        });
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        console.log('🧹 Cleaning up map');
        mapRef.current.remove();
        // Use Object.defineProperty to clear the map reference
        Object.defineProperty(mapRef, 'current', {
          value: null,
          writable: true
        });
      }
    };
  }, []);

  return null;
};