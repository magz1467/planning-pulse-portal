import { Application } from "@/types/planning";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application?: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  return (
    <div className="aspect-video relative overflow-hidden rounded-lg">
      <Image
        src={application?.image_map_url || "/placeholder.svg"}
        alt={application?.title || ''}
        className="object-cover w-full h-full"
      />
    </div>
  );
};