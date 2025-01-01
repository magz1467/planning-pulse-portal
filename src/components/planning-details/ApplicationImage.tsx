import { Application } from "@/types/planning";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application?: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  // Debug logs
  console.log("ApplicationImage - Application:", application);
  console.log("ApplicationImage - Image URL:", application?.image);
  
  const imageUrl = application?.image || '/placeholder.svg';
  console.log("ApplicationImage - Final Image URL used:", imageUrl);

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={imageUrl}
        alt={application?.description || ''}
        width={800}
        height={600}
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error("Image failed to load:", imageUrl);
          // Log the error event
          console.log("Image error event:", e);
        }}
      />
    </div>
  );
};