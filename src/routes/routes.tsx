import Index from "@/pages/Index";
import ApplicationsDashboardMapPage from "@/pages/applications/dashboard/map";
import SavedApplicationsPage from "@/pages/saved";
import MapView from "@/pages/MapView";
import { AuthCallback } from "@/pages/auth/callback";
import LocalPlans from "@/pages/content/LocalPlans";
import PlanningBasics from "@/pages/content/PlanningBasics";
import PlanningAppeals from "@/pages/content/PlanningAppeals";
import SustainableDevelopment from "@/pages/content/SustainableDevelopment";
import HeritageConservation from "@/pages/content/HeritageConservation";
import PlanningAuthorities from "@/pages/content/PlanningAuthorities";
import Cookies from "@/pages/Cookies";
import Contact from "@/pages/Contact";
import Careers from "@/pages/Careers";
import Investors from "@/pages/Investors";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import About from "@/pages/About";
import Press from "@/pages/Press";
import Admin2 from "@/pages/Admin2";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/applications/dashboard/map",
    element: <ApplicationsDashboardMapPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/saved",
    element: <SavedApplicationsPage />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/map",
    element: <MapView />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/content/local-plans",
    element: <LocalPlans />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/content/planning-basics",
    element: <PlanningBasics />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/content/planning-appeals",
    element: <PlanningAppeals />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/content/sustainable-development",
    element: <SustainableDevelopment />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/content/heritage-conservation",
    element: <HeritageConservation />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/content/planning-authorities",
    element: <PlanningAuthorities />,
    errorElement: <RouteErrorBoundary />,
  },
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
  }
];