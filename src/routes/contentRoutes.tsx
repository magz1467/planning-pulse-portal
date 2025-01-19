import LocalPlans from "@/pages/content/LocalPlans";
import PlanningBasics from "@/pages/content/PlanningBasics";
import PlanningAppeals from "@/pages/content/PlanningAppeals";
import SustainableDevelopment from "@/pages/content/SustainableDevelopment";
import HeritageConservation from "@/pages/content/HeritageConservation";
import PlanningAuthorities from "@/pages/content/PlanningAuthorities";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const contentRoutes: RouteObject[] = [
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
];