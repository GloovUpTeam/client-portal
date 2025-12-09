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

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
          <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-xl p-6 shadow-2xl">
            <div className="flex items-center gap-3 mb-4 text-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-bold text-white">Application Error</h2>
            </div>
            
            <div className="bg-black/50 rounded-lg p-4 mb-6 overflow-auto max-h-48 border border-neutral-800">
              <p className="text-red-400 font-mono text-sm break-words">
                {this.state.error?.message || 'An unexpected error occurred.'}
              </p>
              {this.state.errorInfo && (
                <pre className="text-neutral-500 text-xs mt-2 overflow-x-auto">
                  {this.state.errorInfo.componentStack}
                </pre>
              )}
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex-1 bg-brand text-brand-black font-bold py-2 px-4 rounded-lg hover:bg-brand-dark transition-colors"
              >
                Reload Application
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: undefined })}
                className="flex-1 bg-neutral-800 text-white font-medium py-2 px-4 rounded-lg hover:bg-neutral-700 transition-colors border border-neutral-700"
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
