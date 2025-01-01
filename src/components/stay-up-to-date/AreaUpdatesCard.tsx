import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "@/components/ui/Image";
import { EmailDialog } from "@/components/EmailDialog";

export const AreaUpdatesCard = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (email: string, radius: string) => {
    toast({
      title: "Success!",
      description: "You've been subscribed to local updates.",
    });
  };

  return (
    <div className="flex flex-col rounded-xl p-8 border border-gray-200 h-full bg-white">
      <div className="mb-6 h-48 overflow-hidden rounded-lg">
        <Image
          src="/lovable-uploads/6492526a-800c-4702-a7f5-544d42447cc7.png"
          alt="Community engagement"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4">Local Updates</h3>
        <p className="text-gray-600 mb-6">Get a notification when a new application goes live near you</p>
        <Button 
          onClick={() => setShowEmailDialog(true)} 
          className="w-full"
        >
          Get Area Updates
        </Button>
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
      />
    </div>
  );
};