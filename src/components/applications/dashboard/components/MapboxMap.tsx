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
  const prevApplicationsRef = useRef(applications);
  const initializedRef = useRef(false);
  const initialBoundsFitRef = useRef(false);

  // Initialize map only once
  useEffect(() => {
    if (initializedRef.current || !mapContainer.current) return;

    const initializeMap = async () => {
      console.log('Initializing map...');
      
      const newMap = await MapboxInitializer.initialize(
        mapContainer.current!,
        initialCenter,
        (error, debug) => {
          setError(error);
          setDebugInfo(debug);
        }
      );

      if (newMap) {
        map.current = newMap;
        markerManager.current = new MapboxMarkerManager(newMap, onMarkerClick);
        
        newMap.on('load', () => {
          console.log('Map loaded successfully');
          
          // Add markers
          applications.forEach(application => {
            markerManager.current?.addMarker(application, application.id === selectedId);
          });

          initializedRef.current = true;
        });
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
      initialBoundsFitRef.current = false;
    };
  }, [initialCenter, onMarkerClick]);

  // Fit bounds only on initial load with applications
  useEffect(() => {
    if (!map.current || initialBoundsFitRef.current || applications.length === 0) return;

    const bounds = new mapboxgl.LngLatBounds();
    let hasValidCoordinates = false;

    applications.forEach(application => {
      if (application.coordinates) {
        bounds.extend([application.coordinates[1], application.coordinates[0]]);
        hasValidCoordinates = true;
      }
    });

    if (hasValidCoordinates) {
      map.current.fitBounds(bounds, {
        padding: { top: 50, bottom: 50, left: 50, right: 50 },
        maxZoom: 15
      });
      initialBoundsFitRef.current = true;
    }
  }, [applications, map.current]);

  // Update markers when applications array changes
  useEffect(() => {
    if (!markerManager.current || !map.current) return;

    const addedApplications = applications.filter(
      app => !prevApplicationsRef.current.find(prevApp => prevApp.id === app.id)
    );
    const removedApplications = prevApplicationsRef.current.filter(
      prevApp => !applications.find(app => app.id === prevApp.id)
    );

    // Add new markers
    addedApplications.forEach(application => {
      markerManager.current?.addMarker(application, application.id === selectedId);
    });

    // Remove old markers
    removedApplications.forEach(application => {
      markerManager.current?.removeMarker(application.id);
    });

    prevApplicationsRef.current = applications;
  }, [applications, selectedId]);

  // Only update marker styles when selection changes
  useEffect(() => {
    if (markerManager.current) {
      const markers = markerManager.current.getMarkers();
      Object.keys(markers).forEach(id => {
        markerManager.current?.updateMarkerStyle(Number(id), Number(id) === selectedId);
      });
    }
  }, [selectedId]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
      <MapboxErrorDisplay error={error} debugInfo={debugInfo} />
    </div>
  );
};