import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { MapPin, Timer } from "lucide-react";
import { getStatusColor, getStatusText } from "@/utils/statusColors";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { isWithinNextSevenDays } from "@/utils/dateUtils";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

// Array of diverse house images from Unsplash
const houseImages = [
  "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&auto=format&fit=crop&q=60", // Modern house
  "https://images.unsplash.com/photo-1576941089067-2de3c901e126?w=800&auto=format&fit=crop&q=60", // Traditional house
  "https://images.unsplash.com/photo-1598228723793-52759bba239c?w=800&auto=format&fit=crop&q=60", // Suburban house
  "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=800&auto=format&fit=crop&q=60", // Luxury house
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"  // Contemporary house
];

// Function to get a random image based on application id
const getRandomImage = (id: number) => {
  return houseImages[id % houseImages.length];
};

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const isClosingSoon = application.last_date_consultation_comments ? 
    isWithinNextSevenDays(application.last_date_consultation_comments) : false;

  return (
    <Card
      className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-xl shadow-lg p-4 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex gap-3">
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={application.image_map_url || getRandomImage(application.id)}
            alt="Property"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = getRandomImage(application.id);
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <ApplicationTitle 
            title={application.ai_title || application.description || ''} 
            className="mb-1"
          />
          <div className="flex items-center gap-1 mt-1 text-gray-600">
            <MapPin className="w-3 h-3" />
            <p className="text-sm truncate">{application.address}</p>
          </div>
          <div className="flex justify-between items-center mt-2">
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded ${getStatusColor(application.status)}`}>
                {getStatusText(application.status)}
              </span>
              {isClosingSoon && (
                <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-purple-100 text-purple-800">
                  <Timer className="w-3 h-3" />
                  Closing soon
                </span>
              )}
            </div>
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};