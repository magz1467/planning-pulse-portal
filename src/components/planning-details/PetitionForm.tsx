import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Share2, MessageCircle } from "lucide-react";
import { PostcodeSearch } from "@/components/PostcodeSearch";

interface PetitionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: number;
  selectedReasons: string[];
}

export const PetitionForm = ({ open, onOpenChange, applicationId, selectedReasons }: PetitionFormProps) => {
  const [email, setEmail] = useState("");
  const [postcode, setPostcode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { error } = await supabase.from('petitions').insert([{
        user_email: email,
        user_id: session?.user?.id || null,
        application_id: applicationId,
        reasons: selectedReasons,
        address: `${addressLine1}, ${postcode}`
      }]);

      if (error) throw error;

      setIsSuccess(true);
      toast({
        title: "🎉 Petition created successfully!",
        description: "Your voice matters. Share your petition to increase its impact!",
        duration: 5000,
      });

    } catch (error) {
      console.error('Error creating petition:', error);
      toast({
        title: "Error",
        description: "Failed to create petition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setEmail("");
    setPostcode("");
    setAddressLine1("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] z-[2000] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isSuccess ? "Petition Created Successfully! 🎉" : "Create Petition"}
          </DialogTitle>
        </DialogHeader>
        
        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <PostcodeSearch
                onSelect={setPostcode}
                placeholder="Enter your postcode"
                className="w-full"
              />
            </div>
            <div>
              <Input
                type="text"
                placeholder="Address line 1"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Petition"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Thank you for creating this petition! Share it with others to increase its impact.
            </p>
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
            <Button onClick={handleClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};