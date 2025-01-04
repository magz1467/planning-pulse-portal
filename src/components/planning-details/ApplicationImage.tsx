import { Application } from "@/types/planning";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  // Use image_map_url if available, otherwise fallback to image
  const imageUrl = application.image_map_url || application.image || "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60";
  
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