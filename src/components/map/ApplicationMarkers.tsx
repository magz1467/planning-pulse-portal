import { Marker } from 'react-leaflet';
import { Application } from "@/types/planning";
import { LatLngTuple } from 'leaflet';
import { useMemo, useCallback, memo } from 'react';
import { useToast } from "@/hooks/use-toast";
import L from 'leaflet';

interface ApplicationMarkersProps {
  applications: Application[];
  baseCoordinates: LatLngTuple;
  onMarkerClick: (id: number) => void;
  selectedId: number | null;
}

const getStatusColor = (status: string): string => {
  const statusLower = status.toLowerCase();
  if (statusLower.includes('approved')) {
    return '#16a34a'; // green
  } else if (statusLower.includes('refused') || statusLower.includes('declined') || statusLower.includes('withdrawn')) {
    return '#ea384c'; // red
  } else {
    return '#F97316'; // orange for under consideration/pending
  }
};

const createIcon = (color: string, isSelected: boolean) => {
  const size = isSelected ? 40 : 24;
  
  const markerHtml = document.createElement('div');
  markerHtml.className = `marker-container ${isSelected ? 'selected' : ''}`;
  markerHtml.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    cursor: pointer;
    pointer-events: auto;
    z-index: ${isSelected ? 1000 : 1};
  `;
  
  markerHtml.innerHTML = `
    <svg 
      width="${size}" 
      height="${size}" 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style="pointer-events: none;"
    >
      <path 
        d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" 
        fill="${color}"
      />
    </svg>
  `;

  return L.divIcon({
    html: markerHtml,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size/2, size],
  });
};

const SingleMarker = memo(({ 
  app, 
  isSelected, 
  onClick 
}: { 
  app: Application; 
  isSelected: boolean; 
  onClick: () => void;
}) => {
  const { toast } = useToast();
  console.log(`Rendering marker for application ${app.id}, selected: ${isSelected}`);

  if (!app.coordinates) {
    console.warn('Application missing coordinates:', app.id);
    return null;
  }

  const color = getStatusColor(app.status);
  
  const handleClick = useCallback((e: L.LeafletMouseEvent) => {
    console.log('Marker clicked:', app.id);
    e.originalEvent.stopPropagation();
    try {
      onClick();
    } catch (error) {
      console.error('Error handling marker click:', error);
      toast({
        title: "Error",
        description: "Failed to select application. Please try again.",
        variant: "destructive",
      });
    }
  }, [onClick, toast, app.id]);

  return (
    <Marker
      position={app.coordinates}
      icon={createIcon(color, isSelected)}
      eventHandlers={{
        click: handleClick,
      }}
      zIndexOffset={isSelected ? 1000 : 0}
    />
  );
});

SingleMarker.displayName = 'SingleMarker';

export const ApplicationMarkers = memo(({
  applications,
  onMarkerClick,
  selectedId,
}: ApplicationMarkersProps) => {
  console.log('ApplicationMarkers rendering with:', {
    applicationsCount: applications?.length,
    selectedId
  });

  const handleMarkerClick = useCallback((id: number) => {
    console.log('Marker clicked:', id);
    onMarkerClick(id);
  }, [onMarkerClick]);

  const markers = useMemo(() => {
    console.log('Creating markers array, count:', applications.length);
    return applications.map((app) => (
      <SingleMarker
        key={`marker-${app.id}`}
        app={app}
        isSelected={app.id === selectedId}
        onClick={() => handleMarkerClick(app.id)}
      />
    ));
  }, [applications, selectedId, handleMarkerClick]);

  return <>{markers}</>;
});

ApplicationMarkers.displayName = 'ApplicationMarkers';