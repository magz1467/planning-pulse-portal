import mapboxgl from 'mapbox-gl';
import { Application } from '@/types/planning';
import { MarkerCreator } from './utils/MarkerCreator';
import { MarkerEventHandler } from './utils/MarkerEventHandler';
import { MarkerStyleManager } from './utils/MarkerStyleManager';

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
          const el = marker.getElement();
          if (document.body.contains(el)) {
            marker.remove();
            console.log('✅ Successfully removed marker:', {
              markerId: el.id,
              timestamp: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error('❌ Error removing marker:', {
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
      
      // If marker exists, just update its style
      if (this.markers[application.id]) {
        this.updateMarkerStyle(application.id, isSelected);
        console.log('🔄 Updated existing marker style');
        console.groupEnd();
        return;
      }

      const el = MarkerCreator.createMarkerElement(application, isSelected);
      const marker = MarkerCreator.createMarker(application, [lng, lat], isSelected, this.map)
        .addTo(this.map);

      this.markers[application.id] = { marker, application };

      MarkerEventHandler.attachEvents(el, this.map, application, this.onMarkerClick);

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
      if (!el || !document.body.contains(el)) {
        console.error('❌ Marker element not found or not in DOM:', {
          applicationId,
          markerId: `marker-${applicationId}`,
          timestamp: new Date().toISOString()
        });
        console.groupEnd();
        return;
      }

      MarkerStyleManager.updateMarkerStyle(el, isSelected);
      
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