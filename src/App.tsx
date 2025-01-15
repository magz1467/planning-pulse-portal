import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";
import IndexPage from "@/pages/index";
import ApplicationsDashboardMapPage from "@/pages/applications/dashboard/map";
import SavedApplicationsPage from "@/pages/saved";
import MapView from "@/pages/MapView";
import { AuthCallback } from "@/pages/auth/callback";

const router = createBrowserRouter([
  {
    path: "/",
    element: <IndexPage />,
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
  }
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;