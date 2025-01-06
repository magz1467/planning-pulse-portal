import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

export interface ImageResolverProps {
  imageUrl?: string;
  image?: string;
  title: string;
  applicationId: number;
  coordinates?: [number, number];
  className?: string;
}

export const ImageResolver: React.FC<ImageResolverProps> = ({
  imageUrl,
  image,
  coordinates,
  className = ''
}) => {
  const [imageError, setImageError] = useState(false);

  const resolvedImageUrl = (() => {
    if (imageUrl) return imageUrl;
    if (image) return image;
    return null;
  })();

  if (!resolvedImageUrl || imageError) {
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