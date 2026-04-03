import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import YouTube from 'react-youtube';
import { searchDrivingVideos } from '../api/youtube';
import { fetchRadioStations } from '../api/radio';
import { getCountryByCode } from '../api/countries';

const CityPage = () => {
  const { cityName, countryCode } = useParams();

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

  const playerRef = useRef(null);
  const audioRef = useRef(null);

  // Document Title
  useEffect(() => {
    document.title = `${cityName} — DriveVibes`;
    return () => { document.title = 'DriveVibes — Drive the World'; };
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
        console.error('Failed to load city:', error);
      } finally {
        setIsLoading(false);
      }
    };
    initPage();
  }, [cityName, countryCode]);

  // Audio sync
  useEffect(() => {
    if (audioRef.current) {
      if (isRadioPlaying && isPlaying) {
        audioRef.current.play().catch(() => {});
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

  const onReady = (event) => {
    playerRef.current = event.target;
    playerRef.current.setVolume(volume);
    playerRef.current.setPlaybackRate(playbackRate);
    if (isPlaying) playerRef.current.playVideo();
  };

  const onError = () => {
    setToast('Video restricted, skipping to next...');
    handleNextVideo();
  };

  const handleTogglePlay = () => {
    const next = !isPlaying;
    setIsPlaying(next);
    if (playerRef.current) {
      next ? playerRef.current.playVideo() : playerRef.current.pauseVideo();
    }
  };

  const handleNextVideo = () => {
    if (videos.length > 0) setCurrentVideoIndex((i) => (i + 1) % videos.length);
  };

  const handlePrevVideo = () => {
    if (videos.length > 0) setCurrentVideoIndex((i) => (i - 1 + videos.length) % videos.length);
  };

  const handleSpeedChange = (rate) => {
    setPlaybackRate(rate);
    if (playerRef.current) playerRef.current.setPlaybackRate(rate);
  };

  const handleVolumeChange = (e) => {
    const val = parseInt(e.target.value);
    setVolume(val);
    if (playerRef.current) playerRef.current.setVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
  };

  const nextStation = () => {
    if (radioStations.length > 1) setCurrentRadioIndex((i) => (i + 1) % radioStations.length);
  };

  const handleAudioError = () => {
    if (radioStations.length > 1) {
      setToast('Switching radio station...');
      nextStation();
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-6" />
        <h2 className="font-display text-white text-2xl animate-pulse">Loading {cityName}...</h2>
      </div>
    );
  }

  const currentStation = radioStations[currentRadioIndex];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white select-none">
      {/* Toast */}
      {toast && (
        <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-black/60 backdrop-blur-xl border border-white/10 px-6 py-2 rounded-full text-xs font-medium text-brand-gold">
          {toast}
        </div>
      )}

      {/* Video Background */}
      <div id="yt-wrapper" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden scale-110">
        {videos.length > 0 && (
          <YouTube
            key={videos[currentVideoIndex]?.videoId}
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
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(circle, transparent 20%, rgba(0,0,0,0.4) 60%, rgba(0,0,0,0.8) 100%)' }}
      />

      {/* Top Bar */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="hidden sm:inline font-body text-sm">Back Home</span>
        </Link>

        <div className="text-center">
          <h1 className="font-display text-white text-xl sm:text-2xl font-bold">{cityName}</h1>
          <p className="text-white/50 text-xs flex items-center justify-center gap-2">
            <span>{cityInfo?.flag}</span>
            <span className="font-body uppercase tracking-widest text-[10px]">{cityInfo?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <button key={rate} onClick={() => handleSpeedChange(rate)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${playbackRate === rate ? 'bg-brand-gold text-brand-dark' : 'text-white/40 hover:text-white'}`}
            >{rate}x</button>
          ))}
        </div>
      </header>

      {/* Bottom Controls */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-2xl border-t border-white/5 px-4 sm:px-8 py-5">
        <div className="max-w-7xl mx-auto flex flex-col sm:grid sm:grid-cols-3 items-center gap-6 sm:gap-0">

          {/* Radio */}
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="flex flex-col">
              <span className="text-brand-gold text-[10px] font-bold tracking-widest uppercase mb-1">Live Radio</span>
              <div className="flex items-center gap-3">
                <p className="text-white text-sm font-medium truncate max-w-[150px]">
                  {currentStation ? currentStation.name : 'No Station Found'}
                </p>
                {isPlaying && isRadioPlaying && currentStation && (
                  <div className="flex items-end gap-1 h-3">
                    {[0, 0.2, 0.4].map((d) => (
                      <div key={d} className="w-[3px] bg-brand-gold rounded-full animate-equalize" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                )}
              </div>
              <button onClick={nextStation} className="text-white/40 hover:text-white text-[10px] underline mt-1 transition-colors w-fit">
                Switch Station
              </button>
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-center gap-8">
            <button onClick={handlePrevVideo} className="text-white/40 hover:text-white transition-colors p-2 hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" /></svg>
            </button>
            <button onClick={handleTogglePlay}
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="ml-1"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              )}
            </button>
            <button onClick={handleNextVideo} className="text-white/40 hover:text-white transition-colors p-2 hover:scale-110 active:scale-95">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M13 6v12l8.5-6L13 6zM12.5 12L4 18V6l8.5 6z" /></svg>
            </button>
          </div>

          {/* Volume */}
          <div className="flex flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
            <div className="flex items-center gap-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input type="range" min="0" max="100" value={volume} onChange={handleVolumeChange}
                className="w-24 sm:w-28 accent-brand-gold appearance-none h-1 bg-white/10 rounded-full cursor-pointer"
              />
            </div>
            <p className="text-white/30 text-[10px] tracking-wider uppercase">
              Video {currentVideoIndex + 1} of {videos.length}
            </p>
          </div>
        </div>
      </footer>

      {/* Radio Audio */}
      {currentStation && (
        <audio key={currentStation.url} ref={audioRef} src={currentStation.url} autoPlay onError={handleAudioError} />
      )}
    </div>
  );
};

export default CityPage;
