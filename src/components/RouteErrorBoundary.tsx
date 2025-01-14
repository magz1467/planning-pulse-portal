import { useRouteError, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { HomeIcon, RefreshCw } from "lucide-react";

export function RouteErrorBoundary() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-8 text-center">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Oops!</h1>
          <p className="text-lg text-muted-foreground">
            Sorry, an unexpected error has occurred. Please try refreshing the page or going back home.
          </p>
        </div>
        
        <div className="flex gap-4 justify-center">
          <Button 
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Page
          </Button>
          
          <Button asChild>
            <Link to="/">
              <HomeIcon className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}