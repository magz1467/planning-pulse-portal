import { Application } from "@/types/planning";
import Image from "@/components/ui/image";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  // Array of diverse house images from Unsplash
  const houseImages = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60", // Modern house
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60", // Traditional house
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop&q=60", // Suburban house
    "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60", // Luxury house
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"  // Contemporary house
  ];

  // Use image_map_url if available, otherwise fallback to image or random house image
  const imageUrl = application.image_map_url || application.image || houseImages[application.id % houseImages.length];
  
  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-100">
      <Image
        src={imageUrl}
        alt={application.description || 'Planning application image'}
        className="object-cover w-full h-full"
        loading="eager"
      />
    </div>
  );
};