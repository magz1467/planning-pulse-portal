import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import MapView from "./pages/MapView";
import ResidentServices from "./pages/ResidentServices";
import DeveloperServices from "./pages/DeveloperServices";
import CouncilServices from "./pages/CouncilServices";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/services/residents" element={<ResidentServices />} />
          <Route path="/services/developers" element={<DeveloperServices />} />
          <Route path="/services/councils" element={<CouncilServices />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;