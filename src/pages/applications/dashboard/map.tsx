import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ApplicationsDashboardMap } from "@/components/applications/dashboard/ApplicationsDashboardMap";

export default function ApplicationsDashboardMapPage() {
  return (
    <ErrorBoundary>
      <ApplicationsDashboardMap />
    </ErrorBoundary>
  );
}