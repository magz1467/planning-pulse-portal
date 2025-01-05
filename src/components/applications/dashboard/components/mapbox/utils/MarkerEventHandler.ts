import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

export class MarkerEventHandler {
  static attachEvents(
    el: HTMLElement,
    map: mapboxgl.Map,
    application: Application,
    onMarkerClick: (id: number) => void
  ) {
    if (!el) {
      console.error('❌ Cannot attach events - element is null');
      return;
    }

    el.addEventListener('click', (e) => {
      // Prevent event from bubbling up to map
      e.preventDefault();
      e.stopPropagation();
      
      console.log('🖱️ Marker clicked:', {
        applicationId: application.id,
        timestamp: new Date().toISOString()
      });
      
      // Temporarily disable map movement
      const currentZoom = map.getZoom();
      map.setZoom(currentZoom);
      
      // Call the click handler
      onMarkerClick(application.id);
    });

    // Add hover effect
    el.addEventListener('mouseenter', () => {
      el.style.cursor = 'pointer';
      el.style.transform = 'scale(1.1)';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
    });
  }
}