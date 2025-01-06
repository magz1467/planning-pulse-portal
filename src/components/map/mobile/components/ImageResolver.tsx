import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useToast } from "@/hooks/use-toast";

interface ImageResolverProps {
  imageMapUrl?: string;
  image?: string;
  title: string;
  applicationId: number;
  coordinates?: [number, number];
}

export const ImageResolver = ({ imageMapUrl, image, title, applicationId, coordinates }: ImageResolverProps) => {
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

  const generateMapboxUrl = (coords: [number, number]) => {
    const [lat, lng] = coords;
    return `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lng},${lat},17,45,60/800x600@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN}&logo=false`;
  };

  const imageUrl = (() => {
    // First try to use image_map_url if it exists and is valid
    if (imageMapUrl && imageMapUrl !== 'undefined') {
      return imageMapUrl;
    }

    // Then try to generate a new mapbox URL if we have coordinates
    if (coordinates) {
      return generateMapboxUrl(coordinates);
    }

    // Then try to use the image property if it exists and is not a placeholder
    if (image && image !== '/placeholder.svg') {
      // Check if it's a Supabase storage URL
      if (image.startsWith('/storage/')) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        return `${supabaseUrl}${image}`;
      }
      return image;
    }

    // Finally fall back to random Unsplash image
    return getRandomImage(applicationId);
  })();

  return (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 overflow-hidden">
      <ImageWithFallback
        src={imageUrl}
        alt={title}
        width={80}
        height={80}
        className="w-full h-full object-cover"
        fallbackSrc={getRandomImage(applicationId)}
        onError={(e) => {
          console.error('Image failed to load:', {
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