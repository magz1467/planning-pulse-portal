import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Application } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
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

  useEffect(() => {
    const initializeMap = async () => {
      if (!mapContainer.current) return;

      // Get Mapbox token from Supabase
      const { data: { token }, error } = await supabase.functions.invoke('get-mapbox-token');
      if (error) {
        console.error('Error getting Mapbox token:', error);
        return;
      }

      mapboxgl.accessToken = token;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [initialCenter[1], initialCenter[0]], // Mapbox uses [lng, lat]
        zoom: 14,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Wait for map to load before adding markers
      map.current.on('load', () => {
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
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [initialCenter]);

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
    </div>
  );
};