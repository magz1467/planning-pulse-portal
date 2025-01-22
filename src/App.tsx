import { createHashRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { routes } from "@/routes/routes";
import { ScrollToTop } from "@/components/ScrollToTop";

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