import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
            <Home className="h-6 w-6" />
            PlanningPulse
          </Link>
        </div>
      </div>
    </header>
  );
};