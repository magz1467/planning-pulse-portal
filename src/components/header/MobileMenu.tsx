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
        <div className="h-px bg-gray-200 my-2" />
        <Link to="/auth" className="text-lg">
          Sign In
        </Link>
        <Link to="/auth?mode=signup" className="text-lg">
          Create Account
        </Link>
        <Link to="/privacy" className="text-lg">
          Privacy
        </Link>
      </nav>
    </SheetContent>
  </Sheet>
);