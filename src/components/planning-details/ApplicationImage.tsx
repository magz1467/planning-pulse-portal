import { Application } from "@/types/planning";
import Image from "@/components/ui/image";
import { getImageUrl, FALLBACK_IMAGE } from "@/utils/imageUtils";
import { useState } from "react";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  
  // Use image_map_url if available, otherwise try to get image from storage
  const imageUrl = getImageUrl(application.image_map_url || application.image);
  console.log('ApplicationImage component:', {
    image_map_url: application.image_map_url,
    image: application.image,
    resolved_url: imageUrl
  });
  
  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
      <Image
        src={imageUrl}
        alt={application.description || 'Planning application image'}
        className={`object-cover w-full h-full ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onError={(e) => {
          console.error('Image load error:', e);
          (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
        }}
        onLoadStart={() => setIsLoading(true)}
        onLoad={() => setIsLoading(false)}
      />
    </div>
  );
};