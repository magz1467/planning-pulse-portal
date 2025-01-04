import { useEffect, useRef, useState } from 'react';
import { Application } from '@/types/planning';
import { LatLngTuple } from 'leaflet';
import { useMapboxInitialization } from '@/hooks/use-mapbox-initialization';
import { MapboxMarkerManager } from './MapboxMarkerManager';
import { MapboxErrorDisplay } from './MapboxErrorDisplay';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapboxContainerProps {
  applications: Application[];
  selectedId: number | null;
  onMarkerClick: (id: number) => void;
  initialCenter: LatLngTuple;
}

export const MapboxContainer = ({
  applications,
  selectedId,
  onMarkerClick,
  initialCenter,
}: MapboxContainerProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const prevApplicationsRef = useRef(applications);
  const initialBoundsFitRef = useRef(false);

  const handleMapLoaded = (map: mapboxgl.Map, markerManager: MapboxMarkerManager) => {
    console.log('Map loaded, adding markers...');
    // Add markers
    applications.forEach(application => {
      markerManager.addMarker(application, application.id === selectedId);
    });

    // Only fit bounds on initial load if we have applications
    if (!initialBoundsFitRef.current && applications.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      let hasValidCoordinates = false;

      applications.forEach(application => {
        if (application.coordinates) {
          bounds.extend([application.coordinates[1], application.coordinates[0]]);
          hasValidCoordinates = true;
        }
      });

      if (hasValidCoordinates) {
        map.fitBounds(bounds, {
          padding: { top: 50, bottom: 50, left: 50, right: 50 },
          maxZoom: 15
        });
        initialBoundsFitRef.current = true;
      }
    }
  };

  const { isLoading, map, markerManager } = useMapboxInitialization({
    container: mapContainer.current,
    initialCenter,
    onError: (error, debug) => {
      console.error('Map initialization error:', error, debug);
      setError(error);
      setDebugInfo(debug);
    },
    onMapLoaded: handleMapLoaded
  });

  // Update markers when applications array changes
  useEffect(() => {
    if (!markerManager || !map) return;

    const addedApplications = applications.filter(
      app => !prevApplicationsRef.current.find(prevApp => prevApp.id === app.id)
    );
    const removedApplications = prevApplicationsRef.current.filter(
      prevApp => !applications.find(app => app.id === prevApp.id)
    );

    // Add new markers
    addedApplications.forEach(application => {
      markerManager.addMarker(application, application.id === selectedId);
    });

    // Remove old markers
    removedApplications.forEach(application => {
      markerManager.removeMarker(application.id);
    });

    prevApplicationsRef.current = applications;
  }, [applications, selectedId, map, markerManager]);

  // Only update marker styles when selection changes
  useEffect(() => {
    if (markerManager) {
      const markers = markerManager.getMarkers();
      Object.keys(markers).forEach(id => {
        markerManager.updateMarkerStyle(Number(id), Number(id) === selectedId);
      });
    }
  }, [selectedId, markerManager]);

  if (isLoading) {
    return <div className="w-full h-full flex items-center justify-center">Loading map...</div>;
  }

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