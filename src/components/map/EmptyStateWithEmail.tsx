import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface EmptyStateWithEmailProps {
  postcode: string;
}

export const EmptyStateWithEmail = ({ postcode }: EmptyStateWithEmailProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('waiting_list')
        .insert([{ email, postcode }]);

      if (error) throw error;

      toast({
        title: "Thank you for your interest!",
        description: "We'll notify you when NimbyGram becomes available in your area.",
      });

      setEmail("");
    } catch (error) {
      console.error('Error saving to waiting list:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="w-full max-w-lg mx-4 bg-white p-6 rounded-lg shadow-lg border-2 border-[#af5662]">
        <h3 className="text-xl font-semibold mb-2 text-[#af5662]">Coming soon to your area</h3>
        <p className="text-gray-600 mb-4">
          NimbyGram is only in London right now. Enter your email address to get an email for when your area comes online.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1"
          />
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#af5662] hover:bg-[#af5662]/90"
          >
            {isSubmitting ? "Submitting..." : "Notify me"}
          </Button>
        </form>
      </div>
    </div>
  );
};