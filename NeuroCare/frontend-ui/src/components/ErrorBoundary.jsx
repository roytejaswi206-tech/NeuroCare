import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-neuro-dark flex items-center justify-center p-4">
          <div className="glass-card max-w-xl p-8 text-center">
            <h1 className="text-3xl font-bold text-neuro-accent mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-6">
              The app encountered an unexpected issue. Refresh the page or try again later.
            </p>
            <button
              className="neon-button text-white px-6 py-3"
              onClick={() => window.location.reload()}
            >
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
