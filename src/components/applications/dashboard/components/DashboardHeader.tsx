import { Link, useNavigate } from "react-router-dom";

export const DashboardHeader = () => {
  const navigate = useNavigate();

  return (
    <header className="bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold font-playfair" 
              style={{
                color: "#C8A7A2", // Dusty Rose
                letterSpacing: "0.05em",
                textTransform: "lowercase"
              }}>
              nimbygram
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
};