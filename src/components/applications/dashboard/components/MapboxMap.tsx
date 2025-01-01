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

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) {
        console.error('Map container ref is not available');
        return;
      }

      try {
        // Get Mapbox token from Supabase
        console.log('Fetching Mapbox token from Supabase...');
        const { data, error: tokenError } = await supabase.functions.invoke('get-mapbox-token');
        
        if (tokenError) {
          console.error('Error getting Mapbox token:', tokenError);
          setError(`Failed to initialize map: ${tokenError.message}`);
          return;
        }

        if (!data || !data.token) {
          console.error('No Mapbox token returned from function. Response:', data);
          setError('Failed to initialize map: No access token available');
          return;
        }

        console.log('Successfully retrieved Mapbox token');
        mapboxgl.accessToken = data.token;

        // Create map
        console.log('Initializing map with center:', [initialCenter[1], initialCenter[0]]);
        try {
          map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/streets-v12',
            center: [initialCenter[1], initialCenter[0]], // Mapbox uses [lng, lat]
            zoom: 14,
          });
        } catch (mapError) {
          console.error('Error creating Mapbox map:', mapError);
          setError(`Failed to create map: ${mapError instanceof Error ? mapError.message : 'Unknown error'}`);
          return;
        }

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Wait for map to load before adding markers
        map.current.on('load', () => {
          console.log('Map loaded successfully');
          console.log('Adding markers for', applications.length, 'applications');
          
          // Clear existing markers
          Object.values(markers.current).forEach(marker => marker.remove());
          markers.current = {};

          // Add markers for each application
          applications.forEach(application => {
            if (!application.coordinates) {
              console.warn(`Application ${application.id} has no coordinates`);
              return;
            }
            
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = '25px';
            el.style.height = '25px';
            el.style.borderRadius = '50%';
            el.style.backgroundColor = selectedId === application.id ? '#065F46' : '#10B981';
            el.style.border = '2px solid white';
            el.style.cursor = 'pointer';

            try {
              const marker = new mapboxgl.Marker(el)
                .setLngLat([application.coordinates[1], application.coordinates[0]])
                .addTo(map.current!);

              el.addEventListener('click', () => {
                onMarkerClick(application.id);
              });

              markers.current[application.id] = marker;
            } catch (markerError) {
              console.error(`Error adding marker for application ${application.id}:`, markerError);
            }
          });
        });

        // Add error handling for map load
        map.current.on('error', (e) => {
          console.error('Mapbox map error:', e);
          setError(`Error loading map: ${e.error?.message || 'Please try again later.'}`);
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        setError(`Failed to initialize map: ${err instanceof Error ? err.message : 'An unexpected error occurred'}`);
      }
    };

    initializeMap();

    return () => {
      console.log('Cleaning up map...');
      // Cleanup function
      if (markers.current) {
        // Remove all markers first
        Object.values(markers.current).forEach(marker => {
          if (marker) marker.remove();
        });
        markers.current = {};
      }
      
      // Then remove the map
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

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};