import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Application } from '@/types/planning';
import { LatLngTuple } from 'leaflet';
import { MapboxMarkerManager } from './mapbox/MapboxMarkerManager';
import { MapboxInitializer } from './mapbox/MapboxInitializer';
import { MapboxErrorDisplay } from './mapbox/MapboxErrorDisplay';

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

  // Initialize map only once
  useEffect(() => {
    if (initializedRef.current || !mapContainer.current) return;

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
          console.log('Setting map center to:', [lng, lat]);
          newMap.setCenter([lng, lat]);
          newMap.setZoom(12);

          newMap.once('style.load', () => {
            console.log('Map style loaded successfully');
            setIsMapReady(true);
            initializedRef.current = true;
          });

          newMap.on('error', (e) => {
            console.error('Mapbox error:', e);
            setError('Failed to load map resources');
          });
        }
      } catch (err) {
        console.error('Map initialization failed:', err);
        setError('Failed to initialize map');
      }
    };

    initializeMap();

    // Cleanup function
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

  // Update markers and fit bounds when applications change
  useEffect(() => {
    if (!isMapReady || !markerManager.current || !map.current || !applications.length) return;

    console.log('Adding markers for applications:', applications.length);

    // Remove all existing markers
    markerManager.current.removeAllMarkers();

    // Add new markers
    applications.forEach(application => {
      if (application.coordinates) {
        const [lat, lng] = application.coordinates;
        // Validate coordinates are within London area (roughly)
        const isValidLondonCoordinate = (
          lat >= 51.2 && // South boundary
          lat <= 51.8 && // North boundary
          lng >= -0.5 && // West boundary
          lng <= 0.3     // East boundary
        );

        if (isValidLondonCoordinate) {
          console.log('Adding marker for application:', application.id, [lat, lng]);
          markerManager.current?.addMarker(application, application.id === selectedId);
        } else {
          console.warn('Invalid coordinates for application:', application.id, [lat, lng]);
        }
      }
    });

    // Only fit bounds on initial load or when applications change significantly
    // Not when a marker is clicked
    if (!selectedId) {
      const bounds = new mapboxgl.LngLatBounds();
      let hasValidCoordinates = false;

      applications.forEach(app => {
        if (app.coordinates) {
          const [lat, lng] = app.coordinates;
          // Only include coordinates within London area
          const isValidLondonCoordinate = (
            lat >= 51.2 &&
            lat <= 51.8 &&
            lng >= -0.5 &&
            lng <= 0.3
          );

          if (isValidLondonCoordinate) {
            bounds.extend([lng, lat]);
            hasValidCoordinates = true;
          }
        }
      });

      if (hasValidCoordinates && map.current) {
        map.current.fitBounds(bounds, {
          padding: { top: 100, bottom: 100, left: 100, right: 100 },
          maxZoom: 15,
          duration: 1000
        });
      }
    }
  }, [applications, selectedId, isMapReady]);

  // Update marker styles when selection changes
  useEffect(() => {
    if (!isMapReady || !markerManager.current) return;
    
    const markers = markerManager.current.getMarkers();
    Object.keys(markers).forEach(id => {
      markerManager.current?.updateMarkerStyle(Number(id), Number(id) === selectedId);
    });
  }, [selectedId, isMapReady]);

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