import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { searchDrivingVideos } from '../api/youtube';
import { fetchRadioStations } from '../api/radio';
import { getCountryByCode } from '../api/countries';

const CityPage = () => {
  const { cityName, countryCode } = useParams();
  
  // Hand-picked global safe videos (no ads, no restrictions) for emergency fallback
  const GLOBAL_FALLBACK_VIDEO = 'L6_eSBHxfwI'; // Tokyo Night Drive - highly reliable Rambalac link

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
  const [isSearching, setIsSearching] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [toast, setToast] = useState('');
  
  const [isPlaying, setIsPlaying] = useState(true);
  const [isRadioPlaying, setIsRadioPlaying] = useState(true);
  const [volume, setVolume] = useState(80);
  const [playbackRate, setPlaybackRate] = useState(1);
  
  // Refs
  const playerRef = useRef(null);
  const audioRef = useRef(null);

  // Cinematic Poster (Failsafe Visuals)
  const posterUrl = `https://images.unsplash.com/photo-1449156001437-3a16d1daae39?q=80&w=1920&auto=format&fit=crop&city=${encodeURIComponent(cityName)}`;

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
      setIsSearching(true);
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
        console.error('DriveVibes Error: Initial data fetch failed:', error);
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
    setIsSearching(false);
    setRetryCount(0);
    if (isPlaying) playerRef.current.playVideo();
  };

  const onError = (error) => {
    console.warn(`DriveVibes [${cityName}]: Video ${currentVideoIndex + 1} restricted. Attempting next route...`);
    setIsSearching(true);
    setRetryCount(prev => prev + 1);
    
    // If we've failed 3 times, show an emergency toast
    if (retryCount >= 3) {
        setToast('Multiple routes restricted. Scanning deeper...');
    }

    // Attempt next video after a brief delay
    setTimeout(() => {
        handleNextVideo();
    }, 800);
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
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
      setIsSearching(true);
    }
  };

  const handlePrevVideo = () => {
    if (videos.length > 0) {
      setCurrentVideoIndex((prev) => (prev - 1 + videos.length) % videos.length);
      setIsSearching(true);
    }
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
    if (radioStations.length > 1) {
      setCurrentRadioIndex((prev) => (prev + 1) % radioStations.length);
    }
  };

  const handleAudioError = () => {
    if (radioStations.length > 1) {
      setToast('Connecting to next station...');
      nextStation();
    } else {
      setToast('Live stream connection failed');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-6" />
        <h2 className="font-display text-white text-2xl animate-pulse text-center tracking-[0.2em] uppercase">
            Initiating Drive for {cityName}...
        </h2>
      </div>
    );
  }

  const currentStation = radioStations[currentRadioIndex];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white select-none">
      {/* API GUARD BANNER */}
      {isApiKeyMissing && (
        <div className="absolute top-0 left-0 right-0 z-[100] bg-brand-gold text-brand-dark px-4 py-2 text-center text-xs font-bold tracking-widest uppercase">
          YouTube Quota/Key Restricted. Using Safe Mode Pool.
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-brand-gold text-brand-dark px-8 py-3 rounded-full text-xs font-bold tracking-widest uppercase shadow-glow animate-fade-in-up">
          {toast}
        </div>
      )}

      {/* LAYER 0: CINEMATIC POSTER (Always handles loading/black screen gaps) */}
      <img 
        src={posterUrl} 
        alt="DriveVibes Background" 
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 grayscale-[40%] ${isSearching ? 'opacity-60' : 'opacity-0'}`} 
      />

      {/* SEARCHING STATUS (When videos are being cycled) */}
      {isSearching && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-500">
              <div className="bg-brand-gold/10 backdrop-blur-2xl border border-brand-gold/30 px-10 py-5 rounded-2xl flex flex-col items-center gap-6 shadow-glow max-w-sm text-center">
                  <div className="relative">
                      <div className="w-12 h-12 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-brand-gold">{retryCount + 1}</span>
                      </div>
                  </div>
                  <div>
                      <h3 className="font-display text-brand-gold text-xl uppercase tracking-widest mb-2">Scanning Route</h3>
                      <p className="font-body text-white/50 text-xs tracking-wide">Route {currentVideoIndex + 1} appears restricted. Identifying alternative 4K POV drive for {cityName}...</p>
                  </div>
                  <div className="flex flex-col gap-3 w-full">
                      <button 
                        onClick={() => handleNextVideo()}
                        className="px-6 py-2 bg-brand-gold text-brand-dark text-xs font-bold tracking-widest uppercase rounded-full hover:scale-105 active:scale-95 transition-all"
                      >
                         Skip Manually
                      </button>
                      <Link to="/" className="text-white/30 hover:text-white text-[10px] font-bold tracking-widest uppercase transition-colors">
                         Cancel Journey
                      </Link>
                  </div>
              </div>
          </div>
      )}

      {/* LAYER 1: VIDEO BACKGROUND */}
      <div id="yt-wrapper" className={`absolute inset-0 w-full h-full pointer-events-none overflow-hidden scale-110 transition-opacity duration-1000 ${isSearching ? 'opacity-0' : 'opacity-100'}`}>
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
          onError={onError}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full"
        />
      </div>

      {/* Vignette Overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none" 
           style={{ background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.9) 100%)' }} 
      />

      {/* LAYER 2: TOP BAR */}
      <header className={`absolute top-0 left-0 right-0 z-30 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between transition-all ${isApiKeyMissing ? 'mt-8' : ''}`}>
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          <span className="hidden sm:inline font-body text-xs font-bold uppercase tracking-[0.3em]">Back Home</span>
        </Link>

        <div className="text-center flex flex-col items-center">
          <h1 className="font-display text-white text-xl sm:text-2xl font-bold tracking-tight uppercase leading-none mb-1">{cityName}</h1>
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-xs">{cityInfo?.flag}</span>
            <span className="font-body uppercase tracking-[0.3em] text-[10px] text-white/50">{cityInfo?.name}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5 transition-all">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <button
              key={rate}
              onClick={() => handleSpeedChange(rate)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${
                playbackRate === rate ? 'bg-brand-gold text-brand-dark' : 'text-white/40 hover:text-white'
              }`}
            >
              {rate}x
            </button>
          ))}
        </div>
      </header>

      {/* LAYER 3: BOTTOM CONTROL BAR */}
      <footer className="absolute bottom-0 left-0 right-0 z-30 bg-black/60 backdrop-blur-2xl border-t border-white/5 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:grid sm:grid-cols-3 items-center gap-6 sm:gap-0">
          
          {/* Left: Radio Panel */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-brand-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-1 drop-shadow-glow">Live Radio Feed</span>
              <div className="flex items-center gap-3">
                <p className="text-white text-sm font-medium truncate max-w-[120px] sm:max-w-[150px] tracking-wide">
                  {currentStation ? currentStation.name : 'Searching Signal...'}
                </p>
                {!isSearching && (
                  <div className="flex items-end gap-1 h-3 mb-1">
                    {[0, 0.2, 0.4].map((delay) => (
                      <div 
                        key={delay}
                        className="w-[3px] bg-brand-gold rounded-full animate-equalize shadow-[0_0_8px_rgba(232,201,122,0.4)]"
                        style={{ animationDelay: `${delay}s` }}
                      />
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={nextStation}
                className="text-white/40 hover:text-white text-[10px] underline underline-offset-8 decoration-white/10 decoration-1 mt-1 transition-all uppercase tracking-widest font-bold"
              >
                Next Station
              </button>
            </div>
          </div>

          {/* Center: Video Controls */}
          <div className="flex items-center justify-center gap-6 sm:gap-10">
            <button 
              onClick={handlePrevVideo}
              className="text-white/40 hover:text-white transition-all p-2 hover:scale-110 active:scale-95"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"></path>
              </svg>
            </button>

            <button 
              onClick={handleTogglePlay}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-glow-strong hover:scale-110 active:scale-95 transition-all duration-300 group"
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
              className="text-white/40 hover:text-white transition-all p-2 hover:scale-110 active:scale-95"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13 6v12l8.5-6L13 6zM12.5 12L4 18V6l8.5 6z"></path>
              </svg>
            </button>
          </div>

          {/* Right: Volume + Stats */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
              </svg>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24 sm:w-28 accent-brand-gold appearance-none h-1 bg-white/10 rounded-full cursor-pointer hover:bg-white/20 transition-all border-none"
              />
            </div>
            <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase leading-none">
              Searching Route {currentVideoIndex + 1}
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
