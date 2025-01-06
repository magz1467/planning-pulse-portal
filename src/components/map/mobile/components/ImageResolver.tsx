import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useToast } from "@/hooks/use-toast";

interface ImageResolverProps {
  imageMapUrl?: string;
  image?: string;
  title: string;
  applicationId: number;
}

export const ImageResolver = ({ imageMapUrl, image, title, applicationId }: ImageResolverProps) => {
  const { toast } = useToast();

  // Array of diverse house images from Unsplash
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

  console.log('ImageResolver - Starting image URL resolution for application:', applicationId);
  
  const imageUrl = (() => {
    // First try to use image_map_url if it exists and is valid
    if (imageMapUrl && imageMapUrl !== 'undefined') {
      console.log('ImageResolver - Using image_map_url:', imageMapUrl);
      return imageMapUrl;
    }

    // Then try to use the image property if it exists and is not a placeholder
    if (image && image !== '/placeholder.svg') {
      // Check if it's a Supabase storage URL
      if (image.startsWith('/storage/')) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const fullUrl = `${supabaseUrl}${image}`;
        console.log('ImageResolver - Constructed Supabase storage URL:', fullUrl);
        return fullUrl;
      }
      console.log('ImageResolver - Using application.image:', image);
      return image;
    }

    // Finally fall back to random Unsplash image
    const fallbackImage = getRandomImage(applicationId);
    console.log('ImageResolver - Using fallback image:', fallbackImage);
    return fallbackImage;
  })();

  // Log the final resolution for debugging
  console.log('ImageResolver - Final image URL resolution:', {
    applicationId,
    imageMapUrl,
    image,
    fallbackImage: getRandomImage(applicationId),
    finalImageUrl: imageUrl
  });

  return (
    <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
      <ImageWithFallback
        src={imageUrl}
        alt={title}
        width={80}
        height={80}
        className="w-full h-full object-cover"
        fallbackSrc={getRandomImage(applicationId)}
        onError={(e) => {
          console.error('ImageResolver - Image failed to load:', {
            attemptedUrl: imageUrl,
            error: e
          });
          toast({
            title: "Image failed to load",
            description: "Using fallback image instead",
            variant: "default",
          });
        }}
      />
    </div>
  );
};