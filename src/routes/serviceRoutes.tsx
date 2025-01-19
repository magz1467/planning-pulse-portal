import ResidentServices from "@/pages/ResidentServices";
import DeveloperServices from "@/pages/DeveloperServices";
import CouncilServices from "@/pages/CouncilServices";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const serviceRoutes: RouteObject[] = [
  {
    path: "/resident-services",
    element: <ResidentServices />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/developer-services",
    element: <DeveloperServices />,
    errorElement: <RouteErrorBoundary />,
  },
  {
    path: "/council-services",
    element: <CouncilServices />,
    errorElement: <RouteErrorBoundary />,
  },
];