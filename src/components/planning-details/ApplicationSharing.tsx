import { Share2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/types/planning";

interface ApplicationSharingProps {
  application: Application;
}

export const ApplicationSharing = ({ application }: ApplicationSharingProps) => {
  const { toast } = useToast();

  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('application', application.id.toString());
    return `${baseUrl}?${searchParams.toString()}`;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    
    try {
      await navigator.clipboard.writeText(url);
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
    const url = getShareUrl();
    const text = `Check out this planning application (ref: ${application.reference}): ${url}`;
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