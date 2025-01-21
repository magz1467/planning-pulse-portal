import { useState, useEffect } from 'react';
import Image from '@/components/ui/image';

interface ImageResolverProps {
  applicationId: number;
  image_map_url: string | null;
  image?: string;
  class_3?: string | null;
  title?: string;
}

export const ImageResolver = ({ 
  applicationId,
  image_map_url,
  image = '/placeholder.svg',
  class_3,
  title = ''
}: ImageResolverProps) => {
  const [currentImageSource, setCurrentImageSource] = useState<string | null>(null);

  useEffect(() => {
    // Log initial state for debugging
    console.log('ImageResolver - Initial State:', {
      applicationId,
      image_map_url,
      image,
      currentImageSource,
      class_3,
      title
    });

    // Helper to detect category from title
    const detectCategoryFromTitle = (title: string) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('demolition') || lowerTitle.includes('demolish')) return 'Demolition';
      if (lowerTitle.includes('extension') || lowerTitle.includes('extend')) return 'Extension';
      if (lowerTitle.includes('new build') || lowerTitle.includes('construction')) return 'NewBuild';
      return null;
    };

    const detectedCategory = detectCategoryFromTitle(title);
    console.log('ImageResolver - Detected category from title:', detectedCategory);

    // Determine the image source
    const determineImageSource = () => {
      // First priority: map image if available
      if (image_map_url) {
        console.log('ImageResolver - Using map image');
        return image_map_url;
      }

      // Second priority: class_3 based category image
      if (typeof class_3 === 'string' && class_3) {
        console.log('ImageResolver - Using category image for:', class_3);
        return `/category-images/${class_3.toLowerCase()}.jpg`;
      }

      // Third priority: title-based category detection
      if (detectedCategory) {
        console.log('ImageResolver - Using category image for:', detectedCategory);
        return `/category-images/${detectedCategory.toLowerCase()}.jpg`;
      }

      // Fallback: use miscellaneous category image
      console.log('ImageResolver - Using miscellaneous category image');
      return '/category-images/miscellaneous.jpg';
    };

    setCurrentImageSource(determineImageSource());
  }, [applicationId, image_map_url, image, class_3, title]);

  return (
    <Image
      src={currentImageSource || image}
      alt={title || 'Planning application image'}
      width={300}
      height={200}
      className="w-full h-[200px] object-cover rounded-lg"
      loading="lazy"
    />
  );
};