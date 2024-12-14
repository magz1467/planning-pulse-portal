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
              Have your say on planning applications in your area.
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

        <div className="mt-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">
            The easy way to have your say on local developments
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">1. Easily search and view local applications</h3>
              <p className="text-gray-600">Find and explore planning applications in your area with our simple search tools.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">2. Easily comment and feedback to the developer</h3>
              <p className="text-gray-600">Share your thoughts and concerns directly with developers through our platform.</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="text-lg font-semibold mb-3">3. Feedback automatically submitted to the local authority</h3>
              <p className="text-gray-600">Your feedback is automatically forwarded to the relevant local authority for consideration.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;