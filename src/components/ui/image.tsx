import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const Image = ({ src, alt, className, width, height, loading = "lazy", onError, ...props }: ImageProps) => {
  const [error, setError] = useState(false);
  
  const fallbackImage = "/placeholder.svg";
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image load error:', src);
    setError(true);
    if (onError) {
      onError(e);
    }
  };
  
  const imageSrc = error || !src ? fallbackImage : src;
  
  return (
    <img
      src={imageSrc}
      alt={alt || ''}
      className={className || ''}
      onError={handleError}
      loading={loading}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default Image;