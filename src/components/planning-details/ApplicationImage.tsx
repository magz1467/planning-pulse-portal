import { Application } from "@/types/planning";
import Image from "@/components/ui/image";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationImageProps {
  application: Application;
}

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const { toast } = useToast();

  // Array of diverse house images from Unsplash (same as in PlanningApplicationList)
  const houseImages = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"
  ];

  // Function to get a random image based on application id
  const getRandomImage = (id: number) => {
    return houseImages[id % houseImages.length];
  };

  useEffect(() => {
    const loadImage = async () => {
      // Log initial state
      console.log('ApplicationImage - Initial State:', {
        applicationId: application.id,
        image_map_url: application.image_map_url,
        image: application.image,
        currentImageSource: imageSource
      });

      try {
        // Try image_map_url first
        if (application.image_map_url) {
          const response = await fetch(application.image_map_url);
          if (response.ok) {
            setImageSource(application.image_map_url);
            console.log('ApplicationImage - Using image_map_url:', application.image_map_url);
            return;
          } else {
            console.warn('ApplicationImage - image_map_url failed to load:', {
              url: application.image_map_url,
              status: response.status
            });
          }
        }

        // Then try application.image
        if (application.image && application.image !== '/placeholder.svg') {
          const response = await fetch(application.image);
          if (response.ok) {
            setImageSource(application.image);
            console.log('ApplicationImage - Using application.image:', application.image);
            return;
          } else {
            console.warn('ApplicationImage - application.image failed to load:', {
              url: application.image,
              status: response.status
            });
          }
        }

        // Finally fall back to random house image
        const fallbackImage = getRandomImage(application.id);
        setImageSource(fallbackImage);
        console.log('ApplicationImage - Using fallback image:', fallbackImage);

      } catch (error) {
        console.error('ApplicationImage - Error loading image:', error);
        const fallbackImage = getRandomImage(application.id);
        setImageSource(fallbackImage);
        setImageError(`Failed to load image: ${error.message}`);
      }
    };

    loadImage();
  }, [application.id, application.image, application.image_map_url]);

  const handleImageError = (error: any) => {
    console.error('ApplicationImage - Image loading failed:', {
      error,
      applicationId: application.id,
      attemptedUrl: imageSource
    });
    
    // Try fallback image
    const fallbackImage = getRandomImage(application.id);
    setImageSource(fallbackImage);
    setImageError(`Failed to load image: ${error.message}`);
    
    toast({
      title: "Image Load Error",
      description: "Using fallback image due to loading error",
      variant: "destructive",
    });
  };

  return (
    <div className="w-full aspect-video relative overflow-hidden rounded-lg bg-gray-100">
      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500 bg-gray-100 z-10">
          {imageError}
        </div>
      )}
      {imageSource && (
        <Image
          src={imageSource}
          alt={application.description || 'Planning application image'}
          className="object-cover w-full h-full"
          loading="eager"
          onError={handleImageError}
        />
      )}
    </div>
  );
};