import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

export class MapboxMarkerManager {
  private map: mapboxgl.Map;
  private markers: { [key: number]: mapboxgl.Marker } = {};
  private onMarkerClick: (id: number) => void;

  constructor(map: mapboxgl.Map, onMarkerClick: (id: number) => void) {
    this.map = map;
    this.onMarkerClick = onMarkerClick;
  }

  addMarker(application: Application, isSelected: boolean = false) {
    if (!application.coordinates) return;

    const [lat, lng] = application.coordinates;

    // Create marker element
    const el = document.createElement('div');
    el.className = isSelected ? 'marker-selected' : 'marker';
    el.style.backgroundImage = isSelected ? 'url(/marker-selected.svg)' : 'url(/marker.svg)';
    el.style.width = '32px';
    el.style.height = '32px';
    el.style.backgroundSize = '100%';
    el.style.cursor = 'pointer';

    // Create and add the marker
    const marker = new mapboxgl.Marker(el)
      .setLngLat([lng, lat])
      .addTo(this.map);

    // Add click handler
    el.addEventListener('click', () => {
      this.onMarkerClick(application.id);
    });

    // Store marker reference
    this.markers[application.id] = marker;
  }

  removeMarker(id: number) {
    if (this.markers[id]) {
      this.markers[id].remove();
      delete this.markers[id];
    }
  }

  removeAllMarkers() {
    Object.values(this.markers).forEach(marker => marker.remove());
    this.markers = {};
  }
}