import { ImageWithFallback } from "@/components/ui/image-with-fallback";

interface ImageResolverProps {
  imageUrl?: string | null;
  image?: string | null;
  title: string;
  applicationId?: number;
  coordinates?: [number, number] | null;
}

export const ImageResolver = ({
  imageUrl,
  image,
  title,
  applicationId,
  coordinates
}: ImageResolverProps) => {
  const defaultImage = '/placeholder.svg';
  const finalImageUrl = imageUrl || image || defaultImage;

  return (
    <ImageWithFallback
      src={finalImageUrl}
      alt={title}
      className="w-full h-full object-cover"
      fallback={defaultImage}
    />
  );
};