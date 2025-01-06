import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ImageResolverProps {
  imageUrl?: string | null;
  title: string;
  defaultImage: string;
}

export const ImageResolver = ({ 
  imageUrl, 
  title,
  defaultImage 
}: ImageResolverProps) => {
  const finalImageUrl = imageUrl || defaultImage;

  return (
    <ImageWithFallback
      src={finalImageUrl}
      alt={title}
      className="w-full h-full object-cover"
      defaultSrc={defaultImage}
    />
  );
};