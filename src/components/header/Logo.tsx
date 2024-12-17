import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="text-2xl font-bold text-primary flex items-center gap-2">
    <Home className="h-6 w-6" />
    PlanningPulse
  </Link>
);