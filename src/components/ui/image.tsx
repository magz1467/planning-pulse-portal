import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const Image = ({ src, alt, className, width, height, loading = "lazy", ...props }: ImageProps) => {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackImage = "/lovable-uploads/6bb62e8c-63db-446c-8450-6c39332edb97.png";

  // Log any image loading failures to help with debugging
  const handleError = () => {
    console.warn(`Image failed to load: ${src}`);
    setError(true);
    setIsLoading(false);
  };

  // Ensure we have a valid src, otherwise use fallback
  const imageSrc = (!src || src.trim() === '' || src === 'undefined' || src === 'null') ? fallbackImage : src;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse rounded-lg" />
      )}
      <img
        src={error ? fallbackImage : imageSrc}
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