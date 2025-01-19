import Index from "@/pages/Index";
import About from "@/pages/About";
import Press from "@/pages/Press";
import Admin2 from "@/pages/Admin2";
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
    path: "/admin2",
    element: <Admin2 />,
    errorElement: <RouteErrorBoundary />,
  },
];