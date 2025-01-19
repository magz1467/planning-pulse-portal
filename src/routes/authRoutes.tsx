import { AuthCallback } from "@/pages/auth/callback";
import { RouteObject } from "react-router-dom";
import { RouteErrorBoundary } from "@/components/RouteErrorBoundary";

export const authRoutes: RouteObject[] = [
  {
    path: "/auth/callback",
    element: <AuthCallback />,
    errorElement: <RouteErrorBoundary />,
  },
];