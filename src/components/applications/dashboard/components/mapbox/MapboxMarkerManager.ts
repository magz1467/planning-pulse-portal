import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

interface MarkerInfo {
  marker: mapboxgl.Marker;
  application: Application;
}

export class MapboxMarkerManager {
  private map: mapboxgl.Map;
  private markers: { [key: number]: MarkerInfo } = {};
  private onMarkerClick: (id: number) => void;

  constructor(map: mapboxgl.Map, onMarkerClick: (id: number) => void) {
    this.map = map;
    this.onMarkerClick = onMarkerClick;
  }

  public getMarkers() {
    return this.markers;
  }

  public removeAllMarkers() {
    Object.values(this.markers).forEach(({ marker }) => {
      marker.remove();
    });
    this.markers = {};
  }

  public addMarker(application: Application, isSelected: boolean) {
    if (!application.coordinates) {
      console.warn('Attempted to add marker for application without coordinates');
      return;
    }

    try {
      const [lat, lng] = application.coordinates;
      
      // Remove existing marker if it exists
      if (this.markers[application.id]) {
        this.markers[application.id].marker.remove();
      }

      // Create marker element
      const el = this.createMarkerElement(isSelected);

      // Create and add marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center'
      })
        .setLngLat([lng, lat])
        .addTo(this.map);

      this.markers[application.id] = { marker, application };

      // Add click handler
      el.addEventListener('click', () => {
        this.onMarkerClick(application.id);
      });

    } catch (error) {
      console.error('Error adding marker:', error);
    }
  }

  public updateMarkerStyle(applicationId: number, isSelected: boolean) {
    const markerInfo = this.markers[applicationId];
    if (!markerInfo) return;

    const el = markerInfo.marker.getElement();
    this.updateMarkerElement(el, isSelected);
  }

  private createMarkerElement(isSelected: boolean): HTMLDivElement {
    const el = document.createElement('div');
    this.updateMarkerElement(el, isSelected);
    return el;
  }

  private updateMarkerElement(el: HTMLElement, isSelected: boolean) {
    el.className = 'marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.backgroundImage = `url(${isSelected ? '/marker-selected.svg' : '/marker.svg'})`;
    el.style.backgroundSize = 'cover';
    el.style.cursor = 'pointer';
  }
}