import { Application } from '@/types/planning';
import { LatLngTuple } from 'leaflet';
import { useMapboxInitialization } from '@/hooks/use-mapbox-initialization';
import { MapboxMarkerManager } from './MapboxMarkerManager';
import { MapboxErrorDisplay } from './MapboxErrorDisplay';
import { MapSkeleton } from './MapSkeleton';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useCallback, useEffect, useMemo, useRef } from 'react';

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
  const markersRef = useRef<{ [key: number]: mapboxgl.Marker }>({});

  // Memoize the error handler to prevent unnecessary re-renders
  const handleError = useCallback((error: string, debug: string) => {
    console.error('Map Error:', { error, debug });
  }, []);

  // Memoize the map loaded handler
  const handleMapLoaded = useCallback((map: mapboxgl.Map, markerManager: MapboxMarkerManager) => {
    console.log('Map loaded, adding markers for', applications.length, 'applications');
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => marker.remove());
    markersRef.current = {};

    // Add new markers
    applications.forEach(application => {
      if (application.coordinates) {
        markerManager.addMarker(application, application.id === selectedId);
      }
    });
  }, [applications, selectedId]);

  const { isLoading, error, debugInfo, map, markerManager } = useMapboxInitialization({
    container: mapContainer.current,
    initialCenter,
    onError: handleError,
    onMapLoaded: handleMapLoaded
  });

  // Update marker styles when selection changes
  useEffect(() => {
    if (markerManager) {
      const markers = markerManager.getMarkers();
      Object.keys(markers).forEach(id => {
        markerManager.updateMarkerStyle(Number(id), Number(id) === selectedId);
      });
    }
  }, [selectedId, markerManager]);

  // Memoize the click handler
  const handleMarkerClick = useCallback((id: number) => {
    onMarkerClick(id);
  }, [onMarkerClick]);

  if (isLoading) {
    return <MapSkeleton />;
  }

  return (
    <div className="w-full h-full relative">
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ width: '100%', height: '100%' }}
      />
      <MapboxErrorDisplay error={error} debugInfo={debugInfo} />
    </div>
  );
};