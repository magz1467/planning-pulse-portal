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

      // Test token validity before map creation
      try {
        await fetch(`https://api.mapbox.com/tokens/v2/validate?access_token=${data.token}`);
      } catch (validationError) {
        const msg = 'Mapbox token validation failed';
        console.error(msg, {
          error: validationError,
          context: 'Token validation'
        });
        onError(msg, JSON.stringify(validationError, null, 2));
        return null;
      }

      console.log('Creating Mapbox instance...');
      const map = new mapboxgl.Map({
        container,
        // Using a basic vector style that should work with any token
        style: 'mapbox://styles/mapbox/basic-v9',
        center: [initialCenter[1], initialCenter[0]],
        zoom: 14,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add detailed error logging
      map.on('error', (e: mapboxgl.MapboxEvent & { error?: Error }) => {
        const msg = `Mapbox map error: ${e.error?.message || 'Unknown error'}`;
        const errorDetails = {
          message: e.error?.message || '',
          type: e.type,
          target: e.target.getStyle()?.name || 'unknown style'
        };
        
        console.error(msg, {
          error: errorDetails,
          context: 'Map runtime error'
        });
        
        onError(msg, JSON.stringify(errorDetails, null, 2));
      });

      // Add style load error handling
      map.on('style.load', () => {
        console.log('Map style loaded successfully');
      });

      map.on('style.error', (e: mapboxgl.MapboxEvent & { error?: Error }) => {
        const msg = `Map style error: ${e.error?.message || 'Unknown error'}`;
        console.error(msg, {
          error: e.error,
          context: 'Style loading error'
        });
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