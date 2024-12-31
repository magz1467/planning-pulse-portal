import { Application } from "@/types/planning";
import { getImageUrl } from "@/utils/imageUtils";

interface ApplicationImageProps {
  application?: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  if (!application?.image) return null;

  return (
    <div className="aspect-video relative overflow-hidden rounded-lg">
      <img
        src={getImageUrl(application.image)}
        alt={application.title}
        className="object-cover w-full h-full"
      />
    </div>
  );
};