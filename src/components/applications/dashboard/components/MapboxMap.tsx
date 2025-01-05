import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Application } from '@/types/planning';
import { LatLngTuple } from 'leaflet';
import { MapboxMarkerManager } from './mapbox/MapboxMarkerManager';
import { MapboxInitializer } from './mapbox/MapboxInitializer';
import { MapboxErrorDisplay } from './mapbox/MapboxErrorDisplay';
import { MAP_DEFAULTS } from '@/utils/mapConstants';

interface MapboxMapProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
}

export const MapboxMap = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter,
}: MapboxMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markerManager = useRef<MapboxMarkerManager | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const initializedRef = useRef(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const hasSetInitialBounds = useRef(false);

  // Initialize map only once
  useEffect(() => {
    if (initializedRef.current || !mapContainer.current) return;

    console.log('Initializing map with center:', initialCenter);

    const initializeMap = async () => {
      try {
        const newMap = await MapboxInitializer.initialize(
          mapContainer.current!,
          initialCenter,
          (error, debug) => {
            console.error('Map initialization error:', error, debug);
            setError(error);
            setDebugInfo(debug);
          }
        );

        if (newMap) {
          map.current = newMap;
          markerManager.current = new MapboxMarkerManager(newMap, onMarkerClick);
          
          // Set initial view
          const [lat, lng] = initialCenter;
          console.log(`Setting initial center to [${lat}, ${lng}]`);
          newMap.setCenter([lng, lat]);
          newMap.setZoom(MAP_DEFAULTS.initialZoom);

          newMap.once('style.load', () => {
            console.log('Map style loaded successfully');
            setIsMapReady(true);
            initializedRef.current = true;
          });
        }
      } catch (err) {
        console.error('Map initialization failed:', err);
        setError('Failed to initialize map');
      }
    };

    initializeMap();

    return () => {
      if (markerManager.current) {
        markerManager.current.removeAllMarkers();
        markerManager.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      initializedRef.current = false;
      setIsMapReady(false);
    };
  }, [initialCenter, onMarkerClick]);

  // Handle applications updates
  useEffect(() => {
    if (!isMapReady || !markerManager.current || !map.current || !applications.length) {
      console.log('Skipping marker update - conditions not met:', {
        isMapReady,
        hasMarkerManager: !!markerManager.current,
        hasMap: !!map.current,
        applicationsLength: applications.length
      });
      return;
    }

    console.log(`Processing ${applications.length} applications`);

    // Filter out applications without coordinates
    const validApplications = applications.filter(application => {
      if (!application.coordinates) {
        console.warn(`Application ${application.id} has no coordinates - skipping`);
        return false;
      }
      return true;
    });

    // Clear existing markers before adding new ones
    markerManager.current.removeAllMarkers();

    // Add markers for valid applications
    validApplications.forEach(application => {
      if (application.coordinates) {
        markerManager.current?.addMarker(application, application.id === selectedId);
      }
    });

    // Set bounds only on initial load
    if (!hasSetInitialBounds.current && validApplications.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validApplications.forEach(app => {
        if (app.coordinates) {
          const [lat, lng] = app.coordinates;
          bounds.extend([lng, lat]);
        }
      });

      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        maxZoom: MAP_DEFAULTS.maxZoom,
        duration: 1000
      });
      
      hasSetInitialBounds.current = true;
      console.log('Initial bounds set');
    }
  }, [applications, isMapReady, selectedId]);

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="absolute inset-0 bg-gray-100"
        style={{ 
          width: '100%',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}
      />
      <MapboxErrorDisplay error={error} debugInfo={debugInfo} />
    </div>
  );
};
