import { Search, MessageSquare, Send } from "lucide-react";

export const Features = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">
          The easy way to have your say on local developments
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Search className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-3">1. Easily search and view local applications</h3>
            <p className="text-gray-600">Find and explore planning applications in your area with our simple search tools.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-3">2. Easily comment and feedback to the developer</h3>
            <p className="text-gray-600">Share your thoughts and concerns directly with developers through our platform.</p>
          </div>
          <div className="bg-gray-50 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <Send className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-3">3. Feedback automatically submitted to the local authority</h3>
            <p className="text-gray-600">Your feedback is automatically forwarded to the relevant local authority for consideration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};