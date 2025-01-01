import mapboxgl from 'mapbox-gl';
import { LatLngTuple } from 'leaflet';

export class MapboxInitializer {
  static async initialize(
    container: HTMLDivElement,
    initialCenter: LatLngTuple,
    onError: (error: string, debug: string) => void
  ): Promise<mapboxgl.Map | null> {
    try {
      const token = process.env.REACT_APP_MAPBOX_TOKEN || '';
      if (!token) {
        onError('Mapbox token not found', 'Please check environment variables');
        return null;
      }

      mapboxgl.accessToken = token;

      const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [initialCenter[1], initialCenter[0]],
        zoom: 14
      });

      map.addControl(new mapboxgl.NavigationControl(), 'top-right');

      return map;
    } catch (err) {
      onError('Failed to initialize map', err instanceof Error ? err.message : String(err));
      return null;
    }
  }
}