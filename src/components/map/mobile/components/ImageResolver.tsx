import { useState } from 'react';
import { ImageWithFallback } from '@/components/ui/image-with-fallback';

interface ImageResolverProps {
  imageUrl?: string | null;
  image?: string | null;
  title: string;
  applicationId: number;
  coordinates?: [number, number] | null;
}

export const ImageResolver = ({
  imageUrl,
  image,
  title,
  applicationId,
}: ImageResolverProps) => {
  const [currentImageSource, setCurrentImageSource] = useState<string | null>(null);

  const resolvedImageUrl = (() => {
    if (imageUrl) return imageUrl;
    if (image) return image;
    return null;
  })();

  const handleImageError = () => {
    if (currentImageSource !== '/placeholder.svg') {
      setCurrentImageSource('/placeholder.svg');
    }
  };

  return (
    <ImageWithFallback
      src={resolvedImageUrl || '/placeholder.svg'}
      alt={title}
      className="w-full h-full object-cover"
      onError={handleImageError}
    />
  );
};