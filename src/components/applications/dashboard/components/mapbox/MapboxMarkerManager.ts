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
      
      // If marker already exists, just update its style
      if (this.markers[application.id]) {
        this.updateMarkerStyle(application.id, isSelected);
        console.log('🔄 Updated existing marker');
        console.groupEnd();
        return;
      }

      // Create marker element with circle styling
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.width = isSelected ? '24px' : '16px';
      el.style.height = isSelected ? '24px' : '16px';
      el.style.borderRadius = '50%';
      el.style.backgroundColor = isSelected ? '#dc2626' : '#2563eb';
      el.style.border = '2px solid white';
      el.style.cursor = 'pointer';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
      el.style.transition = 'all 0.2s ease-in-out';

      // Create and add marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'center',
      })
        .setLngLat([lng, lat])
        .addTo(this.map);

      this.markers[application.id] = { marker, application };

      // Add click handler
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        console.log('🖱️ Marker clicked:', {
          applicationId: application.id,
          timestamp: new Date().toISOString()
        });
        
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
    el.style.width = isSelected ? '24px' : '16px';
    el.style.height = isSelected ? '24px' : '16px';
    el.style.backgroundColor = isSelected ? '#dc2626' : '#2563eb';
    
    console.log('✅ Marker style updated:', {
      applicationId,
      isSelected
    });
    console.groupEnd();
  }
}