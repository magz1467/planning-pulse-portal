import { Application } from "@/types/planning";
import Image from "@/components/ui/image";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ApplicationImageProps {
  application: Application;
}

// Category-specific image mapping - same as ImageResolver
const CATEGORY_IMAGES = {
  'Demolition': '/lovable-uploads/7448dbb9-9558-4d5b-abd8-b9a086dc632c.png',
  'Extension': '/lovable-uploads/3d400936-3af5-4445-b768-a9342b176d2f.png',
  'New Build': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=60',
  'Change of Use': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60',
  'Listed Building': 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&auto=format&fit=crop&q=60',
  'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
  'Residential': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60',
  'Infrastructure': 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=800&auto=format&fit=crop&q=60',
  'Planning Conditions': '/lovable-uploads/c5f375f5-c862-4a11-a43e-7dbac6a9085a.png',
  'Miscellaneous': '/lovable-uploads/e22c5043-4a12-4668-96a9-ec4185b9b1dd.png'
};

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadImage = async () => {
      // Log initial state
      console.log('ApplicationImage - Initial State:', {
        applicationId: application.id,
        image_map_url: application.image_map_url,
        image: application.image,
        currentImageSource: imageSource,
        class_3: application.class_3
      });

      try {
        // Try to use the map image first
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

        // Finally use category image or default
        const categoryImage = application.class_3 ? CATEGORY_IMAGES[application.class_3 as keyof typeof CATEGORY_IMAGES] : CATEGORY_IMAGES['Miscellaneous'];
        setImageSource(categoryImage);
        console.log('ApplicationImage - Using category image:', {
          class_3: application.class_3,
          image: categoryImage
        });

      } catch (error) {
        console.error('ApplicationImage - Error loading image:', error);
        setImageSource(CATEGORY_IMAGES['Miscellaneous']);
        setImageError(`Failed to load image: ${error.message}`);
      }
    };

    loadImage();
  }, [application.id, application.image, application.image_map_url, application.class_3]);

  const handleImageError = (error: any) => {
    console.error('ApplicationImage - Image loading failed:', {
      error,
      applicationId: application.id,
      attemptedUrl: imageSource
    });
    
    setImageSource(CATEGORY_IMAGES['Miscellaneous']);
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