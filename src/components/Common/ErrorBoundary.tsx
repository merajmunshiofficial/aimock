import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
          <div className="max-w-md w-full bg-base-100 rounded-lg shadow-xl p-6">
            <div className="text-center">
              <div className="text-error text-6xl mb-4">💥</div>
              <h1 className="text-2xl font-bold text-error mb-4">Something went wrong</h1>
              <p className="text-base-content/70 mb-6">
                We're sorry, but something unexpected happened. Please try refreshing the page.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mb-4 text-left">
                  <summary className="cursor-pointer text-sm font-medium text-base-content/60 mb-2">
                    Error Details (Development)
                  </summary>
                  <div className="bg-base-200 p-3 rounded text-xs font-mono overflow-auto max-h-40">
                    <div className="text-error font-bold mb-2">{this.state.error.name}: {this.state.error.message}</div>
                    <div className="text-base-content/60">{this.state.error.stack}</div>
                    {this.state.errorInfo && (
                      <div className="mt-2 pt-2 border-t border-base-300">
                        <div className="font-bold mb-1">Component Stack:</div>
                        <div>{this.state.errorInfo.componentStack}</div>
                      </div>
                    )}
                  </div>
                </details>
              )}

              <div className="flex gap-2 justify-center">
                <button 
                  className="btn btn-primary"
                  onClick={() => window.location.reload()}
                >
                  Refresh Page
                </button>
                <button 
                  className="btn btn-ghost"
                  onClick={() => this.setState({ hasError: false, error: undefined, errorInfo: undefined })}
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export const useErrorHandler = () => {
  return (error: Error, errorInfo?: string) => {
    console.error('Error caught by useErrorHandler:', error, errorInfo);
    // You could also send this to an error reporting service
  };
};

// Simple error display component
export const ErrorDisplay: React.FC<{
  error: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}> = ({ error, onRetry, onDismiss }) => {
  return (
    <div className="alert alert-error shadow-lg">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>{error}</span>
      </div>
      <div className="flex-none">
        {onRetry && (
          <button className="btn btn-sm btn-ghost" onClick={onRetry}>
            Retry
          </button>
        )}
        {onDismiss && (
          <button className="btn btn-sm btn-ghost" onClick={onDismiss}>
            ✕
          </button>
        )}
      </div>
    </div>
  );
};
