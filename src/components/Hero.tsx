import { HeroContent } from "./hero/HeroContent";
import { HeroImage } from "./hero/HeroImage";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-accent to-background py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <HeroContent />
          <HeroImage />
        </div>
      </div>
    </div>
  );
};