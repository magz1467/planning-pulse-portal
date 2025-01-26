import ApplicationsDashboardMapPage from "@/pages/applications/dashboard/map";
import SavedApplicationsPage from "@/pages/saved";
import MapView from "@/pages/MapView";
import Map2View from "@/pages/Map2View";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const applicationRoutes: RouteObject[] = [
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
    path: "/map2",
    element: <Map2View />,
    errorElement: <RouteErrorBoundary />,
  },
];