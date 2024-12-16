import { Application } from "@/types/planning";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { useState, memo } from "react";
import { useToast } from "@/components/ui/use-toast";
import Image from "@/components/ui/image";

interface ApplicationCardProps {
  application: Application;
  isSelected: boolean;
  onClick: () => void;
}

export const ApplicationCard = memo(({ application, isSelected, onClick }: ApplicationCardProps) => {
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const { toast } = useToast();

  if (!application) {
    return null;
  }

  const handleFeedback = (type: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (feedback === type) {
        setFeedback(null);
        toast({
          title: "Feedback removed",
          description: "Your feedback has been removed",
        });
      } else {
        setFeedback(type);
        toast({
          title: "Thank you for your feedback",
          description: type === 'up' ? "We're glad this was helpful!" : "We'll work on improving this",
        });
      }
    } catch (error) {
      console.error('Error handling feedback:', error);
      toast({
        title: "Error",
        description: "There was an error processing your feedback",
        variant: "destructive",
      });
    }
  };

  return (
    <Card
      className={`overflow-hidden cursor-pointer transition-all p-3 ${
        isSelected ? "border-primary shadow-lg" : "border-gray-200"
      }`}
      onClick={onClick}
    >
      {application.image && (
        <div className="aspect-video relative overflow-hidden rounded-lg mb-2">
          <Image
            src={application.image}
            alt={application.title}
            width={400}
            height={225}
            className="object-cover w-full h-full"
            loading="lazy"
          />
        </div>
      )}
      
      <h3 className="font-semibold text-primary truncate">
        {application.title}
      </h3>
      <div className="flex justify-between items-center mt-1">
        <span className="text-xs bg-primary-light text-primary px-2 py-1 rounded">
          {application.status}
        </span>
        <span className="text-xs text-gray-500">{application.distance}</span>
      </div>
      <p className="text-sm text-gray-600 mt-1 truncate">
        {application.address}
      </p>
      <div className="flex justify-end gap-2 mt-2">
        <Button
          variant={feedback === 'up' ? "default" : "outline"}
          size="sm"
          onClick={(e) => handleFeedback('up', e)}
        >
          <ThumbsUp className={`h-4 w-4 ${feedback === 'up' ? 'text-white' : 'text-gray-600'}`} />
        </Button>
        <Button
          variant={feedback === 'down' ? "outline" : "outline"}
          size="sm"
          onClick={(e) => handleFeedback('down', e)}
          className={feedback === 'down' ? 'bg-[#ea384c]/10' : ''}
        >
          <ThumbsDown className={`h-4 w-4 ${feedback === 'down' ? 'text-[#ea384c]' : 'text-gray-600'}`} />
        </Button>
      </div>
    </Card>
  );
});

ApplicationCard.displayName = 'ApplicationCard';