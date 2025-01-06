import Image from "@/components/ui/image";
import { FALLBACK_IMAGE } from "@/utils/imageUtils";

interface ImageResolverProps {
  imageMapUrl?: string;
  image?: string;
  title: string;
  applicationId?: number;
  coordinates?: [number, number];
}

export const ImageResolver = ({
  imageMapUrl,
  image,
  title,
  applicationId,
  coordinates
}: ImageResolverProps) => {
  const imageUrl = (() => {
    if (imageMapUrl) {
      return imageMapUrl;
    }
    if (image) {
      return image;
    }
    return FALLBACK_IMAGE;
  })();

  return (
    <Image
      src={imageUrl}
      alt={title}
      className="w-full h-full object-cover"
      loading="lazy"
    />
  );
};