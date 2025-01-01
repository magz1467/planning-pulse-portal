import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Application } from '@/types/planning';
import { supabase } from "@/integrations/supabase/client";
import { LatLngTuple } from 'leaflet';

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
  const markers = useRef<{ [key: number]: mapboxgl.Marker }>({});
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) {
        const msg = 'Map container ref is not available';
        console.error(msg);
        setError(msg);
        return;
      }

      try {
        // Get Mapbox token from Supabase
        console.log('Fetching Mapbox token from Supabase...');
        setDebugInfo('Fetching token...');
        
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError) {
          const msg = `Error getting Mapbox token: ${tokenError.message}`;
          console.error(msg);
          setError(msg);
          setDebugInfo(msg);
          return;
        }

        if (!data || !data.token) {
          const msg = `No Mapbox token returned from function. Response: ${JSON.stringify(data)}`;
          console.error(msg);
          setError('Failed to initialize map: No access token available');
          setDebugInfo(msg);
          return;
        }

        console.log('Successfully retrieved Mapbox token');
        setDebugInfo('Token retrieved, initializing map...');
        mapboxgl.accessToken = data.token;

        // Create map with detailed error handling
        console.log('Initializing map with center:', [initialCenter[1], initialCenter[0]]);
        try {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [initialCenter[1], initialCenter[0]], // Mapbox uses [lng, lat]
            zoom: 14,
          });

          // Add error handling for map load errors
          map.current.on('error', (e) => {
            const msg = `Mapbox map error: ${e.error?.message || 'Unknown error'}`;
            console.error(msg, e);
            setError(msg);
            setDebugInfo(JSON.stringify(e, null, 2));
          });

          // Add error handling for style load errors
          map.current.on('styledata', (e) => {
            if (map.current?.isStyleLoaded()) {
              console.log('Map style loaded successfully');
              setDebugInfo('Map style loaded, adding markers...');
            }
          });

        } catch (mapError) {
          const msg = `Error creating Mapbox map: ${mapError instanceof Error ? mapError.message : 'Unknown error'}`;
          console.error(msg);
          setError(msg);
          setDebugInfo(JSON.stringify(mapError, null, 2));
          return;
        }

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Wait for map to load before adding markers
        map.current.on('load', () => {
          console.log('Map loaded successfully');
          console.log('Adding markers for', applications.length, 'applications');
          setDebugInfo(`Map loaded, adding ${applications.length} markers...`);
          
          // Clear existing markers
          Object.values(markers.current).forEach(marker => marker.remove());
          markers.current = {};

          // Add markers for each application with error handling
          applications.forEach(application => {
            if (!application.coordinates) {
              console.warn(`Application ${application.id} has no coordinates`);
              return;
            }
            
            try {
              const el = document.createElement('div');
              el.className = 'marker';
              el.style.width = '25px';
              el.style.height = '25px';
              el.style.borderRadius = '50%';
              el.style.backgroundColor = selectedId === application.id ? '#065F46' : '#10B981';
              el.style.border = '2px solid white';
              el.style.cursor = 'pointer';

              const marker = new mapboxgl.Marker(el)
                .setLngLat([application.coordinates[1], application.coordinates[0]])
                .addTo(map.current!);

              el.addEventListener('click', () => {
                onMarkerClick(application.id);
              });

              markers.current[application.id] = marker;
            } catch (markerError) {
              console.error(`Error adding marker for application ${application.id}:`, markerError);
              setDebugInfo(`Error adding marker: ${markerError}`);
            }
          });
          
          setDebugInfo('All markers added successfully');
        });

      } catch (err) {
        const msg = `Error initializing map: ${err instanceof Error ? err.message : 'An unexpected error occurred'}`;
        console.error(msg);
        setError(msg);
        setDebugInfo(JSON.stringify(err, null, 2));
      }
    };

    initializeMap();

    return () => {
      console.log('Cleaning up map...');
      // Cleanup function
      if (markers.current) {
        Object.values(markers.current).forEach(marker => {
          if (marker) marker.remove();
        });
        markers.current = {};
      }
      
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [initialCenter, applications]);

  // Update markers when selection changes
  useEffect(() => {
    Object.entries(markers.current).forEach(([id, marker]) => {
      const el = marker.getElement();
      el.style.backgroundColor = Number(id) === selectedId ? '#065F46' : '#10B981';
    });
  }, [selectedId]);

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/90 z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
            <h3 className="text-red-500 font-semibold mb-2">Map Error</h3>
            <p className="text-gray-600 mb-2">{error}</p>
            <details className="text-xs text-gray-500">
              <summary>Debug Information</summary>
              <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                {debugInfo}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};