import { Application } from "@/types/planning";
import Image from "@/components/ui/image";
import { useState } from "react";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  const [imageError, setImageError] = useState<string | null>(null);

  // Array of diverse house images from Unsplash (same as in PlanningApplicationList)
  const houseImages = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60", // Modern house
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60", // Traditional house
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop&q=60", // Suburban house
    "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60", // Luxury house
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"  // Contemporary house
  ];

  // Function to get a random image based on application id (same as in PlanningApplicationList)
  const getRandomImage = (id: number) => {
    return houseImages[id % houseImages.length];
  };

  // Use image_map_url if available, otherwise fallback to image or random house image
  const imageUrl = application.image_map_url || application.image || getRandomImage(application.id);

  console.log('ApplicationImage - Debug Info:', {
    applicationId: application.id,
    image_map_url: application.image_map_url,
    image: application.image,
    finalImageUrl: imageUrl,
    hasError: imageError
  });

  const handleImageError = (error: any) => {
    console.error('Image loading failed:', {
      error,
      applicationId: application.id,
      attemptedUrl: imageUrl
    });
    setImageError(`Failed to load image: ${error.message}`);
  };

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-100">
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-gray-100">
          {imageError}
        </div>
      )}
      <Image
        src={imageUrl}
        alt={application.description || 'Planning application image'}
        className="object-cover w-full h-full"
        loading="eager"
        onError={handleImageError}
      />
    </div>
  );
};