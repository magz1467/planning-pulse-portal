import { useState } from 'react';
import { MapPin } from 'lucide-react';

interface ImageResolverProps {
  imageUrl?: string | null;
  image?: string | null;
  title: string;
  applicationId: number;
  coordinates?: [number, number] | null;
  className?: string;
}

export const ImageResolver = ({
  imageUrl,
  image,
  className = '',
}: ImageResolverProps) => {
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
      className={`object-cover ${className}`}
      onError={() => setImageError(true)}
    />
  );
};