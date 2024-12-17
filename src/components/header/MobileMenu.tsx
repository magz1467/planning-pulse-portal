import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

export const MobileMenu = () => (
  <Sheet>
    <SheetTrigger asChild>
      <Button 
        variant="ghost" 
        size="icon"
        className="relative hover:bg-primary/10 transition-colors"
      >
        <Menu className="h-7 w-7 text-primary" strokeWidth={2.5} />
        <span className="sr-only">Open menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent>
      <div className="text-xl font-bold text-primary mb-6">
        Menu
      </div>
      <nav className="flex flex-col gap-4">
        <Link to="/services/residents" className="text-lg">
          Resident Services
        </Link>
        <Link to="/services/developers" className="text-lg">
          Developer Services
        </Link>
        <Link to="/services/councils" className="text-lg">
          Council Services
        </Link>
        <Link to="/about" className="text-lg">
          About
        </Link>
        <Link to="/contact" className="text-lg">
          Contact
        </Link>
        <div className="h-px bg-gray-200 my-4" />
        <Link to="/auth">
          <Button variant="outline" className="w-full mb-3">
            Sign In
          </Button>
        </Link>
        <Link to="/auth?mode=signup">
          <Button variant="default" className="w-full mb-4">
            Create Account
          </Button>
        </Link>
      </nav>
    </SheetContent>
  </Sheet>
);