import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleAuthAction = async () => {
    if (isAuthenticated) {
      await supabase.auth.signOut();
      navigate("/");
    } else {
      navigate("/auth");
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-primary">Planning Pulse</span>
            </Link>
          </div>
          
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col gap-4 mt-6">
                  <Link
                    to="/about"
                    className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  >
                    About
                  </Link>
                  <Link
                    to="/services/developers"
                    className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  >
                    For Developers
                  </Link>
                  <Link
                    to="/services/councils"
                    className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  >
                    For Councils
                  </Link>
                  <Link
                    to="/map"
                    className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                  >
                    Map
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={handleAuthAction}
                    className="justify-start p-0 h-auto hover:bg-transparent"
                  >
                    <span className="text-lg font-medium text-gray-900 hover:text-primary">
                      {isAuthenticated ? "Sign out" : "Sign in"}
                    </span>
                  </Button>
                  {!isAuthenticated && (
                    <Link
                      to="/auth"
                      className="text-lg font-medium text-gray-900 hover:text-primary transition-colors"
                    >
                      Create account
                    </Link>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;