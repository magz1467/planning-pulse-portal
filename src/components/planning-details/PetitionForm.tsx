import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface PetitionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: number;
  selectedReasons: string[];
}

export const PetitionForm = ({ open, onOpenChange, applicationId, selectedReasons }: PetitionFormProps) => {
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

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
        address: address
      }]);

      if (error) throw error;

      toast({
        title: "Petition created",
        description: "Your petition has been submitted successfully.",
      });

      onOpenChange(false);
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Petition</DialogTitle>
        </DialogHeader>
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
          <div>
            <Input
              type="text"
              placeholder="Your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Petition"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};