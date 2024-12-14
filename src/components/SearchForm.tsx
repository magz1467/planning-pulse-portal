import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MessageSquare, Send } from "lucide-react";

export const SearchForm = () => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
      {/* Icons Section */}
      <div className="grid grid-cols-3 gap-8 mb-6">
        <div className="text-center">
          <Search className="w-12 h-12 text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-600">Search Applications</p>
        </div>
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-600">Comment & Feedback</p>
        </div>
        <div className="text-center">
          <Send className="w-12 h-12 text-primary mx-auto mb-2" />
          <p className="text-sm text-gray-600">Submit to Authority</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="flex gap-4 mb-6">
        <Button variant="outline" className="flex-1 bg-primary-light text-primary hover:bg-primary hover:text-white">
          Recent
        </Button>
        <Button variant="outline" className="flex-1">
          Completed
        </Button>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">Search location</label>
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Enter a postcode" 
              className="w-full pl-4 pr-10 py-3 border rounded-md"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
        </div>
        
        <Button className="w-full bg-primary hover:bg-primary-dark text-white py-6">
          Show planning applications
        </Button>
      </div>
    </div>
  );
};