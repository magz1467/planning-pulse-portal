import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  width?: number;
  height?: number;
}

const Image = ({ src, alt, className, width, height, loading = "lazy", ...props }: ImageProps) => {
  const [error, setError] = useState(false);
  
  // If the image is a local asset (starts with /) use it directly
  const imageSrc = src?.startsWith('/') ? src : src;

  return (
    <img
      src={error ? '/placeholder.svg' : imageSrc}
      alt={alt || ''}
      className={className || ''}
      onError={() => setError(true)}
      loading={loading}
      width={width}
      height={height}
      {...props}
    />
  );
};

export default Image;