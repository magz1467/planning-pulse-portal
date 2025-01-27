import Image from "@/components/ui/image";
import { useEffect, useState } from "react";

const loadingMessages = [
  "Gathering planning applications...",
  "Analyzing local developments...",
  "Calculating impact scores...",
  "Almost there..."
];

export const LoadingOverlay = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 shadow-2xl max-w-2xl mx-4 relative overflow-hidden">
        {/* Gradient background effect with brand colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#47463f] via-[#8bc5be] to-white opacity-10" />
        
        <div className="relative flex flex-col items-center gap-8">
          {/* Logo/Image */}
          <div className="relative w-64 h-64">
            <div className="absolute inset-0 bg-[#af5662]/20 rounded-full animate-ping" />
            <Image 
              src="/lovable-uploads/a8a9d54b-25b5-4131-a1c4-6efb44c62d0f.png"
              alt="Planning Pulse Logo"
              className="w-64 h-64 rounded-full object-cover border-4 border-[#8bc5be] animate-pulse"
              width={256}
              height={256}
            />
          </div>

          {/* Loading message with animation */}
          <div className="space-y-4 text-center">
            <h3 className="text-3xl font-playfair text-[#47463f]">
              Searching Your Area
            </h3>
            <p className="text-sm text-gray-600 max-w-sm font-lora min-h-[40px] transition-all duration-300">
              {loadingMessages[messageIndex]}
            </p>
          </div>

          {/* Stylized loading spinner */}
          <div 
            className="w-12 h-12 border-4 border-[#8bc5be] border-t-transparent rounded-full animate-spin"
            style={{
              boxShadow: '0 4px 6px -1px rgba(139, 197, 190, 0.1), 0 2px 4px -1px rgba(139, 197, 190, 0.06)'
            }}
          />
        </div>
      </div>
    </div>
  );
};