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
      try {
        console.log('Initializing map...', {
          containerExists: !!mapContainer.current,
          dimensions: mapContainer.current ? {
            width: mapContainer.current.offsetWidth,
            height: mapContainer.current.offsetHeight
          } : null
        });
        
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
          
          newMap.on('load', () => {
            console.log('Map loaded successfully');
            
            // Add markers
            applications.forEach(application => {
              markerManager.current?.addMarker(application, application.id === selectedId);
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
                newMap.fitBounds(bounds, {
                  padding: { top: 50, bottom: 50, left: 50, right: 50 },
                  maxZoom: 15
                });
                initialBoundsFitRef.current = true;
              }
            }

            initializedRef.current = true;
          });

          // Add error handler
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
      console.log('Cleaning up map...');
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
  }, [initialCenter]); // Only depend on initialCenter

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