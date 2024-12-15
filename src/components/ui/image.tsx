import { useState } from "react";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}

const Image = ({ src, alt, className, ...props }: ImageProps) => {
  const [error, setError] = useState(false);

  return (
    <img
      src={error ? "/lovable-uploads/ed8c75b6-7e73-4720-818d-f78fbcf2d94a.png" : src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      {...props}
    />
  );
};

export default Image;