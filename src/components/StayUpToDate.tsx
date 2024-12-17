import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PostcodeSearch } from "@/components/PostcodeSearch";
import { useToast } from "@/components/ui/use-toast";
import { Facebook, Mail } from "lucide-react";

const StayUpToDate = () => {
  const [postcode, setPostcode] = useState("");
  const [areaEmail, setAreaEmail] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const { toast } = useToast();

  const handleAreaSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode || !areaEmail) return;
    
    toast({
      title: "Successfully subscribed!",
      description: "You'll receive updates about new planning applications in your area.",
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
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-4">Local Updates</h3>
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

            {/* Newsletter Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-4">Monthly Newsletter</h3>
              <p className="text-gray-600 mb-6">Stay informed about the latest trends and changes in planning.</p>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
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

            {/* Social Media Section */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
              <p className="text-gray-600 mb-6">Join our community on social media for daily updates and discussions.</p>
              <div className="space-y-4">
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
  );
};

export default StayUpToDate;