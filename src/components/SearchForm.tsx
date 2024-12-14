import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const SearchForm = () => {
  return (
    <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-6">
        <Button variant="outline" className="flex-1 bg-primary-light text-primary hover:bg-primary hover:text-white">
          Recent
        </Button>
        <Button variant="outline" className="flex-1">
          Major Projects
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