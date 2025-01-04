import { Application } from "@/types/planning";
import { MapPin, Timer } from "lucide-react";
import { isWithinNextSevenDays } from "@/utils/dateUtils";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import Image from "@/components/ui/image";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const isClosingSoon = isWithinNextSevenDays(application.last_date_consultation_comments);

  // Array of diverse house images from Unsplash
  const houseImages = [
    "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60", // Modern house
    "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60", // Traditional house
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop&q=60", // Suburban house
    "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60", // Luxury house
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"  // Contemporary house
  ];

  // Use image_map_url if available, otherwise fallback to image or random house image
  const imageUrl = application.image_map_url || application.image || houseImages[application.id % houseImages.length];

  return (
    <div 
      className="fixed bottom-4 left-4 right-4 bg-white rounded-lg shadow-xl p-4 cursor-pointer animate-in slide-in-from-bottom duration-300"
      onClick={onClick}
      style={{ zIndex: 1500 }}
    >
      <div className="flex gap-4 items-center">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
          <Image
            src={imageUrl}
            alt={application.title || application.description || ''}
            width={80}
            height={80}
            className="w-full h-full object-cover"
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