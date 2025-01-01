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
  const [hasInitiallyLoaded, setHasInitiallyLoaded] = useState(false);
  const previousApplicationsRef = useRef<Application[]>([]);

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) {
        const msg = 'Map container ref is not available';
        console.error(msg);
        setError(msg);
        return;
      }

      const newMap = await MapboxInitializer.initialize(
        mapContainer.current,
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
          
          if (applications !== previousApplicationsRef.current) {
            markerManager.current?.removeAllMarkers();
            applications.forEach(application => {
              markerManager.current?.addMarker(application, application.id === selectedId);
            });
            previousApplicationsRef.current = applications;

            if (!hasInitiallyLoaded && applications.length > 0) {
              const bounds = new mapboxgl.LngLatBounds();
              applications.forEach(application => {
                if (application.coordinates) {
                  bounds.extend([application.coordinates[1], application.coordinates[0]]);
                }
              });
              
              newMap.fitBounds(bounds, {
                padding: { top: 50, bottom: 50, left: 50, right: 50 },
                maxZoom: 15
              });
              setHasInitiallyLoaded(true);
            }
          }
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
        try {
          map.current.remove();
        } catch (err) {
          console.warn('Error removing map:', err);
        }
        map.current = null;
      }
    };
  }, [initialCenter, applications, selectedId, onMarkerClick, hasInitiallyLoaded]);

  useEffect(() => {
    if (markerManager.current) {
      Object.keys(markerManager.current.getMarkers()).forEach(id => {
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