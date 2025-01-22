import { RouterProvider, createHashRouter } from "react-router-dom";
import { routes } from "@/routes/routes";
import { ScrollToTop } from "@/components/ScrollToTop";
import { Toaster } from "@/components/ui/toaster";

// Create router with routes that preserve their original elements
const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ScrollToTop />
      <Toaster />
    </>
  );
}

export default App;