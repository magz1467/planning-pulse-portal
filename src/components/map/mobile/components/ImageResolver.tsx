import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface ImageResolverProps {
  imageUrl?: string;
  coordinates?: [number, number];
  className?: string;
}

export const ImageResolver: React.FC<ImageResolverProps> = ({
  imageUrl,
  coordinates,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const generateMapboxUrl = (coords: [number, number]) => {
    const [lat, lng] = coords;
    const token = import.meta.env.VITE_MAPBOX_TOKEN;
    if (!token) {
      console.warn('Mapbox token not found in environment variables');
      return null;
    }
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},17,45,60/800x600@2x?access_token=${token}&logo=false`;
  };

  const resolvedImageUrl = (() => {
    if (imageUrl) return imageUrl;
    if (coordinates && !imageError) return generateMapboxUrl(coordinates);
    return null;
  })();

  if (!resolvedImageUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <MapPin className="w-8 h-8 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={resolvedImageUrl}
      alt="Location"
      className={className}
      onError={() => setImageError(true)}
    />
  );
};