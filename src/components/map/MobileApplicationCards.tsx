import { Application, Comment } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { CommentForm } from "../comments/CommentForm";
import { CommentList } from "../comments/CommentList";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MobileApplicationCardsProps {
  applications: Application[];
  selectedId: number | null;
  onSelectApplication: (id: number) => void;
}

export const MobileApplicationCards = ({
  applications,
  selectedId,
  onSelectApplication,
}: MobileApplicationCardsProps) => {
  const { toast } = useToast();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);

  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      setIsFullScreen(!isFullScreen);
    } else {
      setIsFullScreen(false);
      onSelectApplication(id);
    }
  };

  const handleFeedback = (type: 'positive' | 'negative') => {
    toast({
      title: "Thank you for your feedback",
      description: "Your response has been recorded.",
      duration: 3000,
    });
  };

  const handleShare = (application: Application) => {
    const shareText = `Check out this planning application: ${application.title} at ${application.address}. Reference: ${application.reference}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Sharing via WhatsApp",
      description: "Opening WhatsApp to share this application",
      duration: 3000,
    });
  };

  const handleCommentSubmit = (newComment: Comment) => {
    setComments([...comments, newComment]);
  };

  const selectedApp = applications.find(app => app.id === selectedId);

  if (isFullScreen && selectedApp) {
    return (
      <div className="fixed inset-0 bg-white z-[1000] overflow-y-auto">
        <div className="p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Application Details</h2>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleShare(selectedApp)}
                className="text-gray-500"
              >
                <Share2 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsFullScreen(false)}
                className="text-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-primary">{selectedApp.title}</h3>
              <p className="text-gray-600 mt-1">{selectedApp.address}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold">Reference</p>
                <p className="text-gray-600">{selectedApp.reference}</p>
              </div>
              <div>
                <p className="font-semibold">Status</p>
                <p className="text-gray-600">{selectedApp.status}</p>
              </div>
              <div>
                <p className="font-semibold">Type</p>
                <p className="text-gray-600">{selectedApp.type}</p>
              </div>
              <div>
                <p className="font-semibold">Distance</p>
                <p className="text-gray-600">{selectedApp.distance}</p>
              </div>
            </div>

            {selectedApp.description && (
              <div className="border-t pt-6">
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600 text-sm">{selectedApp.description}</p>
              </div>
            )}

            <CommentList comments={comments} />

            <div className="border-t pt-6">
              <h4 className="font-semibold mb-4">Quick Feedback</h4>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleFeedback('positive')}
                >
                  <ThumbsUp className="mr-2" /> Support
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => handleFeedback('negative')}
                >
                  <ThumbsDown className="mr-2" /> Object
                </Button>
              </div>
            </div>

            <CommentForm onCommentSubmit={handleCommentSubmit} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-xl shadow-lg z-[1000] pb-safe">
      <div className="p-2 border-b">
        <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto" />
      </div>
      <div className="p-4">
        <Carousel
          opts={{
            align: "center",
            loop: true,
          }}
        >
          <CarouselContent>
            {applications.map((app) => (
              <CarouselItem key={app.id}>
                <Card
                  className={`p-4 cursor-pointer transition-all ${
                    selectedId === app.id ? "border-primary" : ""
                  }`}
                  onClick={() => handleCardClick(app.id)}
                >
                  <h3 className="font-semibold text-primary truncate">
                    {app.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1 truncate">
                    {app.address}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
                      {app.status}
                    </span>
                    <span className="text-xs text-gray-500">{app.distance}</span>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
};