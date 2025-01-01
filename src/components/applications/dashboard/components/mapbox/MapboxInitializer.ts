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
      console.log('Fetching Mapbox token from Supabase...');
      const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
      
      if (tokenError) {
        const msg = `Error getting Mapbox token: ${tokenError.message}`;
        console.error(msg);
        onError(msg, JSON.stringify(tokenError, null, 2));
        return null;
      }

      if (!data || !data.token) {
        const msg = `No Mapbox token returned from function. Response: ${JSON.stringify(data)}`;
        console.error(msg);
        onError('Failed to initialize map: No access token available', msg);
        return null;
      }

      console.log('Successfully retrieved Mapbox token');
      mapboxgl.accessToken = data.token;

      const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [initialCenter[1], initialCenter[0]],
        zoom: 14,
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.on('error', (e) => {
        const msg = `Mapbox map error: ${e.error?.message || 'Unknown error'}`;
        console.error(msg, e);
        onError(msg, JSON.stringify(e, null, 2));
      });

      return map;
    } catch (error) {
      const msg = `Error initializing map: ${error instanceof Error ? error.message : 'Unknown error'}`;
      console.error(msg);
      onError(msg, JSON.stringify(error, null, 2));
      return null;
    }
  }
}