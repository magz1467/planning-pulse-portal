import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

export class MapboxMarkerManager {
  private markers: { [key: number]: mapboxgl.Marker } = {};
  
  constructor(private map: mapboxgl.Map, private onMarkerClick: (id: number) => void) {}

  addMarker(application: Application, isSelected: boolean) {
    if (!application.coordinates) {
      console.warn(`Application ${application.id} has no coordinates`);
      return;
    }

    try {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = '25px';
      el.style.height = '25px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = isSelected ? '#065F46' : '#10B981';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([application.coordinates[1], application.coordinates[0]])
        .addTo(this.map);

      el.addEventListener('click', () => {
        this.onMarkerClick(application.id);
      });

      this.markers[application.id] = marker;
    } catch (error) {
      console.error(`Error adding marker for application ${application.id}:`, error);
    }
  }

  updateMarkerStyle(id: number, isSelected: boolean) {
    const marker = this.markers[id];
    if (marker) {
      const el = marker.getElement();
      el.style.backgroundColor = isSelected ? '#065F46' : '#10B981';
    }
  }

  removeAllMarkers() {
    Object.values(this.markers).forEach(marker => {
      try {
        if (marker) {
          marker.remove();
        }
      } catch (err) {
        console.warn('Error removing marker:', err);
      }
    });
    this.markers = {};
  }

  getMarkers() {
    return this.markers;
  }
}