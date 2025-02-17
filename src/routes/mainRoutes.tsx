import Index from "@/pages/Index";
import About from "@/pages/About";
import Press from "@/pages/Press";
import Profile from "@/pages/Profile";
import Help from "@/pages/Help";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const mainRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/about",
    element: <About />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/press",
    element: <Press />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/profile",
    element: <Profile />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/help",
    element: <Help />,
    errorElement: <RouteErrorBoundary />,
  },
];
