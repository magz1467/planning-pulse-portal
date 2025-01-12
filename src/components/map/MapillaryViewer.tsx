import { useEffect, useRef } from 'react';
import { Viewer } from 'mapillary-js';
import 'mapillary-js/dist/mapillary.css';

interface MapillaryViewerProps {
  imageId?: string;
  lat: number;
  lng: number;
}

export const MapillaryViewer = ({ imageId, lat, lng }: MapillaryViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Viewer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const initViewer = async () => {
      // Initialize viewer
      const viewer = new Viewer({
        accessToken: 'YOUR_MAPILLARY_ACCESS_TOKEN',
        container: containerRef.current!,
        imageId: imageId,
      });

      viewerRef.current = viewer;

      // If no specific image ID, look for nearest image
      if (!imageId) {
        try {
          const response = await fetch(
            `https://graph.mapillary.com/images?access_token=YOUR_MAPILLARY_ACCESS_TOKEN&fields=id&limit=1&closeto=${lng},${lat}`
          );
          const data = await response.json();
          
          if (data.data?.[0]?.id) {
            viewer.moveTo(data.data[0].id);
          }
        } catch (error) {
          console.error('Error finding nearest image:', error);
        }
      }
    };

    initViewer();

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove();
      }
    };
  }, [imageId, lat, lng]);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-[400px] rounded-lg overflow-hidden"
    />
  );
};