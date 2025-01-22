import { createHashRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { routes } from "@/routes/routes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const router = createHashRouter(routes);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;