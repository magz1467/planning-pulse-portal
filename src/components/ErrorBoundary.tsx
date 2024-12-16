import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-screen bg-white">
          <h2 className="text-xl font-semibold mb-4">Something went wrong</h2>
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