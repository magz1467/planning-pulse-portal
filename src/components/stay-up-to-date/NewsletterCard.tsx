import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import Image from "@/components/ui/image";

export const NewsletterCard = () => {
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { toast } = useToast();

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    
    toast({
      title: "Newsletter subscription confirmed",
      description: "You're now subscribed to our monthly planning trends newsletter.",
    });
    setNewsletterEmail("");
  };

  return (
    <div className="flex flex-col rounded-xl p-8 border-2 border-[#D3E4FD] h-full">
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
          <Button type="submit" className="w-full">Subscribe to Newsletter</Button>
        </form>
      </div>
    </div>
  );
};