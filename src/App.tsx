import { RouterProvider, createHashRouter } from "react-router-dom";
import { routes } from "@/routes/routes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

// Wrap each route with ScrollToTop
const routesWithScroll = routes.map(route => ({
  ...route,
  element: (
    <>
      <ScrollToTop />
      {route.element}
    </>
  ),
}));

// Create router with wrapped routes
const router = createHashRouter(routesWithScroll);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;