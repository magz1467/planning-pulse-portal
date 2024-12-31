import { useState } from "react";
import { FALLBACK_IMAGE } from "@/utils/imageUtils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const Image = ({ src, alt, className, width, height, loading = "lazy", ...props }: ImageProps) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Log any image loading failures to help with debugging
  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setError(true);
    setIsLoading(false);
  };

  // Ensure we have a valid src, otherwise use fallback
  const imageSrc = (!src || src.trim() === '' || src === 'undefined' || src === 'null' || !src.startsWith('/') && !src.startsWith('http')) 
    ? FALLBACK_IMAGE 
    : src;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
      <img
        src={error ? FALLBACK_IMAGE : imageSrc}
        alt={alt || ''}
        className={`${className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onError={handleError}
        onLoad={() => setIsLoading(false)}
        loading={loading}
        width={width}
        height={height}
        {...props}
      />
    </div>
  );
};

export default Image;