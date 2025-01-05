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

const LONDON_BOUNDS = {
  north: 51.7223,
  south: 51.2867,
  east: 0.3340,
  west: -0.5103
};

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

  const isValidLondonCoordinate = (lat: number, lng: number): boolean => {
    return (
      lat >= LONDON_BOUNDS.south &&
      lat <= LONDON_BOUNDS.north &&
      lng >= LONDON_BOUNDS.west &&
      lng <= LONDON_BOUNDS.east
    );
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Update markers and fit bounds when applications change
  useEffect(() => {
    if (!isMapReady || !markerManager.current || !map.current || !applications.length) return;

    console.log('Adding markers for applications:', applications.length);

    // Remove all existing markers before adding new ones
    markerManager.current.removeAllMarkers();

    const [centerLat, centerLng] = initialCenter;
    
    const validApplications = applications.filter(application => {
      if (!application.coordinates) return false;
      const [lat, lng] = application.coordinates;
      
      // Check if coordinates are valid and within London bounds
      const isValid = isValidLondonCoordinate(lat, lng);
      if (!isValid) {
        console.warn(`Application ${application.id} coordinates [${lat}, ${lng}] outside London bounds - skipping`);
        return false;
      }

      // Check if application is within 1km of search center
      const distance = calculateDistance(centerLat, centerLng, lat, lng);
      const isWithinRadius = distance <= 1; // 1km radius
      if (!isWithinRadius) {
        console.warn(`Application ${application.id} is ${distance.toFixed(2)}km from search center - skipping`);
        return false;
      }

      return true;
    });

    // Add new markers for valid applications
    validApplications.forEach(application => {
      if (application.coordinates) {
        const [lat, lng] = application.coordinates;
        console.log('Adding marker for application:', application.id, [lat, lng]);
        markerManager.current?.addMarker(application, application.id === selectedId);
      }
    });

    // Only fit bounds on initial load or when applications change significantly
    // Not when a marker is clicked
    if (!selectedId && validApplications.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      validApplications.forEach(app => {
        if (app.coordinates) {
          const [lat, lng] = app.coordinates;
          bounds.extend([lng, lat]);
        }
      });

      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: 100, right: 100 },
        maxZoom: 15,
        duration: 1000
      });
    }
  }, [applications, selectedId, isMapReady, initialCenter]);

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