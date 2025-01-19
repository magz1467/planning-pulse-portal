import Cookies from "@/pages/Cookies";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import Investors from "@/pages/Investors";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const legalRoutes: RouteObject[] = [
  {
    path: "/cookies",
    element: <Cookies />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/contact",
    element: <Contact />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/careers",
    element: <Careers />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/investors",
    element: <Investors />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/terms",
    element: <Terms />,
    errorElement: <RouteErrorBoundary />,
  },
];