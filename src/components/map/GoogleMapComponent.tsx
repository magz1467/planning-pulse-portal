import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { Application } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
import { LoadingOverlay } from './LoadingOverlay';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

interface GoogleMapComponentProps {
  coordinates: [number, number];
  applications: Application[];
  selectedApplication: number | null;
  onMarkerClick: (id: number) => void;
  postcode: string;
}

export const GoogleMapComponent = ({
  coordinates,
  applications,
  selectedApplication,
  onMarkerClick,
  postcode
}: GoogleMapComponentProps) => {
  const [markers, setMarkers] = useState<Array<{ lat: number; lng: number; id: number }>>([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const fetchRealMarkers = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-map-markers', {
        body: { postcode, applications }
      });

      if (error) {
        console.error('Error fetching markers:', error);
        return;
      }

      if (data && Array.isArray(data)) {
        setMarkers(data);
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  }, [postcode, applications]);

  useEffect(() => {
    if (mapLoaded) {
      fetchRealMarkers();
    }
  }, [fetchRealMarkers, mapLoaded]);

  const onMapLoad = useCallback(() => {
    setMapLoaded(true);
  }, []);

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <LoadingOverlay />;
  }

  return (
    <div className="w-full h-full relative">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={13}
        center={{ lat: coordinates[0], lng: coordinates[1] }}
        onLoad={onMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {markers.map((marker, index) => (
          <MarkerF
            key={`${marker.id}-${index}`}
            position={{ lat: marker.lat, lng: marker.lng }}
            onClick={() => onMarkerClick(marker.id)}
            icon={{
              url: marker.id === selectedApplication 
                ? '/marker-selected.svg' 
                : '/marker.svg',
              scaledSize: new window.google.maps.Size(
                marker.id === selectedApplication ? 40 : 30,
                marker.id === selectedApplication ? 40 : 30
              ),
            }}
          />
        ))}
      </GoogleMap>
    </div>
  );
};