import { useLocation } from "react-router-dom";
import { Logo } from "./header/Logo";
import { NavigationMenu } from "./header/NavigationMenu";
import { MobileMenu } from "./header/MobileMenu";

export const Header = () => {
  const location = useLocation();
  const isMapPage = location.pathname === "/map";

  if (isMapPage) {
    return null;
  }

  return (
    <header className="border-b bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Logo />
          <NavigationMenu />
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
};