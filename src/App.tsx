import { createHashRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { routes } from "@/routes/routes";
import { ScrollToTop } from "@/components/ScrollToTop";

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