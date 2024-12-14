import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@/components/ui/navigation-menu";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary">
            PlanningPulse
          </Link>
          
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium leading-none">For Residents</h4>
                      <p className="text-sm text-muted-foreground">Search and comment on local planning applications</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium leading-none">For Developers</h4>
                      <p className="text-sm text-muted-foreground">Submit and manage planning applications</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium leading-none">For Local Authorities</h4>
                      <p className="text-sm text-muted-foreground">Streamline your planning process</p>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/about" className="px-4 py-2">About</Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link to="/contact" className="px-4 py-2">Contact</Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;