import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Mail } from "lucide-react";
import Image from "@/components/ui/image";

const StayUpToDate = () => {
  const [postcode, setPostcode] = useState("");
  const [areaEmail, setAreaEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { toast } = useToast();

  const handleAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode || !areaEmail) {
      toast({
        title: "Error",
        description: "Please enter both a postcode and email address.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(areaEmail)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "Verification email sent",
      description: "Please check your inbox to confirm your subscription.",
    });
    setPostcode("");
    setAreaEmail("");
  };

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
    <div className="bg-gray-50 py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">Stay Up to Date</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Area Updates Section */}
            <div className="flex flex-col rounded-xl p-8 border-2 border-[#F2FCE2]">
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
                  <Button type="submit" className="w-full">Get Area Updates</Button>
                </form>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="flex flex-col rounded-xl p-8 border-2 border-[#D3E4FD]">
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

            {/* Social Media Section */}
            <div className="flex flex-col rounded-xl p-8 border-2 border-[#FDE1D3]">
              <div className="mb-6 h-48 overflow-hidden rounded-lg">
                <Image
                  src="/lovable-uploads/abb1ba01-758b-471b-a769-5607e42a106b.png"
                  alt="Nextdoor community"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
                <p className="text-gray-600 mb-6">Join our community on social media for daily updates and discussions.</p>
                <div className="space-y-4 mt-auto">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#1877F2] text-white py-2 px-4 rounded-lg hover:bg-[#1659c7] transition-colors"
                  >
                    <Facebook className="w-5 h-5" />
                    Follow on Facebook
                  </a>
                  <a 
                    href="https://nextdoor.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-[#00B636] text-white py-2 px-4 rounded-lg hover:bg-[#009e2f] transition-colors"
                  >
                    <Mail className="w-5 h-5" />
                    Join on Nextdoor
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StayUpToDate;