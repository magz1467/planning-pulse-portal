import { SearchForm } from "@/components/SearchForm";
import { Stats } from "@/components/Stats";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="text-primary">The smarter way</span> to track planning applications
            </h1>
            <p className="text-gray-600 mb-6 text-sm md:text-base">
              Stay informed about planning applications in your area. Join over 50,000 residents and participate in your community's development.
            </p>
            <Stats />
            <SearchForm />
          </div>
          
          <div className="hidden md:block">
            <img 
              src="/placeholder.svg"
              alt="Architect reviewing development plans" 
              className="rounded-lg shadow-xl w-full h-auto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;