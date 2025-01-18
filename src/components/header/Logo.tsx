import { Link } from "react-router-dom";

export const Logo = () => (
  <Link to="/" className="flex items-center gap-2">
    <span className="text-2xl font-bold font-playfair" 
      style={{
        color: "#f6c8cc", // Rose Quartz
        letterSpacing: "0.05em",
        textTransform: "lowercase"
      }}>
      nimbygram
    </span>
  </Link>
);