import Image from "@/components/ui/image";

export const HeroImage = () => {
  return (
    <div className="hidden md:flex items-center">
      <Image 
        src="/lovable-uploads/c21e23a0-f1e5-43ef-b085-aff9c1f2fa76.png"
        alt="Professional in construction safety gear reviewing plans on tablet" 
        className="rounded-lg shadow-xl w-full h-auto object-cover"
        loading="eager"
        width={800}
        height={600}
      />
    </div>
  );
};