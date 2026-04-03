import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * CityCard: Optimized for 100% Visual Reliability.
 * Uses high-quality Unsplash city photos to guarantee a "WOW" first impression,
 * removing any flaky YouTube thumbnail dependencies on the Home Page.
 */
const CityCard = ({ cityName, countryCode, countryName }) => {
  const navigate = useNavigate();

  // Primary: Thematic night/cinematic photo of the city
  // Secondary: Architecture-based fallback
  const cityPhotoUrl = `https://source.unsplash.com/800x600/?${encodeURIComponent(cityName)},city,night,cinematic`;

  const handleClick = () => {
    if (cityName && countryCode) {
      navigate(`/city/${encodeURIComponent(cityName)}/${encodeURIComponent(countryCode)}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative aspect-[3/4] md:aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer bg-surface h-full transform transition-all duration-700 hover:scale-[1.03] hover:shadow-glow border border-white/5"
    >
      {/* 100% RELIABLE VISUAL LAYER (Unsplash) */}
      <img 
        src={cityPhotoUrl}
        alt={cityName}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 grayscale-[40%] group-hover:grayscale-0 group-hover:scale-110"
        onError={(e) => {
            // Ultimate fallback to a generic premium drive photo
            e.target.src = "https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?q=80&w=800&auto=format&fit=crop";
        }}
      />

      {/* Cinematic Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-brand-gold/5 mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Interactive Driving Pill */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="bg-brand-gold text-brand-dark px-8 py-3 rounded-full font-bold text-sm tracking-[0.2em] flex items-center gap-2 transform translate-y-8 group-hover:translate-y-0 transition-all duration-500 shadow-glow uppercase">
          <span className="text-[10px]">▶</span>
          <span>Start Driving</span>
        </div>
      </div>

      {/* City Information */}
      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-display text-white text-2xl md:text-3xl leading-tight group-hover:text-brand-gold transition-colors duration-300">
            {cityName}
          </h3>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse shadow-[0_0_12px_rgba(232,201,122,0.8)]" />
            <span className="text-white/60 text-[10px] md:text-xs font-body font-bold uppercase tracking-[0.3em] leading-none">
              {countryName}
            </span>
          </div>
        </div>
      </div>

      {/* Corner Status (Visual Polish) */}
      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <div className="px-3 py-1 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
           <span className="text-white/50 text-[10px] font-bold uppercase tracking-widest">LIVE</span>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
