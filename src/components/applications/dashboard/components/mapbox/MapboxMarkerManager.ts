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
    console.group('🎯 Initializing MapboxMarkerManager');
    console.log('📍 Constructor called:', {
      timestamp: new Date().toISOString()
    });
    this.map = map;
    this.onMarkerClick = onMarkerClick;
    console.groupEnd();
  }

  public getMarkers() {
    return this.markers;
  }

  public removeAllMarkers() {
    console.group('🧹 Removing markers');
    console.log('📊 Marker stats:', {
      count: Object.keys(this.markers).length,
      markerIds: Object.keys(this.markers),
      timestamp: new Date().toISOString()
    });
    Object.values(this.markers).forEach(({ marker }) => {
      marker.remove();
    });
    this.markers = {};
    console.groupEnd();
  }

  public addMarker(application: Application, isSelected: boolean) {
    if (!application.coordinates) {
      console.warn('⚠️ Cannot add marker - missing coordinates:', {
        applicationId: application.id,
        timestamp: new Date().toISOString()
      });
      return;
    }

    try {
      console.group(`📍 Adding marker for application ${application.id}`);
      const [lat, lng] = application.coordinates;
      console.log('📌 Marker position:', {
        lat,
        lng,
        isSelected
      });
      
      if (this.markers[application.id]) {
        console.log('🔄 Removing existing marker before update');
        this.markers[application.id].marker.remove();
      }

      // Create marker element
      const el = this.createMarkerElement(isSelected);

      // Create and add marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
        draggable: false
      })
        .setLngLat([lng, lat])
        .addTo(this.map);

      this.markers[application.id] = { marker, application };

      // Add click handler with proper event handling
      el.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent default marker click behavior
        e.stopPropagation(); // Stop event from bubbling to map
        
        // Prevent map movement
        if (e && e.originalEvent) {
          e.originalEvent.stopPropagation();
        }
        
        console.log('🖱️ Marker clicked:', {
          applicationId: application.id,
          timestamp: new Date().toISOString()
        });
        
        // Call the click handler
        this.onMarkerClick(application.id);
      });

      console.log('✅ Marker successfully added');
      console.groupEnd();

    } catch (error) {
      console.error('❌ Error adding marker:', {
        applicationId: application.id,
        error,
        timestamp: new Date().toISOString()
      });
    }
  }

  public updateMarkerStyle(applicationId: number, isSelected: boolean) {
    console.group(`🎨 Updating marker style for ${applicationId}`);
    const markerInfo = this.markers[applicationId];
    if (!markerInfo) {
      console.warn('⚠️ Attempted to update style for non-existent marker:', applicationId);
      console.groupEnd();
      return;
    }

    const el = markerInfo.marker.getElement();
    this.updateMarkerElement(el, isSelected);
    console.log('✅ Marker style updated:', {
      applicationId,
      isSelected
    });
    console.groupEnd();
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