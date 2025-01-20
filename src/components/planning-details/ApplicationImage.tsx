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
  'Extension': '/lovable-uploads/b0296cbb-48ab-46ec-9ac1-93c1251ca198.png',
  'New Build': 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&auto=format&fit=crop&q=60',
  'Change of Use': 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60',
  'Listed Building': 'https://images.unsplash.com/photo-1464146072230-91cabc968266?w=800&auto=format&fit=crop&q=60',
  'Commercial': 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60',
  'Residential': 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=60',
  'Infrastructure': 'https://images.unsplash.com/photo-1621955964441-c173e01c135b?w=800&auto=format&fit=crop&q=60',
  'Planning Conditions': '/lovable-uploads/c5f375f5-c862-4a11-a43e-7dbac6a9085a.png',
  'Miscellaneous': '/lovable-uploads/ce773ff2-12e2-463a-b81e-1042a334d0cc.png'
};

export const ApplicationImage = ({ application }: ApplicationImageProps) => {
  const [imageError, setImageError] = useState<string | null>(null);
  const [imageSource, setImageSource] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    console.log('ApplicationImage - Initial State:', {
      applicationId: application.id,
      image_map_url: application.image_map_url,
      image: application.image,
      currentImageSource: imageSource,
      class_3: application.class_3
    });

    // First try to determine category from title if class_3 is not set
    let detectedCategory = application.class_3;
    if (!detectedCategory && application.description) {
      const titleLower = application.description.toLowerCase();
      if (titleLower.includes('demolition')) {
        detectedCategory = 'Demolition';
      } else if (titleLower.includes('extension')) {
        detectedCategory = 'Extension';
      } else if (titleLower.includes('new build')) {
        detectedCategory = 'New Build';
      } else if (titleLower.includes('change of use')) {
        detectedCategory = 'Change of Use';
      } else if (titleLower.includes('listed building')) {
        detectedCategory = 'Listed Building';
      }
      console.log('ApplicationImage - Detected category from title:', detectedCategory);
    }

    // Use category image if available
    if (detectedCategory && CATEGORY_IMAGES[detectedCategory as keyof typeof CATEGORY_IMAGES]) {
      console.log('ApplicationImage - Using category image for:', detectedCategory);
      setImageSource(CATEGORY_IMAGES[detectedCategory as keyof typeof CATEGORY_IMAGES]);
      return;
    }

    // Then try the regular image
    if (application.image && application.image !== '/placeholder.svg') {
      setImageSource(application.image);
      return;
    }

    // Finally use miscellaneous category image as fallback
    console.log('ApplicationImage - Using miscellaneous category image');
    setImageSource(CATEGORY_IMAGES['Miscellaneous']);
  }, [application.id, application.image, application.image_map_url, application.class_3, application.description]);

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