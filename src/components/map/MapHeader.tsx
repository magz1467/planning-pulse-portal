import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export const MapHeader = () => {
  const [postcode, setPostcode] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (postcode.trim()) {
      // If we're already on the map page, reload with new state
      if (location.pathname === '/map') {
        navigate('/map', { 
          state: { postcode: postcode.trim() }, 
          replace: true 
        });
      } else {
        navigate('/map', { 
          state: { postcode: postcode.trim() } 
        });
      }
      
      toast({
        title: "Searching new location",
        description: `Showing results for ${postcode.trim()}`,
      });
    }
  };

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <Home className="h-6 w-6" />
            PlanningPulse
          </Link>
          
          <form onSubmit={handleSubmit} className="flex-1 max-w-2xl mx-4">
            <div className="relative w-full">
              <Input 
                type="text" 
                placeholder="Search new location" 
                className="w-full pl-4 pr-10 py-2"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
              <Button 
                type="submit" 
                size="icon" 
                variant="ghost" 
                className="absolute right-1 top-1/2 -translate-y-1/2"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
};