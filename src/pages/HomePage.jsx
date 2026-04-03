import React, { useState, useEffect } from 'react';
import YouTube from 'react-youtube';
import { useNavigate } from 'react-router-dom';
import { searchCities } from '../api/cities';
import CityCard from '../components/CityCard';
import { useDebounce } from '../hooks/useDebounce';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  const trendingCities = [
    { name: 'Tokyo', code: 'JP', country: 'Japan' },
    { name: 'Paris', code: 'FR', country: 'France' },
    { name: 'New York', code: 'US', country: 'USA' },
    { name: 'London', code: 'GB', country: 'United Kingdom' },
    { name: 'Istanbul', code: 'TR', country: 'Turkey' },
    { name: 'Dubai', code: 'AE', country: 'UAE' },
    { name: 'Seoul', code: 'KR', country: 'South Korea' },
    { name: 'Lagos', code: 'NG', country: 'Nigeria' },
  ];

  const moods = [
    {
      id: 'night',
      title: 'Night Drive',
      emoji: '🌃',
      desc: 'City lights and neon vibes.',
      color: 'from-indigo-900/40 to-black',
      keyword: 'night'
    },
    {
      id: 'rain',
      title: 'Rainy Cities',
      emoji: '🌧️',
      desc: 'Cozy, moody, rain-soaked streets.',
      color: 'from-blue-900/40 to-black',
      keyword: 'rain'
    },
    {
      id: 'fast',
      title: 'Fast Lane',
      emoji: '🏎️',
      desc: 'High speed city navigation.',
      color: 'from-red-900/40 to-black',
      keyword: 'fast'
    },
    {
      id: 'golden',
      title: 'Golden Hour',
      emoji: '🌅',
      desc: 'Warm sunsets and cinematic glow.',
      color: 'from-amber-900/40 to-black',
      keyword: 'golden hour'
    },
    {
      id: 'food',
      title: 'Street Food',
      emoji: '🍜',
      desc: 'Busy markets and local spots.',
      color: 'from-orange-900/40 to-black',
      keyword: 'streets'
    },
    {
      id: 'scenic',
      title: 'Scenic Routes',
      emoji: '🏔️',
      desc: 'Breathtaking natural landscapes.',
      color: 'from-emerald-900/40 to-black',
      keyword: 'scenic'
    },
  ];

  const stats = [
    { value: '500+', label: 'Cities' },
    { value: '190+', label: 'Countries' },
    { value: 'Live', label: 'Radio Stations' },
    { value: '4K', label: 'Videos' },
  ];

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  useEffect(() => {
    const performSearch = async () => {
      if (debouncedSearchQuery.trim().length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      const data = await searchCities(debouncedSearchQuery);
      setResults(data);
      setIsSearching(false);
    };

    performSearch();
  }, [debouncedSearchQuery]);

  const onPlayerReady = (event) => {
    event.target.playVideo();
  };

  const videoOptions = {
    playerVars: {
      autoplay: 1,
      mute: 1,
      loop: 1,
      controls: 0,
      showinfo: 0,
      rel: 0,
      playlist: 'fkoDgPOFtHY',
      modestbranding: 1,
    },
  };

  const handleMoodClick = (keyword) => {
    setSearchQuery(keyword);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-brand-dark">
      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Background Video Layer */}
        <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden scale-110">
          <YouTube
            videoId="fkoDgPOFtHY"
            opts={videoOptions}
            onReady={onPlayerReady}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full object-cover"
            iframeClassName="w-full h-full"
          />
        </div>

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0 z-[1]"
          style={{
            background: 'linear-gradient(to bottom, rgba(12,12,14,0.3) 0%, rgba(12,12,14,0.5) 50%, rgba(12,12,14,1) 100%)'
          }}
        />

        {/* Content Layer */}
        <div className="relative z-10 container mx-auto px-6 flex flex-col items-center text-center">
          {/* Animated Badge */}
          <div className="mb-8 p-[1px] rounded-full bg-gradient-to-r from-brand-gold/20 to-transparent animate-fade-up">
            <div className="bg-brand-gold/10 border border-brand-gold/30 rounded-full px-4 py-1.5 flex items-center gap-2">
            </div>
          </div>

          <h1 className="flex flex-col gap-2">
            <span className="font-display text-white text-6xl md:text-8xl font-normal opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.2s]">
              Drive Through
            </span>
            <span className="font-display italic text-brand-gold text-6xl md:text-8xl opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.4s]">
              The World
            </span>
          </h1>

          <p className="mt-6 text-white/60 text-lg md:text-xl font-body font-light max-w-xl opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.6s]">
            Choose a city. Watch the streets. Hear the locals.
          </p>

          <div className="relative w-full max-w-2xl mt-12 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.8s]">
            <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-4 focus-within:shadow-glow focus-within:border-brand-gold/40 transition-all group">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-4 text-brand-gold">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Try Tokyo, Paris, Lagos..."
                className="flex-1 bg-transparent border-none text-white text-lg placeholder:text-white/20 focus:ring-0 font-body"
              />
              <button
                className="ml-3 w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark hover:scale-110 active:scale-95 transition-all duration-300"
                onClick={() => {
                  if (searchQuery && results[0]) {
                    navigate(`/city/${encodeURIComponent(results[0].city)}/${encodeURIComponent(results[0].countryCode)}`);
                  }
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>

            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a1f]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-20 max-h-[40vh] overflow-y-auto">
                {results.map((city, idx) => (
                  <button
                    key={`${city.city}-${idx}`}
                    onClick={() => navigate(`/city/${encodeURIComponent(city.city)}/${encodeURIComponent(city.countryCode)}`)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group text-left"
                  >
                    <span className="text-white text-lg font-body group-hover:text-brand-gold transition-colors">{city.city}</span>
                    <span className="text-brand-gold/60 text-sm tracking-wider uppercase">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 flex flex-col items-center gap-4 opacity-0 animate-[fadeUp_0.8s_ease_forwards_1s]">
            <span className="text-white/40 text-sm font-body tracking-wider uppercase">Popular right now →</span>
            <div className="flex gap-3 overflow-x-auto pb-4 max-w-[90vw] no-scrollbar">
              {trendingCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => navigate(`/city/${encodeURIComponent(city.name)}/${encodeURIComponent(city.code)}`)}
                  className="px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 whitespace-nowrap hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold transition-all text-sm font-medium"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_0.8s_ease_forwards_1.4s]">
          <span className="text-white/40 text-xs font-body tracking-wider uppercase">Scroll to explore</span>
          <div className="w-1 h-5 rounded-full bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold/60 animate-bounce transition-all" />
          </div>
        </div>
      </section>

      {/* Trending Cities Section */}
      <section id="explore" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-12 h-px bg-brand-gold" />
          <h2 className="font-display text-white text-4xl leading-none">Trending Cities</h2>
        </div>
        <p className="text-white/40 text-sm font-body tracking-widest uppercase mb-12 ml-16">
          Most explored cities this week
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {trendingCities.map((city) => (
            <CityCard
              key={city.name}
              cityName={city.name}
              countryCode={city.code}
              countryName={city.country}
            />
          ))}
        </div>
      </section>

      {/* Explore by Mood Section */}
      <section id="moods" className="bg-[#08080a] py-24 px-6">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-display text-white text-4xl mb-4">Choose Your Mood</h2>
          <p className="text-white/40 font-body text-lg italic">Every city feels different. Pick yours.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {moods.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleMoodClick(mood.keyword)}
              className="group relative aspect-video rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-surface transition-all duration-500 hover:scale-[1.03] hover:border-brand-gold/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} transition-all duration-500 group-hover:scale-110`} />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-8 text-center bg-black/20 backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-500">
                <span className="text-5xl mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {mood.emoji}
                </span>
                <h3 className="font-display text-white text-2xl mb-2">{mood.title}</h3>
                <p className="text-white/50 text-sm font-body leading-relaxed max-w-[200px]">
                  {mood.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 py-16 px-6 bg-brand-dark">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-12 md:gap-24">
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <div className="text-center">
                <div className="font-display text-brand-gold text-5xl mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-white/50 text-xs font-body tracking-[0.2em] uppercase">
                  {stat.label}
                </div>
              </div>
              {idx < stats.length - 1 && (
                <div className="hidden md:block w-px h-16 bg-white/5 self-center" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* Footer Space */}
      <footer id="about" className="py-20 text-center opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-white text-xs tracking-widest uppercase mb-4 font-body">DriveVibes © 2026</p>
        <div className="w-10 h-px bg-white mx-auto opacity-20" />
      </footer>
    </div>
  );
};

export default HomePage;
