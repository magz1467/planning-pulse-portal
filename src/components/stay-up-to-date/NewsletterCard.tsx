import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "@/components/ui/image";
import { EmailDialog } from "@/components/EmailDialog";

export const NewsletterCard = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (radius: string) => {
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
  };

  return (
    <div className="flex flex-col rounded-xl p-8 border border-gray-200 h-full bg-white">
      <div className="mb-6 h-48 overflow-hidden rounded-lg">
        <Image
          src="/lovable-uploads/eb848051-e385-460c-a55d-70d3815b949c.png"
          alt="Woman in elegant dress standing in front of traditional British housing"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4 font-playfair">Newsletter</h3>
        <p className="text-gray-600 mb-6">Stay up to date with the latest planning news and updates</p>
        <Button 
          onClick={() => setShowEmailDialog(true)} 
          className="w-full"
        >
          Subscribe to Newsletter
        </Button>
      </div>

      <EmailDialog 
        open={showEmailDialog}
        onOpenChange={setShowEmailDialog}
        onSubmit={handleEmailSubmit}
        postcode="Newsletter"
      />
    </div>
  );
};