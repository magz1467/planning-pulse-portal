import { useEffect, useState } from 'react';

interface ImageResolverProps {
  imageMapUrl?: string | null;
  image?: string | null;
  title: string;
  applicationId: number;
  coordinates?: [number, number];
}

export const ImageResolver = ({ 
  imageMapUrl,
  image,
  title,
  applicationId,
  coordinates 
}: ImageResolverProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const generateMapboxUrl = (coords: [number, number]) => {
    const [lat, lng] = coords;
    const mapboxToken = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;
    return `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/${lng},${lat},15,0/400x400@2x?access_token=${mapboxToken}`;
  };

  useEffect(() => {
    if (imageMapUrl) {
      setImageUrl(imageMapUrl);
    } else if (image) {
      setImageUrl(image);
    } else if (coordinates) {
      setImageUrl(generateMapboxUrl(coordinates));
    } else {
      setImageUrl('/placeholder.svg');
    }
  }, [imageMapUrl, image, coordinates]);

  if (!imageUrl) {
    return (
      <div className="w-full h-full bg-gray-100 animate-pulse" />
    );
  }

  return (
    <img
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover"
      onError={() => setImageUrl('/placeholder.svg')}
    />
  );
};