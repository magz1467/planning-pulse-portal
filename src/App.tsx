import { RouterProvider, createHashRouter } from "react-router-dom";
import { routes } from "@/routes/routes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

// Create router with routes
const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router}>
        <ScrollToTop />
      </RouterProvider>
      <Toaster />
    </>
  );
}

export default App;