import { Facebook, Mail } from "lucide-react";
import Image from "@/components/ui/image";

export const SocialMediaCard = () => {
  return (
    <div className="flex flex-col rounded-xl p-8 border border-gray-200 h-full bg-white">
      <div className="mb-6 h-48 overflow-hidden rounded-lg">
        <Image
          src="/lovable-uploads/563eae08-0970-4eea-ae24-693638dcd50b.png"
          alt="Nextdoor community"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-grow">
        <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
        <p className="text-gray-600 mb-6">Join our community on social media for daily updates and discussions.</p>
        <div className="space-y-4 mt-auto">
          <a 
            href="https://www.facebook.com/profile.php?id=61570929167355" 
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
  );
};