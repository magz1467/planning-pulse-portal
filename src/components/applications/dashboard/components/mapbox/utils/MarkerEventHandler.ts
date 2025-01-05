import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';

export class MarkerEventHandler {
  static attachEvents(
    el: HTMLDivElement,
    map: mapboxgl.Map,
    application: Application,
    onMarkerClick: (id: number) => void
  ): void {
    const handleClick = (e: Event) => {
      try {
        // Prevent event from bubbling to map
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // Verify marker still exists
        if (!document.body.contains(el)) {
          console.error('❌ Marker element not in DOM during click:', {
            applicationId: application.id,
            markerId: el.id,
            timestamp: new Date().toISOString()
          });
          return;
        }
        
        console.log('🖱️ Marker clicked:', {
          applicationId: application.id,
          timestamp: new Date().toISOString(),
          elementExists: !!el
        });
        
        // Prevent map movement
        map.dragPan.disable();
        setTimeout(() => map.dragPan.enable(), 300);
        
        onMarkerClick(application.id);
      } catch (error) {
        console.error('❌ Error in marker click handler:', {
          error,
          applicationId: application.id,
          elementId: el.id,
          timestamp: new Date().toISOString()
        });
      }
    };

    // Add event listeners with capture to prevent map interaction
    el.addEventListener('click', handleClick, { capture: true });
    el.addEventListener('mousedown', (e) => e.stopPropagation(), { capture: true });
    el.addEventListener('touchstart', (e) => e.stopPropagation(), { capture: true });
  }
}