import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const PlanningCTA = () => {
  const navigate = useNavigate();
  const TOWER_OF_LONDON_POSTCODE = "EC3N 4AB";

  const handleClick = () => {
    navigate('/map', { 
      state: { 
        postcode: TOWER_OF_LONDON_POSTCODE,
        tab: 'recent' 
      } 
    });
  };

  return (
    <div className="bg-primary/5 rounded-lg p-8 mt-12 text-center">
      <h3 className="text-2xl font-semibold mb-4">Ready to explore planning applications?</h3>
      <p className="text-gray-600 mb-6">Search for local planning applications in your area and stay informed about developments that matter to you.</p>
      <Button 
        onClick={handleClick}
        size="lg"
        className="bg-primary hover:bg-primary-dark text-white font-semibold"
      >
        See local planning applications now
      </Button>
    </div>
  );
};