import Image from "@/components/ui/image";

export const HeroImage = () => {
  return (
    <div className="hidden md:flex items-center">
      <Image 
        src="/lovable-uploads/2dfd74e5-fc91-48b5-bbeb-34d3332bd7d6.png"
        alt="Three women checking their phones in a picturesque village setting" 
        className="rounded-lg shadow-xl w-full h-auto object-cover"
        loading="eager"
        width={300}
        height={225}
      />
    </div>
  );
};