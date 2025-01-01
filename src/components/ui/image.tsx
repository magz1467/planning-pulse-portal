import NextImage, { ImageProps as NextImageProps } from 'next/image';
import { useState } from 'react';

interface ImageProps extends Omit<NextImageProps, 'src'> {
  src: string;
}

const Image = ({ src, alt, ...props }: ImageProps) => {
  const [error, setError] = useState(false);
  
  // If the image is a local asset (starts with /) use it directly
  const imageSrc = src.startsWith('/') ? src : src;

  return (
    <NextImage
      {...props}
      src={error ? '/placeholder.svg' : imageSrc}
      alt={alt}
      onError={() => setError(true)}
      unoptimized={src.startsWith('/')} // Don't optimize local assets
    />
  );
};

export default Image;