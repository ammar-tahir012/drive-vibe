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
  const [radioVolume, setRadioVolume] = useState(80);
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
      audioRef.current.volume = radioVolume / 100;
      if (isRadioPlaying && isPlaying) {
        audioRef.current.play().catch(() => {});
      } else {
        audioRef.current.pause();
      }
    }
  }, [isRadioPlaying, isPlaying, currentRadioIndex, radioVolume]);

  // Toast auto-hide
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const onReady = (event) => {
    playerRef.current = event.target;
    // Video is MUTED — audio comes from radio only
    playerRef.current.mute();
    playerRef.current.setPlaybackRate(playbackRate);
    if (isPlaying) playerRef.current.playVideo();
  };

  const onError = () => {
    setToast('Video restricted, skipping...');
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
    setRadioVolume(val);
    if (audioRef.current) audioRef.current.volume = val / 100;
  };

  const nextStation = () => {
    if (radioStations.length > 1) setCurrentRadioIndex((i) => (i + 1) % radioStations.length);
  };

  const handleAudioError = () => {
    if (radioStations.length > 1) {
      setToast('Station stream failed, trying next...');
      nextStation();
    } else {
      setToast('No working radio stations found');
    }
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-brand-dark flex flex-col items-center justify-center z-[100]">
        <div className="w-16 h-16 border-4 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mb-6" />
        <h2 className="font-display text-white text-xl sm:text-2xl animate-pulse px-4 text-center">Loading {cityName}...</h2>
      </div>
    );
  }

  const currentStation = radioStations[currentRadioIndex];

  return (
    <div className="fixed inset-0 overflow-hidden bg-black text-white select-none">
      {/* Toast */}
      {toast && (
        <div className="absolute bottom-24 sm:bottom-32 left-1/2 -translate-x-1/2 z-[100] bg-black/60 backdrop-blur-xl border border-white/10 px-4 sm:px-6 py-2 rounded-full text-[10px] sm:text-xs font-medium text-brand-gold whitespace-nowrap">
          {toast}
        </div>
      )}

      {/* Video Background — MUTED, highest quality, fills screen */}
      <div id="yt-wrapper" className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
        {videos.length > 0 && (
          <YouTube
            key={videos[currentVideoIndex]?.videoId}
            videoId={videos[currentVideoIndex]?.videoId}
            opts={{
              playerVars: {
                autoplay: 1,
                mute: 1,           // MUTED — audio comes from radio
                controls: 0,
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                disablekb: 1,
                fs: 0,
                playsinline: 1,
                vq: 'hd2160',      // Request highest quality (4K)
              },
            }}
            onReady={onReady}
            onError={onError}
            className="absolute inset-0"
          />
        )}
      </div>

      {/* Vignette */}
      <div className="absolute inset-0 z-[1] pointer-events-none"
        style={{ background: 'radial-gradient(circle, transparent 30%, rgba(0,0,0,0.3) 60%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* Top Bar — responsive */}
      <header className="absolute top-0 left-0 right-0 z-20 bg-black/40 backdrop-blur-xl border-b border-white/5 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors group shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="hidden sm:inline font-body text-sm">Back</span>
        </Link>

        <div className="text-center min-w-0">
          <h1 className="font-display text-white text-lg sm:text-2xl font-bold truncate">{cityName}</h1>
          <p className="text-white/50 text-[10px] sm:text-xs flex items-center justify-center gap-1 sm:gap-2">
            <span>{cityInfo?.flag}</span>
            <span className="font-body uppercase tracking-widest text-[9px] sm:text-[10px] truncate">{cityInfo?.name}</span>
          </p>
        </div>

        <div className="flex items-center gap-0.5 sm:gap-1 bg-white/5 p-0.5 sm:p-1 rounded-full border border-white/5 shrink-0">
          {[0.5, 1, 1.5, 2].map((rate) => (
            <button key={rate} onClick={() => handleSpeedChange(rate)}
              className={`px-2 sm:px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-bold transition-all ${playbackRate === rate ? 'bg-brand-gold text-brand-dark' : 'text-white/40 hover:text-white'}`}
            >{rate}x</button>
          ))}
        </div>
      </header>

      {/* Bottom Controls — responsive */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-2xl border-t border-white/5 px-3 sm:px-8 py-3 sm:py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:grid sm:grid-cols-3 sm:items-center gap-2 sm:gap-0">

          {/* Radio */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 shrink">
            <div className="flex flex-col min-w-0">
              <span className="text-brand-gold text-[8px] sm:text-[10px] font-bold tracking-widest uppercase">Live Radio</span>
              <div className="flex items-center gap-2">
                <p className="text-white text-[11px] sm:text-sm font-medium truncate max-w-[80px] sm:max-w-[150px]">
                  {currentStation ? currentStation.name : 'No Station'}
                </p>
                {isPlaying && isRadioPlaying && currentStation && (
                  <div className="flex items-end gap-0.5 h-3 shrink-0">
                    {[0, 0.2, 0.4].map((d) => (
                      <div key={d} className="w-[2px] sm:w-[3px] bg-brand-gold rounded-full animate-equalize" style={{ animationDelay: `${d}s` }} />
                    ))}
                  </div>
                )}
              </div>
              <button onClick={nextStation} className="text-white/40 hover:text-white text-[9px] sm:text-[10px] underline mt-0.5 transition-colors w-fit">
                Next Station
              </button>
            </div>
          </div>

          {/* Transport */}
          <div className="flex items-center justify-center gap-4 sm:gap-8 shrink-0">
            <button onClick={handlePrevVideo} className="text-white/40 hover:text-white transition-colors p-1 sm:p-2 hover:scale-110 active:scale-95 hidden sm:block">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z" /></svg>
            </button>
            <button onClick={handleTogglePlay}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-brand-gold text-brand-dark flex items-center justify-center shadow-glow hover:scale-110 active:scale-95 transition-all"
            >
              {isPlaying ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5"><polygon points="5 3 19 12 5 21 5 3" /></svg>
              )}
            </button>
            <button onClick={handleNextVideo} className="text-white/40 hover:text-white transition-colors p-1 sm:p-2 hover:scale-110 active:scale-95 hidden sm:block">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M13 6v12l8.5-6L13 6zM12.5 12L4 18V6l8.5 6z" /></svg>
            </button>
          </div>

          {/* Volume — controls radio volume only */}
          <div className="flex flex-col items-end gap-1 min-w-0 shrink">
            <div className="flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeOpacity="0.6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              <input type="range" min="0" max="100" value={radioVolume} onChange={handleVolumeChange}
                className="w-16 sm:w-28 accent-brand-gold appearance-none h-1 bg-white/10 rounded-full cursor-pointer"
              />
            </div>
            <p className="text-white/30 text-[9px] sm:text-[10px] tracking-wider uppercase">
              {currentVideoIndex + 1}/{videos.length}
            </p>
          </div>
        </div>
      </footer>

      {/* Radio Audio Element */}
      {currentStation && (
        <audio key={currentStation.url} ref={audioRef} src={currentStation.url} autoPlay onError={handleAudioError} />
      )}
    </div>
  );
};

export default CityPage;
