import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PetitionSharing } from "./petition/PetitionSharing";

interface PetitionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: number;
  selectedReasons: string[];
}

export const PetitionForm = ({ 
  open, 
  onOpenChange,
  applicationId,
  selectedReasons 
}: PetitionFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('petitions')
        .insert({
          user_email: email,
          reasons: selectedReasons
        });

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      toast({
        title: "🎉 Petition created successfully!",
        description: "Your voice matters. Share your petition to increase its impact!",
        duration: 5000,
      });

    } catch (error: any) {
      console.error('Error creating petition:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to create petition. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    setEmail("");
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Petition"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              Thank you for creating this petition! Share it with others to increase its impact.
            </p>
            <PetitionSharing applicationId={applicationId} />
            <Button onClick={handleClose} className="w-full mt-4">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};