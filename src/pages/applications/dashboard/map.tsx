import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ApplicationsDashboardMap } from "@/components/applications/dashboard/ApplicationsDashboardMap";
import { BrowserRouter } from "react-router-dom";

const ApplicationsDashboardMapPage = () => {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ApplicationsDashboardMap />
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default ApplicationsDashboardMapPage;