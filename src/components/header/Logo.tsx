import { Home } from "lucide-react";
import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <Home className="h-6 w-6 text-primary" />
    <span className="text-2xl font-bold text-primary" 
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
);