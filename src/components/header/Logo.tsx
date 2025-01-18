import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <span className="text-2xl font-bold" 
      style={{
        fontFamily: "'Caveat', cursive",
        letterSpacing: "0.05em",
        textShadow: "2px 2px 4px rgba(249, 115, 22, 0.2)",
        background: "linear-gradient(45deg, #F97316, #FEC6A1)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textTransform: "uppercase"
      }}>
      Nimbygram
    </span>
  </Link>
);