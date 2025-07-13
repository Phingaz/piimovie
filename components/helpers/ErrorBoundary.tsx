'use client';

import React from 'react';
import { logger } from '@/lib/logger';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: React.ErrorInfo;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({ errorInfo });

    // Log the error
    logger.error(
      'React component error caught by boundary',
      {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name,
      },
      error,
    );

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      const { fallback: Fallback } = this.props;

      if (Fallback && this.state.error) {
        return <Fallback error={this.state.error} resetError={this.resetError} />;
      }

      return <DefaultErrorFallback error={this.state.error} resetError={this.resetError} />;
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error?: Error;
  resetError: () => void;
}

function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex h-[calc(100svh-225px)] flex-col items-center justify-center p-8 text-center">
      <div className="mx-auto bg-gray-800 p-6 rounded-lg shadow-lg text-white text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
        <p className="text-gray-300 mb-6">
          We apologize for the inconvenience. Please try refreshing the page or contact support if the problem persists.
        </p>
        {process.env.NODE_ENV === 'development' && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              Error Details (Development)
            </summary>
            <pre className="mt-2 whitespace-pre-wrap text-xs text-red-600 bg-red-50 p-2 rounded">
              {error.message}
              {error.stack && `\n\n${error.stack}`}
            </pre>
          </details>
        )}
        <div className="space-x-4">
          <Button onClick={resetError} variant="secondary" className="rounded-sm h-[45px] bg-gray-200 text-gray-800">
            Try Again
          </Button>
          <Button onClick={() => window.location.reload()} variant="outline" className="h-[45px] rounded-sm">
            Refresh Page
          </Button>
        </div>
      </div>
    </div>
  );
}

// Hook for async error handling
export function useErrorHandler() {
  return (error: unknown, context?: Record<string, unknown>) => {
    logger.error('Async error in component', context, error);

    toast.error('An unexpected error occurred. Please try again later.', {
      description: error instanceof Error ? error.message : String(error),
    });
  };
}
