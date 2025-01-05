import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

export class MarkerCreator {
  static createMarkerElement(application: Application, isSelected: boolean): HTMLDivElement {
    console.log('Creating marker element:', {
      applicationId: application.id,
      isSelected,
      timestamp: new Date().toISOString()
    });

    const el = document.createElement('div');
    el.className = 'marker';
    el.id = `marker-${application.id}`;
    el.style.width = isSelected ? '24px' : '16px';
    el.style.height = isSelected ? '24px' : '16px';
    el.style.borderRadius = '50%';
    el.style.backgroundColor = isSelected ? '#dc2626' : '#2563eb';
    el.style.border = '2px solid white';
    el.style.cursor = 'pointer';
    el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
    el.style.transition = 'all 0.2s ease-in-out';

    return el;
  }

  static createMarker(
    application: Application, 
    coordinates: [number, number], 
    isSelected: boolean,
    map: mapboxgl.Map
  ): mapboxgl.Marker {
    const el = this.createMarkerElement(application, isSelected);
    
    return new mapboxgl.Marker({
      element: el,
      anchor: 'center',
      clickTolerance: 3
    })
    .setLngLat(coordinates);
  }
}