import { Application } from "@/types/planning";
import Image from "@/components/ui/image";
import { getImageUrl } from "@/utils/imageUtils";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  // Use image_map_url if available, otherwise try to get image from storage
  const imageUrl = getImageUrl(application.image_map_url || application.image);
  console.log('ApplicationImage component:', {
    image_map_url: application.image_map_url,
    image: application.image,
    resolved_url: imageUrl
  });
  
  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={application.description || 'Planning application image'}
        className="object-cover w-full h-full"
        onError={(e) => {
          console.error('Image load error:', e);
          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
      />
    </div>
  );
};