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
      if (!mapContainer.current) return;

      try {
        // Get Mapbox token from Supabase
        const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
        if (error) {
          console.error('Error getting Mapbox token:', error);
          setError('Failed to initialize map: Could not retrieve access token');
          return;
        }

        if (!token) {
          setError('Failed to initialize map: No access token available');
          return;
        }

        mapboxgl.accessToken = token;

        // Create the map instance with a simpler style URL
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12', // Using a simpler style URL
          center: [initialCenter[1], initialCenter[0]], // Mapbox uses [lng, lat]
          zoom: 14,
        });

        // Add navigation controls
        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

        // Wait for map to load before adding markers
        map.current.on('load', () => {
          // Clear existing markers
          Object.values(markers.current).forEach(marker => marker.remove());
          markers.current = {};

          // Add markers for each application
          applications.forEach(application => {
            if (!application.coordinates) return;
            
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
          });
        });

        // Add error handling for map load
        map.current.on('error', (e) => {
          console.error('Mapbox map error:', e);
          setError('Error loading map. Please try again later.');
        });

      } catch (err) {
        console.error('Error initializing map:', err);
        setError('Failed to initialize map: An unexpected error occurred');
      }
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
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