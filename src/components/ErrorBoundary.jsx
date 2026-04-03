import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DriveVibes Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 blur-[120px] rounded-full" />
          </div>
          
          <h2 className="font-display text-white text-3xl mb-4">Something went wrong.</h2>
          <p className="text-white/60 font-body max-w-md mb-12">
            The engine stalled, but we're working on getting you back on the road.
          </p>
          
          <button 
            onClick={() => window.location.reload()} 
            className="px-10 py-4 bg-brand-gold text-brand-dark rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-glow"
          >
            Restart Engine
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
