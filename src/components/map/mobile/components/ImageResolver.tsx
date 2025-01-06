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
  const resolvedImageUrl = (() => {
    if (imageUrl) return imageUrl;
    if (image) return image;
    return '/placeholder.svg';
  })();

  return (
    <ImageWithFallback
      src={resolvedImageUrl}
      alt={title}
      className="w-full h-full object-cover"
      fallback="/placeholder.svg"
    />
  );
};