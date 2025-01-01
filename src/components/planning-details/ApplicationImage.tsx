import { Application } from "@/types/planning";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  // Use image_map_url if available, otherwise fallback to image
  const imageUrl = application.image_map_url || application.image || "/placeholder.svg";
  
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