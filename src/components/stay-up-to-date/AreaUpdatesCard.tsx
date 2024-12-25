import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { useToast } from "@/hooks/use-toast";
import Image from "@/components/ui/image";
import { supabase } from "@/integrations/supabase/client";

export const AreaUpdatesCard = () => {
  const [postcode, setPostcode] = useState("");
  const [areaEmail, setAreaEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleAreaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!postcode || !areaEmail) {
      toast({
        title: "Error",
        description: "Please enter both a postcode and email address.",
        variant: "destructive"
      });
      return;
    }

    if (!validateEmail(areaEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('User_data')
        .insert({
          Email: areaEmail,
          Post_Code: postcode,
          Marketing: true,
          Type: 'area_updates'
        });

      if (error) {
        console.error('Error saving subscription:', error);
        toast({
          title: "Subscription failed",
          description: "There was a problem subscribing to updates. Please try again.",
          variant: "destructive"
        });
        return;
      }
      
      toast({
        title: "Success!",
        description: "You've been subscribed to local updates.",
      });
      setPostcode("");
      setAreaEmail("");
    } catch (error) {
      console.error('Error saving subscription:', error);
      toast({
        title: "Subscription failed",
        description: "There was a problem subscribing to updates. Please try again.",
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
          src="/lovable-uploads/6492526a-800c-4702-a7f5-544d42447cc7.png"
          alt="Community engagement"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4">Local Updates</h3>
        <p className="text-gray-600 mb-6">Get a notification when a new application goes live near you</p>
        <form onSubmit={handleAreaSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Your postcode</label>
            <PostcodeSearch
              onSelect={setPostcode}
              placeholder="Enter postcode"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email address</label>
            <Input
              type="email"
              value={areaEmail}
              onChange={(e) => setAreaEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Subscribing..." : "Get Area Updates"}
          </Button>
        </form>
      </div>
    </div>
  );
};