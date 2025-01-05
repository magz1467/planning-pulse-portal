import { Application } from "@/types/planning";
import { MapPin, Timer } from "lucide-react";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ImageWithFallback } from "@/components/ui/image-with-fallback";
import { useToast } from "@/hooks/use-toast";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const isClosingSoon = application.last_date_consultation_comments;
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

  // Get the appropriate image URL with detailed logging
  console.log('MiniCard - Starting image URL resolution for application:', application.id);
  
  const imageUrl = (() => {
    if (application.image_map_url) {
      console.log('MiniCard - Using image_map_url:', application.image_map_url);
      return application.image_map_url;
    }
    if (application.image && application.image !== '/placeholder.svg') {
      // Check if it's a Supabase storage URL
      if (application.image.startsWith('/storage/')) {
        const supabaseUrl = process.env.VITE_SUPABASE_URL;
        const fullUrl = `${supabaseUrl}${application.image}`;
        console.log('MiniCard - Constructed Supabase storage URL:', fullUrl);
        return fullUrl;
      }
      console.log('MiniCard - Using application.image:', application.image);
      return application.image;
    }
    const fallbackImage = getRandomImage(application.id);
    console.log('MiniCard - Using fallback image:', fallbackImage);
    return fallbackImage;
  })();

  console.log('MiniCard - Final image URL resolution:', {
    applicationId: application.id,
    imageMapUrl: application.image_map_url,
    image: application.image,
    fallbackImage: getRandomImage(application.id),
    finalImageUrl: imageUrl,
    applicationDetails: application
  });

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-in slide-in-from-bottom duration-300"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <ImageWithFallback
            src={imageUrl}
            alt={application.title || application.description || ''}
            width={80}
            height={80}
            className="w-full h-full object-cover"
            fallbackSrc={getRandomImage(application.id)}
            onError={(e) => {
              console.error('MiniCard - Image failed to load:', {
                attemptedUrl: imageUrl,
                error: e,
                application: application
              });
              toast({
                title: "Image failed to load",
                description: "Using fallback image instead",
                variant: "default",
              });
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <ApplicationTitle 
              title={application.ai_title || application.description || ''} 
              className="line-clamp-2 text-sm font-semibold text-primary"
            />
            {isClosingSoon && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                <Timer className="w-3 h-3 mr-1" />
                Closing soon
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <p className="text-sm truncate">{application.address}</p>
          </div>
          <div className="flex items-center justify-between mt-2">
            <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
              {getStatusText(application.status)}
            </span>
            <span className="text-xs text-gray-500">
              {application.distance}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};