import { useState, useEffect } from 'react';

interface ImageResolverProps {
  imageMapUrl: string | null;
  image: string | undefined;
  title: string;
  applicationId: number;
  coordinates?: [number, number];
  class_3?: string | null;
}

// Category-specific image mapping
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
  'Miscellaneous': 'https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60'
};

export const ImageResolver = ({ 
  imageMapUrl, 
  image, 
  title,
  applicationId,
  coordinates,
  class_3 
}: ImageResolverProps) => {
  const [currentImageSource, setCurrentImageSource] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    console.log('ApplicationImage - Initial State:', {
      applicationId,
      image_map_url: imageMapUrl,
      image,
      currentImageSource,
      class_3
    });

    // Reset error state when props change
    setHasError(false);

    // Try to use the map image first
    if (imageMapUrl) {
      setCurrentImageSource(imageMapUrl);
    }
    // Then try the regular image
    else if (image && image !== '/placeholder.svg') {
      setCurrentImageSource(image);
    }
    // Use category-specific image based on class_3
    else if (class_3 && CATEGORY_IMAGES[class_3 as keyof typeof CATEGORY_IMAGES]) {
      setCurrentImageSource(CATEGORY_IMAGES[class_3 as keyof typeof CATEGORY_IMAGES]);
      console.log('ApplicationImage - Using category image for:', class_3);
    }
    // Finally use miscellaneous category image as fallback
    else {
      console.log('ApplicationImage - Using miscellaneous category image');
      setCurrentImageSource(CATEGORY_IMAGES['Miscellaneous']);
    }
  }, [imageMapUrl, image, applicationId, class_3]);

  const handleImageError = () => {
    console.log('ApplicationImage - Error loading image:', currentImageSource);
    setHasError(true);
    
    // If current source failed, try the category image
    if (class_3 && CATEGORY_IMAGES[class_3 as keyof typeof CATEGORY_IMAGES]) {
      setCurrentImageSource(CATEGORY_IMAGES[class_3 as keyof typeof CATEGORY_IMAGES]);
    } else {
      setCurrentImageSource(CATEGORY_IMAGES['Miscellaneous']);
    }
  };

  if (!currentImageSource || hasError) {
    return (
      <img
        src={CATEGORY_IMAGES['Miscellaneous']}
        alt={title}
        className="w-full h-full object-cover"
        onError={handleImageError}
      />
    );
  }

  return (
    <img
      src={currentImageSource}
      alt={title}
      className="w-full h-full object-cover"
      onError={handleImageError}
    />
  );
};