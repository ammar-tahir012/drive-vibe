import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NotFoundPage = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/5 blur-[120px] rounded-full" />
      </div>
      
      <h1 className="font-display text-white text-9xl font-bold mb-4 animate-fade-up">404</h1>
      <div className="w-16 h-px bg-brand-gold mb-8 animate-fade-up delay-200" />
      
      <h2 className="font-display text-white text-3xl mb-4 animate-fade-up delay-300">Lost in Transit</h2>
      <p className="text-white/60 font-body max-w-md mb-4 animate-fade-up delay-500">
        The destination you're looking for doesn't exist. Maybe it's time to head back to the main road.
      </p>

      {/* Diagnostic Info */}
      <div className="mb-12 px-4 py-2 bg-white/5 rounded-lg border border-white/5 animate-fade-up delay-600">
        <p className="text-[10px] font-body uppercase tracking-[0.2em] text-white/30 mb-1">Attempted Route</p>
        <code className="text-brand-gold text-xs">{location.pathname}</code>
      </div>
      
      <Link 
        to="/" 
        className="px-10 py-4 bg-brand-gold text-brand-dark rounded-full font-bold hover:scale-105 active:scale-95 transition-all shadow-glow animate-fade-up delay-700"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
