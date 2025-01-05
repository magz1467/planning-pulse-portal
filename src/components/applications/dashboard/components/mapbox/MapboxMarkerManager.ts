import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

export class MapboxMarkerManager {
  private markers: { [key: number]: { marker: mapboxgl.Marker, application: Application } } = {};
  
  constructor(private map: mapboxgl.Map, private onMarkerClick: (id: number) => void) {}

  private getStatusColor(status: string): string {
    const statusLower = status.toLowerCase();
    switch (statusLower) {
      case 'declined':
      case 'refused':
        return '#ea384c'; // Red for declined/refused
      case 'under review':
      case 'pending':
      case 'under consideration':
      case 'application under consideration':
        return '#F97316'; // Orange for in-progress
      case 'approved':
        return '#16a34a'; // Green for approved
      default:
        return '#10B981'; // Default color
    }
  }

  addMarker(application: Application, isSelected: boolean) {
    if (!application.coordinates) {
      console.warn(`Application ${application.id} has no coordinates`);
      return;
    }

    try {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = isSelected ? '30px' : '25px';
      el.style.height = isSelected ? '30px' : '25px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = this.getStatusColor(application.status);
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';

      const [lat, lng] = application.coordinates;
      const marker = new mapboxgl.Marker(el)
        .setLngLat([lng, lat])
        .addTo(this.map);

      el.addEventListener('click', () => {
        this.onMarkerClick(application.id);
      });

      this.markers[application.id] = { marker, application };
    } catch (error) {
      console.error(`Error adding marker for application ${application.id}:`, error);
    }
  }

  updateMarkerStyle(id: number, isSelected: boolean) {
    const markerData = this.markers[id];
    if (markerData) {
      const el = markerData.marker.getElement();
      el.style.width = isSelected ? '30px' : '25px';
      el.style.height = isSelected ? '30px' : '25px';
      el.style.backgroundColor = this.getStatusColor(markerData.application.status);
    }
  }

  removeMarker(id: number) {
    const markerData = this.markers[id];
    if (markerData) {
      markerData.marker.remove();
      delete this.markers[id];
    }
  }

  removeAllMarkers() {
    Object.values(this.markers).forEach(({ marker }) => {
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