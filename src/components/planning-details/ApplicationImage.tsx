import { Application } from "@/types/planning";
import Image from "@/components/ui/image";
import { getImageUrl } from "@/utils/imageUtils";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  // Use image_map_url if available, otherwise try to get image from storage
  const imageUrl = getImageUrl(application.image_map_url || application.image);
  
  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg">
      <Image
        src={imageUrl}
        alt={application.description || 'Planning application image'}
        className="object-cover w-full h-full"
      />
    </div>
  );
};