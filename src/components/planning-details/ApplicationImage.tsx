import { Application } from "@/types/planning";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  if (!application.image) return null;

  return (
    <div className="aspect-video relative overflow-hidden rounded-lg">
      <img
        src={application.image}
        alt={application.title}
        className="object-cover w-full h-full"
      />
    </div>
  );
};