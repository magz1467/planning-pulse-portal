import { Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <Home className="h-6 w-6 text-primary" />
            <span className="text-2xl font-bold" 
              style={{
                fontFamily: "'Inter', sans-serif",
                letterSpacing: "0.05em",
                textShadow: "2px 2px 4px rgba(16, 185, 129, 0.2)",
                background: "linear-gradient(45deg, #10B981, #065F46)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                textTransform: "uppercase"
              }}>
              Nimbygram
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};