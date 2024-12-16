import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PlanningPulse
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link to="/services/residents" className="text-sm hover:text-primary">
              For Residents
            </Link>
            <Link to="/services/developers" className="text-sm hover:text-primary">
              For Developers
            </Link>
            <Link to="/services/councils" className="text-sm hover:text-primary">
              For Councils
            </Link>
            <Link to="/about" className="text-sm hover:text-primary">
              About
            </Link>
            <Link to="/contact" className="text-sm hover:text-primary">
              Contact
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;