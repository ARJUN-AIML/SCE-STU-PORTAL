import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallbackMessage?: string;
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
    console.error("[ErrorBoundary] Caught an error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-6 bg-surface border border-border rounded-xl text-center h-full w-full min-h-[150px]">
          <div className="h-10 w-10 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mb-3">
             <AlertTriangle className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-semibold text-text mb-1">Widget Unavailable</h3>
          <p className="text-xs text-muted mb-4 max-w-[200px]">
             {this.props.fallbackMessage || "We encountered an issue loading this module."}
          </p>
          <Button 
             variant="outline" 
             size="sm" 
             onClick={() => this.setState({ hasError: false })}
             className="text-xs h-8"
          >
             <RefreshCw className="h-3 w-3 mr-1.5" /> Try Again
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
