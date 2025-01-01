import { Application } from "@/types/planning";
import { getImageUrl } from "@/utils/imageUtils";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application?: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  return (
    <div className="aspect-video relative overflow-hidden rounded-lg">
      <Image
        src="/placeholder.svg"
        alt={application?.title || ''}
        className="object-cover w-full h-full"
      />
    </div>
  );
};