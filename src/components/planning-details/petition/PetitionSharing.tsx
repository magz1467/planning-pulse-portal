import { Button } from "@/components/ui/button";
import { Share2, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PetitionSharingProps {
  applicationId: number;
}

export const PetitionSharing = ({ applicationId }: PetitionSharingProps) => {
  const { toast } = useToast();

  const getShareUrl = () => {
    const baseUrl = window.location.origin + window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    searchParams.set('application', applicationId.toString());
    return `${baseUrl}?${searchParams.toString()}`;
  };

  const handleShare = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "Share this link to show others your petition.",
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
    const text = `I just created a petition about a planning application. Join me in making our voice heard: ${url}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        variant="outline"
        onClick={handleShare}
        className="w-full flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Copy Share Link
      </Button>
      <Button
        variant="outline"
        onClick={handleWhatsAppShare}
        className="w-full flex items-center gap-2"
      >
        <MessageCircle className="w-4 h-4" />
        Share on WhatsApp
      </Button>
    </div>
  );
};