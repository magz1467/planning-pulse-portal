import { useEffect } from 'react';
import { initializeFirestore } from './integrations/firebase/firestore';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/providers/AuthProvider";
import { SavedApplicationsProvider } from "@/providers/SavedApplicationsProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazy, Suspense } from "react";
import { LoadingScreen } from "@/components/LoadingScreen";

const Home = lazy(() => import("@/pages/Home"));
const MapView = lazy(() => import("@/pages/MapView"));
const SavedApplications = lazy(() => import("@/pages/SavedApplications"));
const ApplicationsDashboardMapPage = lazy(() => import("@/pages/applications/dashboard/map"));

function App() {
  useEffect(() => {
    initializeFirestore();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <SavedApplicationsProvider>
            <Suspense fallback={<LoadingScreen />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<MapView />} />
                <Route path="/saved" element={<SavedApplications />} />
                <Route path="/applications/dashboard/map" element={<ApplicationsDashboardMapPage />} />
              </Routes>
            </Suspense>
            <Toaster />
          </SavedApplicationsProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;