import { useState, useEffect } from 'react';

interface ImageResolverProps {
  imageMapUrl: string | null;
  image: string | undefined;
  title: string;
  applicationId: number;
  coordinates?: [number, number];
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60";

export const ImageResolver = ({ 
  imageMapUrl, 
  image, 
  title,
  applicationId,
  coordinates 
}: ImageResolverProps) => {
  const [currentImageSource, setCurrentImageSource] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('ApplicationImage - Initial State:', {
      applicationId,
      image_map_url: imageMapUrl,
      image,
      currentImageSource
    });

    // Reset error state when props change
    setHasError(false);

    // Try to use the map image first
    if (imageMapUrl) {
      setCurrentImageSource(imageMapUrl);
    }
    // Then try the regular image
    else if (image && image !== '/placeholder.svg') {
      setCurrentImageSource(image);
    }
    // Finally use fallback
    else {
      console.log('ApplicationImage - Using fallback image:', FALLBACK_IMAGE);
      setCurrentImageSource(FALLBACK_IMAGE);
    }
  }, [imageMapUrl, image, applicationId]);

  const handleImageError = () => {
    console.log('ApplicationImage - Error loading image:', currentImageSource);
    setHasError(true);
    
    // If current source failed, try the next option
    if (currentImageSource === imageMapUrl && image) {
      setCurrentImageSource(image);
    } else if (currentImageSource !== FALLBACK_IMAGE) {
      setCurrentImageSource(FALLBACK_IMAGE);
    }
  };

  if (!currentImageSource || hasError) {
    return (
      <img
        src={FALLBACK_IMAGE}
        alt={title}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    );
  }

  return (
    <img
      src={currentImageSource}
      alt={title}
      className="w-full h-full object-cover"
      onError={handleImageError}
    />
  );
};