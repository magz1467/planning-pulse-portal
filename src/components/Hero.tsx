import { Stats } from "@/components/Stats";
import { SearchForm } from "@/components/SearchForm";
import Image from "@/components/ui/image";

export const Hero = () => {
  return (
    <div className="bg-gradient-to-b from-white to-gray-50 py-12 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold">
              <span className="text-primary">The smarter way</span> to track planning applications
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              Have your say on planning applications in your area.
            </p>
            <div className="bg-white rounded-xl shadow-sm p-2">
              <Stats />
            </div>
            <div className="bg-white rounded-xl shadow-sm">
              <SearchForm />
            </div>
          </div>
          
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
        </div>
      </div>
    </div>
  );
};