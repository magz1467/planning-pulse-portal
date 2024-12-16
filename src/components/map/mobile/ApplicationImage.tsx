import Image from "@/components/ui/image";
import { PlanningApplication } from "@/types/planning";

interface ApplicationImageProps {
  image: string;
  title: string;
}

export const ApplicationImage = ({ image, title }: ApplicationImageProps) => {
  return (
    <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover"
        loading="lazy"
      />
    </div>
  );
};