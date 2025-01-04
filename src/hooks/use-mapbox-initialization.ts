import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";
import { LatLngTuple } from 'leaflet';
import { MapboxMarkerManager } from '@/components/applications/dashboard/components/mapbox/MapboxMarkerManager';

interface UseMapboxInitializationProps {
  container: HTMLDivElement | null;
  initialCenter: LatLngTuple;
  onError: (error: string, debug: string) => void;
  onMapLoaded: (map: mapboxgl.Map, markerManager: MapboxMarkerManager) => void;
}

export const useMapboxInitialization = ({
  container,
  initialCenter,
  onError,
  onMapLoaded
}: UseMapboxInitializationProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerManager = useRef<MapboxMarkerManager | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current || !container) return;

    const initializeMap = async () => {
      try {
        console.log('Initializing map...', {
          containerExists: !!container,
          dimensions: {
            width: container.offsetWidth,
            height: container.offsetHeight
          }
        });
        
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError) {
          const msg = `Error getting Mapbox token: ${tokenError.message}`;
          console.error(msg, {
            error: tokenError,
            context: 'Token fetch failed'
          });
          onError(msg, JSON.stringify(tokenError, null, 2));
          return;
        }

        if (!data || !data.token) {
          const msg = `No Mapbox token returned from function. Response: ${JSON.stringify(data)}`;
          console.error(msg, {
            data,
            context: 'Invalid token response'
          });
          onError('Failed to initialize map: No access token available', msg);
          return;
        }

        console.log('Successfully retrieved Mapbox token');
        mapboxgl.accessToken = data.token;

        console.log('Creating Mapbox instance...');
        const newMap = new mapboxgl.Map({
          container,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [initialCenter[1], initialCenter[0]],
          zoom: 14,
          maxZoom: 18,
          minZoom: 9,
          attributionControl: true,
          failIfMajorPerformanceCaveat: true,
          preserveDrawingBuffer: true,
          antialias: true
        });

        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

        newMap.on('load', () => {
          console.log('Map loaded successfully');
          map.current = newMap;
          markerManager.current = new MapboxMarkerManager(newMap, () => {});
          onMapLoaded(newMap, markerManager.current);
          initializedRef.current = true;
          setIsLoading(false);
        });

        newMap.on('error', (e) => {
          console.error('Mapbox error:', e);
          onError('Failed to load map resources', JSON.stringify(e.error, null, 2));
        });

      } catch (err) {
        console.error('Map initialization failed:', err);
        onError('Failed to initialize map', JSON.stringify(err, null, 2));
      }
    };

    initializeMap();

    return () => {
      console.log('Cleaning up map...');
      if (markerManager.current) {
        markerManager.current.removeAllMarkers();
        markerManager.current = null;
      }
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initializedRef.current = false;
    };
  }, [container, initialCenter, onError, onMapLoaded]);

  return { isLoading, map: map.current, markerManager: markerManager.current };
};