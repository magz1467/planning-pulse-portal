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
      timestamp: new Date().toISOString(),
      mapExists: !!map,
      hasClickHandler: !!onMarkerClick
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
    try {
      console.log('📊 Marker stats:', {
        count: Object.keys(this.markers).length,
        markerIds: Object.keys(this.markers),
        timestamp: new Date().toISOString()
      });
      
      Object.values(this.markers).forEach(({ marker }) => {
        try {
          marker.remove();
        } catch (error) {
          console.error('❌ Error removing individual marker:', {
            error,
            markerId: marker.getElement().id,
            timestamp: new Date().toISOString()
          });
        }
      });
      
      this.markers = {};
      console.log('✅ All markers successfully removed');
    } catch (error) {
      console.error('❌ Critical error during marker removal:', {
        error,
        markersCount: Object.keys(this.markers).length,
        timestamp: new Date().toISOString()
      });
    }
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
      console.group(`📍 Adding/updating marker for application ${application.id}`);
      const [lat, lng] = application.coordinates;
      console.log('📌 Marker position:', {
        lat,
        lng,
        isSelected,
        applicationExists: !!application
      });
      
      // If marker already exists, just update its style
      if (this.markers[application.id]) {
        this.updateMarkerStyle(application.id, isSelected);
        console.log('🔄 Updated existing marker style');
        console.groupEnd();
        return;
      }

      // Create marker element with circle styling
      const el = document.createElement('div');
      el.className = 'marker';
      el.id = `marker-${application.id}`; // Add ID for better debugging
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

      // Add click handler with error boundary
      el.addEventListener('click', (e) => {
        try {
          e.preventDefault();
          e.stopPropagation();
          
          console.log('🖱️ Marker clicked:', {
            applicationId: application.id,
            timestamp: new Date().toISOString(),
            elementExists: !!el,
            markerExists: !!this.markers[application.id]
          });
          
          this.onMarkerClick(application.id);
        } catch (error) {
          console.error('❌ Error in marker click handler:', {
            error,
            applicationId: application.id,
            elementId: el.id,
            timestamp: new Date().toISOString()
          });
        }
      });

      console.log('✅ Marker successfully added');
      console.groupEnd();

    } catch (error) {
      console.error('❌ Error adding marker:', {
        applicationId: application.id,
        error,
        coordinates: application.coordinates,
        timestamp: new Date().toISOString()
      });
      console.groupEnd();
    }
  }

  public updateMarkerStyle(applicationId: number, isSelected: boolean) {
    console.group(`🎨 Updating marker style for ${applicationId}`);
    try {
      const markerInfo = this.markers[applicationId];
      if (!markerInfo) {
        console.warn('⚠️ Attempted to update style for non-existent marker:', applicationId);
        console.groupEnd();
        return;
      }

      const el = markerInfo.marker.getElement();
      if (!el) {
        console.error('❌ Marker element not found:', {
          applicationId,
          markerId: `marker-${applicationId}`,
          timestamp: new Date().toISOString()
        });
        console.groupEnd();
        return;
      }

      el.style.width = isSelected ? '24px' : '16px';
      el.style.height = isSelected ? '24px' : '16px';
      el.style.backgroundColor = isSelected ? '#dc2626' : '#2563eb';
      
      console.log('✅ Marker style updated:', {
        applicationId,
        isSelected,
        elementExists: !!el
      });
    } catch (error) {
      console.error('❌ Error updating marker style:', {
        error,
        applicationId,
        timestamp: new Date().toISOString()
      });
    }
    console.groupEnd();
  }
}