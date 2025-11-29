"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { logger } from "@/lib/logger";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * Error Boundary Component
 * Catches React rendering errors and provides fallback UI
 * Logs errors using structured logger for observability
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to structured logger
    logger.error(
      "React Error Boundary caught an error",
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: "RootErrorBoundary",
      },
      error,
    );

    // Track error event for analytics
    logger.trackEvent("error_boundary_triggered", {
      errorMessage: error.message,
      errorName: error.name,
    });
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: undefined });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900">
              Oops! Something went wrong
            </h1>
            <p className="mb-6 text-gray-600">
              We encountered an unexpected error. Please try refreshing the
              page.
            </p>
            {process.env.NODE_ENV === "development" && this.state.error && (
              <div className="mb-6 rounded-lg bg-red-50 p-4 text-left">
                <p className="mb-2 font-mono text-sm text-red-800">
                  {this.state.error.message}
                </p>
                {this.state.error.stack && (
                  <pre className="overflow-auto text-xs text-red-600">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700"
              >
                Refresh Page
              </button>
              <button
                onClick={this.handleReset}
                className="rounded-lg bg-gray-200 px-6 py-2 text-gray-800 transition-colors hover:bg-gray-300"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
