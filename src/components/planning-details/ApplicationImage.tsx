import { Application } from "@/types/planning";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application?: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-100">
      <Image
        src="/placeholder.svg"
        alt={application?.description || ''}
        width={800}
        height={600}
        className="w-full h-full object-cover"
      />
    </div>
  );
};