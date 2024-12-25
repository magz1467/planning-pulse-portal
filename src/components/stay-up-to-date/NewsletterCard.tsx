import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "@/components/ui/image";
import { supabase } from "@/integrations/supabase/client";

export const NewsletterCard = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First save to database
      const { error } = await supabase
        .from('User data')
        .insert([
          { 
            Email: newsletterEmail,
            Marketing: true,
            Type: 'resident'
          }
        ]);

      if (error) throw error;

      // Send verification email
      const response = await supabase.functions.invoke('send-verification', {
        body: { email: newsletterEmail }
      });

      if (response.error) throw new Error(response.error.message);

      toast({
        title: "Success!",
        description: "Please check your email to confirm your subscription.",
      });
      setNewsletterEmail("");
    } catch (error) {
      console.error('Error saving newsletter subscription:', error);
      toast({
        title: "Subscription failed",
        description: "There was a problem subscribing to the newsletter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col rounded-xl p-8 border border-gray-200 h-full bg-white">
      <div className="mb-6 h-48 overflow-hidden rounded-lg">
        <Image
          src="/lovable-uploads/128f63aa-cbd2-4d3a-89df-cd2651e10113.png"
          alt="Stay informed"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4">Monthly Newsletter</h3>
        <p className="text-gray-600 mb-6">Stay informed about the latest trends and changes in planning.</p>
        <form onSubmit={handleNewsletterSubmit} className="space-y-4 mt-auto">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email address</label>
            <Input
              type="email"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Subscribe to Newsletter"}
          </Button>
        </form>
      </div>
    </div>
  );
};