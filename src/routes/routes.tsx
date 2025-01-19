import { RouteObject } from "react-router-dom";
import { mainRoutes } from "./mainRoutes";
import { applicationRoutes } from "./applicationRoutes";
import { contentRoutes } from "./contentRoutes";
import { serviceRoutes } from "./serviceRoutes";
import { legalRoutes } from "./legalRoutes";
import { authRoutes } from "./authRoutes";

export const routes: RouteObject[] = [
  ...mainRoutes,
  ...applicationRoutes,
  ...contentRoutes,
  ...serviceRoutes,
  ...legalRoutes,
  ...authRoutes,
];