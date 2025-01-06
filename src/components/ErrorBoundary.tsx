import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw, Map } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      const isMapError = this.state.error?.message?.includes('map') || 
                        this.state.error?.message?.includes('Mapbox') ||
                        this.state.error?.stack?.includes('map');

      return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
          <div className="mb-6">
            {isMapError ? (
              <Map className="w-16 h-16 text-gray-400" />
            ) : (
              <RefreshCcw className="w-16 h-16 text-gray-400" />
            )}
          </div>
          <h2 className="text-xl font-semibold mb-2">
            {isMapError ? 'Map failed to load' : 'Something went wrong'}
          </h2>
          <p className="text-gray-600 mb-4 text-center max-w-md">
            {isMapError 
              ? 'There was an issue loading the map. Please check your internet connection and try again.'
              : 'An unexpected error occurred. Please try reloading the page.'}
          </p>
          <Button
            onClick={() => {
              this.setState({ hasError: false });
              window.location.reload();
            }}
            className="flex items-center gap-2"
          >
            <RefreshCcw className="h-4 w-4" />
            Reload page
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}