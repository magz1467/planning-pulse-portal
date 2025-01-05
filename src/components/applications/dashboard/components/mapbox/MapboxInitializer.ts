import mapboxgl from 'mapbox-gl';
import { LatLngTuple } from 'leaflet';

export class MapboxInitializer {
  static async initialize(
    container: HTMLDivElement,
    initialCenter: LatLngTuple,
    onError: (error: string, debug: string) => void
  ): Promise<mapboxgl.Map | null> {
    try {
      const map = new mapboxgl.Map({
        container,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [initialCenter[1], initialCenter[0]],
        zoom: 14
      });

      return map;
    } catch (error) {
      console.error('Failed to initialize Mapbox map:', error);
      onError(
        'Failed to initialize map',
        error instanceof Error ? error.message : String(error)
      );
      return null;
    }
  }
}