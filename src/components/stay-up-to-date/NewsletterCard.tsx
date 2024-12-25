import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import Image from "@/components/ui/image";
import { EmailDialog } from "@/components/EmailDialog";

export const NewsletterCard = () => {
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = (email: string) => {
    toast({
      title: "Success!",
      description: "You've been subscribed to our newsletter.",
    });
  };

  return (
    <div className="flex flex-col rounded-xl p-8 border border-gray-200 h-full bg-white">
      <div className="mb-6 h-48 overflow-hidden rounded-lg">
        <Image
          src="/lovable-uploads/abb1ba01-758b-471b-a769-5607e42a106b.png"
          alt="Newsletter signup"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4">Newsletter</h3>
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
      />
    </div>
  );
};