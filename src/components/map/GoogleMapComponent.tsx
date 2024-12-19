import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import { Application } from '@/types/planning';
import { supabase } from '@/integrations/supabase/client';
import { LoadingOverlay } from './LoadingOverlay';
import { AlertCircle } from 'lucide-react';

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const libraries: ("places")[] = ["places"];

const defaultOptions = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: false,
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
  const [mapError, setMapError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [isKeyLoading, setIsKeyLoading] = useState(true);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Fetch the Google Maps API key first
  useEffect(() => {
    const fetchApiKey = async () => {
      setIsKeyLoading(true);
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-google-maps-key');
        
        if (error) {
          console.error('Error from Edge Function:', error);
          setMapError('Failed to fetch Google Maps API key from server');
          setIsKeyLoading(false);
          return;
        }

        if (!data?.apiKey) {
          console.error('No API key returned from server');
          setMapError('Google Maps API key not found in server configuration');
          setIsKeyLoading(false);
          return;
        }

        setApiKey(data.apiKey);
        setIsKeyLoading(false);
      } catch (error) {
        console.error('Error fetching API key:', error);
        setMapError('Failed to load Google Maps API key. Please check your configuration.');
        setIsKeyLoading(false);
      }
    };

    fetchApiKey();
  }, []);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || '',
    libraries,
  });

  const fetchRealMarkers = useCallback(async () => {
    if (!mapLoaded || !map) return;
    
    try {
      console.log('Fetching markers for postcode:', postcode);
      
      const { data, error } = await supabase.functions.invoke('fetch-map-markers', {
        body: { postcode, applications }
      });

      if (error) {
        console.error('Error fetching markers:', error);
        return;
      }

      console.log('Received marker data:', data);
      if (data && Array.isArray(data)) {
        setMarkers(data);
      }
    } catch (error) {
      console.error('Error fetching markers:', error);
    }
  }, [postcode, applications, mapLoaded, map]);

  useEffect(() => {
    fetchRealMarkers();
  }, [fetchRealMarkers]);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    console.log('Map loaded successfully');
    setMap(map);
    setMapLoaded(true);
  }, []);

  useEffect(() => {
    if (loadError) {
      console.error('Error loading maps:', loadError);
      setMapError('Failed to load Google Maps. Please check your API key configuration.');
    }
  }, [loadError]);

  if (isKeyLoading) {
    return <LoadingOverlay />;
  }

  if (!apiKey || mapError || loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-50">
        <div className="text-center p-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-600 max-w-md">
            {mapError || 'There was an error loading the map. Please try again later.'}
          </p>
        </div>
      </div>
    );
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
        options={defaultOptions}
      >
        {map && markers.map((marker, index) => (
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