import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Application } from '@/types/planning';
import { LatLngTuple } from 'leaflet';
import { MapboxMarkerManager } from './mapbox/MapboxMarkerManager';

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

      try {
        const token = process.env.REACT_APP_MAPBOX_TOKEN || '';
        if (!token) {
          setError('Mapbox token not found');
          setDebugInfo('Please check environment variables');
          return;
        }

        mapboxgl.accessToken = token;

        const newMap = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [initialCenter[1], initialCenter[0]],
          zoom: 14
        });

        newMap.addControl(new mapboxgl.NavigationControl(), 'top-right');

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
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError('Failed to initialize map');
        setDebugInfo(errorMsg);
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
      {error && (
        <div className="absolute inset-0 bg-red-50 p-4">
          <h3 className="text-red-800 font-bold">Map Error</h3>
          <p className="text-red-600">{error}</p>
          {debugInfo && (
            <pre className="mt-2 text-sm text-red-500 whitespace-pre-wrap">
              {debugInfo}
            </pre>
          )}
        </div>
      )}
    </div>
  );
};