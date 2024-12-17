import { Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ApplicationSharingProps {
  applicationId: number;
  reference: string;
}

export const ApplicationSharing = ({ applicationId, reference }: ApplicationSharingProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('application', applicationId.toString());
    
    try {
      await navigator.clipboard.writeText(url.toString());
      toast({
        title: "Link copied!",
        description: "Share this link to show this planning application to others.",
        duration: 3000,
      });
    } catch (err) {
      toast({
        title: "Couldn't copy link",
        description: "Please try again or copy the URL from your browser.",
        variant: "destructive",
      });
    }
  };

  const handleWhatsAppShare = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('application', applicationId.toString());
    
    const text = `Check out this planning application (ref: ${reference}): ${url.toString()}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleShare}
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share link
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleWhatsAppShare}
        className="flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        WhatsApp
      </Button>
    </div>
  );
};