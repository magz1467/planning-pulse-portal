import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Share, MessageCircle } from "lucide-react";
import { ApplicationBadges } from "@/components/applications/ApplicationBadges";
import { ImageResolver } from "./components/ImageResolver";
import { ApplicationTitle } from "@/components/applications/ApplicationTitle";
import { useToast } from "@/hooks/use-toast";

interface MiniCardProps {
  application: Application;
  onClick: () => void;
}

export const MiniCard = ({ application, onClick }: MiniCardProps) => {
  const { toast } = useToast();

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Create share data
    const shareData = {
      title: application.engaging_title || application.description || 'Planning Application',
      text: `Check out this planning application at ${application.address}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "The planning application has been shared",
        });
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Link copied",
          description: "The link has been copied to your clipboard",
        });
      }
    } catch (err) {
      console.error('Error sharing:', err);
      toast({
        title: "Error sharing",
        description: "There was an error sharing this application",
        variant: "destructive",
      });
    }
  };

  const handleComment = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This will expand the full view with comments section visible
    onClick();
    toast({
      title: "Comments opened",
      description: "You can now view and add comments",
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t shadow-lg z-[1000]">
      <div className="flex gap-3" onClick={onClick}>
        <div className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
          <ImageResolver
            imageMapUrl={application.image_map_url}
            image={application.image}
            title={application.title || application.description || ''}
            applicationId={application.id}
            coordinates={application.coordinates}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-primary truncate">
            <ApplicationTitle title={application.engaging_title || application.description || ''} />
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{application.address}</p>
          <div className="flex flex-col gap-2 mt-2">
            <ApplicationBadges
              status={application.status}
              lastDateConsultationComments={application.last_date_consultation_comments}
              impactScore={application.final_impact_score}
            />
            <span className="text-xs text-gray-500">{application.distance}</span>
          </div>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleShare}
        >
          <Share className="w-4 h-4 mr-2" />
          Share
        </Button>
        <Button
          variant="outline"
          className="flex-1"
          onClick={handleComment}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          Comment
        </Button>
      </div>
    </div>
  );
};