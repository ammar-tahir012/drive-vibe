import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchDrivingVideos } from '../api/youtube';

const CityCard = ({ cityName, countryCode, countryName }) => {
  const [thumbnail, setThumbnail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchThumbnail = async () => {
      try {
        const videos = await searchDrivingVideos(cityName);
        if (videos && videos.length > 0) {
          setThumbnail(videos[0].thumbnail);
        }
      } catch (error) {
        console.error(`Failed to fetch thumbnail for ${cityName}:`, error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchThumbnail();
  }, [cityName]);

  const handleClick = () => {
    if (cityName && countryCode) {
      navigate(`/city/${encodeURIComponent(cityName)}/${encodeURIComponent(countryCode)}`);
    } else {
      console.error('CityCard: Missing cityName or countryCode', { cityName, countryCode });
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="group relative aspect-[3/4] md:aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer bg-surface h-full transform transition-all duration-500 hover:scale-[1.03] hover:shadow-2xl"
    >
      {/* Background Image */}
      {thumbnail ? (
        <img 
          src={thumbnail} 
          alt={`${cityName} driving POV`} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-surface to-surface3 flex items-center justify-center">
           {isLoading ? (
             <div className="w-8 h-8 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
           ) : (
             <span className="text-white/20 text-xs">Thumbnail unavailable</span>
           )}
        </div>
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

      {/* Hover Drive Pill */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-brand-gold text-brand-dark px-6 py-2 rounded-full font-bold text-sm tracking-wider flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
          <span>▶</span>
          <span>DRIVE</span>
        </div>
      </div>

      {/* Bottom Text Content */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex flex-col gap-1">
          <h3 className="font-display text-white text-xl md:text-2xl leading-tight">
            {cityName}
          </h3>
          <div className="flex items-center gap-2">
            <span className="w-1 h-1 bg-brand-gold rounded-full" />
            <span className="text-white/50 text-sm font-body uppercase tracking-widest">
              {countryName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CityCard;
