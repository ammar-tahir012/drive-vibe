import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { searchDrivingVideos } from '../api/youtube';
import { fetchRadioStations } from '../api/radio';
import { getCountryByCode } from '../api/countries';

const CityPage = () => {
  const { cityName, countryCode } = useParams();
  
  // API Key Check
  const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
  const isApiKeyMissing = !YOUTUBE_API_KEY || YOUTUBE_API_KEY === 'your_key_here';

  // State
  const [videos, setVideos] = useState([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [radioStations, setRadioStations] = useState([]);
  const [currentRadioIndex, setCurrentRadioIndex] = useState(0);
  const [cityInfo, setCityInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRadioPlaying, setIsRadioPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Refs
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  // Document Title update
  useEffect(() => {
    document.title = `${cityName} — DriveVibes`;
    return () => {
      document.title = 'DriveVibes — Drive the World';
    };
  }, [cityName]);

  // Data Fetching
  useEffect(() => {
    const initPage = async () => {
      setIsLoading(true);
      try {
        const [videoData, radioData, countryData] = await Promise.all([
          searchDrivingVideos(cityName),
          fetchRadioStations(countryCode),
          getCountryByCode(countryCode)
        ]);
        
        setVideos(videoData);
        setRadioStations(radioData);
        setCityInfo(countryData);
      } catch (error) {
        console.error('Failed to load city experience:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initPage();
  }, [cityName, countryCode]);

  // Sync Audio Playback
  useEffect(() => {
    if (audioRef.current) {
        if (isRadioPlaying && isPlaying) {
            audioRef.current.play().catch(e => console.warn('Audio play failed:', e));
        } else {
            audioRef.current.pause();
        }
    }
  }, [isRadioPlaying, isPlaying, currentRadioIndex]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Player Handlers
  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    playerRef.current.setPlaybackRate(playbackRate);
    if (isPlaying) playerRef.current.playVideo();
  };

  const handleTogglePlay = () => {
    const newState = !isPlaying;
    setIsPlaying(newState);
    if (playerRef.current) {
      if (newState) playerRef.current.playVideo();
      else playerRef.current.pauseVideo();
    }
  };

  const handleNextVideo = () => {
    setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (playerRef.current) playerRef.current.setVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
  };

  const nextStation = () => {
    if (radioStations.length > 0) {
      setCurrentRadioIndex((prev) => (prev + 1) % radioStations.length);
    }
  };

  const handleAudioError = () => {
    if (radioStations.length > 1) {
      setToast('Switching to next station...');
      nextStation();
    } else {
      setToast('Radio stream unavailable');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-6" />
        <h2 className="font-display text-white text-2xl animate-pulse text-center">
            Loading {cityName}...
        </h2>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center px-6 text-center z-[100]">
        <h2 className="font-display text-white text-3xl mb-4">No driving videos found for {cityName}</h2>
        <p className="text-white/60 mb-8 max-w-md">We couldn't find any 4K POV driving footage for this location. Try searching for a major city like Tokyo, Paris, or London.</p>
        <Link to="/" className="px-8 py-3 bg-brand-gold text-brand-dark rounded-full font-bold hover:scale-105 transition-transform">
            Return Home
        </Link>
      </div>
    );
  }

  const currentStation = radioStations[currentRadioIndex];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white select-none">
      {/* API GUARD BANNER */}
      {isApiKeyMissing && (
        <div className="absolute top-0 left-0 right-0 z-[100] bg-brand-gold text-brand-dark px-4 py-2 text-center text-xs font-bold tracking-widest uppercase animate-slide-down">
          YouTube API key not configured. Add VITE_YOUTUBE_API_KEY to .env
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-xs font-medium animate-fade-in">
          {toast}
        </div>
      )}

      {/* LAYER 1: VIDEO BACKGROUND */}
      <div id="yt-wrapper" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden scale-110">
        <YouTube
          videoId={videos[currentVideoIndex]?.videoId}
          opts={{
            playerVars: {
              autoplay: 1,
              controls: 0,
              rel: 0,
              modestbranding: 1,
              iv_load_policy: 3,
            },
          }}
          onReady={onReady}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
        />
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none" 
           style={{ background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)' }} 
      />

      {/* LAYER 2: TOP BAR */}
      <header className={`absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all ${isApiKeyMissing ? 'mt-8' : ''}`}>
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="hidden sm:inline font-body text-sm font-medium tracking-wide">Back Home</span>
        </Link>

        <div className="text-center flex flex-col items-center">
          <h1 className="font-display text-white text-xl sm:text-2xl font-bold tracking-tight">{cityName}</h1>
          <p className="text-white/50 text-[10px] sm:text-sm flex items-center gap-2">
            <span>{cityInfo?.flag}</span>
            <span className="font-body uppercase tracking-[0.2em] text-[10px]">{cityInfo?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5 overflow-x-auto max-w-[100px] sm:max-w-none">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`px-2 sm:px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                playbackRate === rate ? 'bg-brand-gold text-brand-dark' : 'text-white/40 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </header>

      {/* LAYER 3: BOTTOM CONTROL BAR */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-2xl border-t border-white/5 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:grid sm:grid-cols-3 items-center gap-6 sm:gap-0">
          
          {/* Left: Radio Panel */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-brand-gold text-[10px] font-bold tracking-[0.2em] uppercase mb-1">Live Radio</span>
              <div className="flex items-center gap-3">
                <p className="text-white text-sm font-medium truncate max-w-[120px] sm:max-w-[150px]">
                  {currentStation ? currentStation.name : 'No Station Found'}
                </p>
                {isPlaying && isRadioPlaying && (
                  <div className="flex items-end gap-1 h-3 mb-1">
                    {[0, 0.2, 0.4].map((delay) => (
                      <div 
                        key={delay}
                        className="w-[3px] bg-brand-gold rounded-full animate-equalize"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={nextStation}
                className="text-white/40 hover:text-white text-[10px] underline underline-offset-4 decoration-white/10 decoration-1 mt-1 transition-colors w-fit"
              >
                Switch Station
              </button>
            </div>
          </div>

          {/* Center: Video Controls */}
          <div className="flex items-center justify-center gap-6 sm:gap-8">
            <button 
              onClick={handlePrevVideo}
              className="text-white/40 hover:text-white transition-colors p-2"
              title="Previous Video"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"></path>
              </svg>
            </button>

            <button 
              onClick={handleTogglePlay}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all duration-300 group"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              )}
            </button>

            <button 
              onClick={handleNextVideo}
              className="text-white/40 hover:text-white transition-colors p-2"
              title="Next Video"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 6v12l8.5-6L13 6zM12.5 12L4 18V6l8.5 6z"></path>
              </svg>
            </button>
          </div>

          {/* Right: Volume + Info */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 sm:w-28 accent-brand-gold appearance-none h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-all"
              />
            </div>
            <p className="text-white/30 text-[10px] font-body tracking-wider uppercase">
              VIDEO {currentVideoIndex + 1} OF {videos.length}
            </p>
          </div>

        </div>
      </footer>

      {/* Hidden Radio Audio Player */}
      {currentStation && (
        <audio 
            key={currentStation.url}
            ref={audioRef} 
            src={currentStation.url} 
            autoPlay 
            onError={handleAudioError}
        />
      )}
    </div>
  );
};

export default CityPage;
