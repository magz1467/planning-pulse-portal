import mapboxgl from 'mapbox-gl';
import { supabase } from "@/integrations/supabase/client";
import { LatLngTuple } from 'leaflet';

export class MapboxInitializer {
  static async initialize(
    container: HTMLDivElement,
    initialCenter: LatLngTuple,
    onError: (error: string, debug: string) => void
  ): Promise<mapboxgl.Map | null> {
    try {
      console.log('Starting map initialization...');
      console.log('Fetching Mapbox token from Supabase...');
      
      const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
      
      if (tokenError) {
        const msg = `Error getting Mapbox token: ${tokenError.message}`;
        console.error(msg, {
          error: tokenError,
          context: 'Token fetch failed'
        });
        onError(msg, JSON.stringify(tokenError, null, 2));
        return null;
      }

      if (!data || !data.token) {
        const msg = `No Mapbox token returned from function. Response: ${JSON.stringify(data)}`;
        console.error(msg, {
          data,
          context: 'Invalid token response'
        });
        onError('Failed to initialize map: No access token available', msg);
        return null;
      }

      console.log('Successfully retrieved Mapbox token');
      mapboxgl.accessToken = data.token;

      console.log('Creating Mapbox instance...');
      const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/light-v11', // Using a simpler style
        center: [initialCenter[1], initialCenter[0]],
        zoom: 14,
        maxZoom: 18,
        minZoom: 9,
        attributionControl: true,
        failIfMajorPerformanceCaveat: true,
        preserveDrawingBuffer: true,
        antialias: true
      });

      // Add navigation control
      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add error handling with proper TypeScript types
      map.on('error', (e: mapboxgl.ErrorEvent) => {
        const msg = `Map error: ${e.error?.message || 'Unknown error'}`;
        console.error(msg, {
          error: e.error,
          context: 'Map runtime error'
        });
        onError(msg, JSON.stringify(e.error, null, 2));
      });

      // Add style load success handler
      map.on('style.load', () => {
        console.log('Map style loaded successfully');
      });

      // Add style load error handler with proper TypeScript types
      map.on('style.error', (e: mapboxgl.ErrorEvent) => {
        const msg = `Style error: ${e.error?.message || 'Unknown error'}`;
        console.error(msg, {
          error: e.error,
          context: 'Style loading error'
        });
        onError(msg, JSON.stringify(e.error, null, 2));
      });

      return map;

    } catch (error) {
      const msg = `Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(msg, {
        error,
        context: 'Map initialization'
      });
      onError(msg, JSON.stringify(error, null, 2));
      return null;
    }
  }
}