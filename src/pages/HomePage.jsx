import React, { useState, useEffect } from 'react';
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
    { name: 'Amsterdam', code: 'NL', country: 'Netherlands' },
  ];

  // Each mood maps to a specific city that matches the vibe
  const moods = [
    {
      id: 'night',
      title: 'Night Drive',
      emoji: '🌃',
      desc: 'City lights and neon vibes.',
      color: 'from-indigo-900/40 to-black',
      city: 'Tokyo',
      code: 'JP',
    },
    {
      id: 'rain',
      title: 'Rainy Cities',
      emoji: '🌧️',
      desc: 'Cozy, moody, rain-soaked streets.',
      color: 'from-blue-900/40 to-black',
      city: 'London',
      code: 'GB',
    },
    {
      id: 'fast',
      title: 'Fast Lane',
      emoji: '🏎️',
      desc: 'High speed city navigation.',
      color: 'from-red-900/40 to-black',
      city: 'Dubai',
      code: 'AE',
    },
    {
      id: 'golden',
      title: 'Golden Hour',
      emoji: '🌅',
      desc: 'Warm sunsets and cinematic glow.',
      color: 'from-amber-900/40 to-black',
      city: 'Paris',
      code: 'FR',
    },
    {
      id: 'food',
      title: 'Street Food',
      emoji: '🍜',
      desc: 'Busy markets and local spots.',
      color: 'from-orange-900/40 to-black',
      city: 'Istanbul',
      code: 'TR',
    },
    {
      id: 'scenic',
      title: 'Scenic Routes',
      emoji: '🏔️',
      desc: 'Breathtaking natural landscapes.',
      color: 'from-emerald-900/40 to-black',
      city: 'Seoul',
      code: 'KR',
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

  const handleMoodClick = (city, code) => {
    navigate(`/city/${encodeURIComponent(city)}/${encodeURIComponent(code)}`);
  };

  return (
    <div className="relative w-full overflow-x-hidden bg-brand-dark">
      {/* Hero Section — No video, animated gradient background */}
      <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-brand-dark">
          <div className="absolute inset-0 opacity-30"
            style={{
              background: 'radial-gradient(circle at 20% 50%, rgba(232,201,122,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 50%), radial-gradient(circle at 50% 80%, rgba(232,201,122,0.08) 0%, transparent 50%)',
            }}
          />
          {/* Subtle animated road lines */}
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/20 to-transparent" />
        </div>

        {/* Content Layer */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 flex flex-col items-center text-center">
          {/* Badge */}
          <div className="mb-6 sm:mb-8 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.1s]">
            <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-full px-4 py-1.5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-brand-gold rounded-full animate-pulse" />
              <span className="text-brand-gold text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase">Live Driving Experience</span>
            </div>
          </div>

          <h1 className="flex flex-col gap-1 sm:gap-2">
            <span className="font-display text-white text-5xl sm:text-6xl md:text-8xl font-normal opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.2s]">
              Drive Through
            </span>
            <span className="font-display italic text-brand-gold text-5xl sm:text-6xl md:text-8xl opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.4s]">
              The World
            </span>
          </h1>

          <p className="mt-4 sm:mt-6 text-white/60 text-base sm:text-lg md:text-xl font-body font-light max-w-xl opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.6s] px-4">
            Choose a city. Watch the streets. Hear the locals.
          </p>

          {/* Search Bar */}
          <div className="relative w-full max-w-2xl mt-8 sm:mt-12 opacity-0 animate-[fadeUp_0.8s_ease_forwards_0.8s]">
            <div className="flex items-center bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 sm:px-6 py-3 sm:py-4 focus-within:shadow-glow focus-within:border-brand-gold/40 transition-all">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 sm:mr-4 shrink-0">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any city..."
                className="flex-1 bg-transparent border-none text-white text-base sm:text-lg placeholder:text-white/20 focus:ring-0 focus:outline-none font-body min-w-0"
              />
              {isSearching && (
                <div className="w-5 h-5 border-2 border-brand-gold/20 border-t-brand-gold rounded-full animate-spin mr-2 shrink-0" />
              )}
              <button
                className="ml-2 sm:ml-3 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-gold flex items-center justify-center text-brand-dark hover:scale-110 active:scale-95 transition-all duration-300 shrink-0"
                onClick={() => {
                  if (results[0]) {
                    navigate(`/city/${encodeURIComponent(results[0].city)}/${encodeURIComponent(results[0].countryCode)}`);
                  }
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {/* Search Results Dropdown */}
            {results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#1a1a1f]/95 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50 max-h-[40vh] overflow-y-auto">
                {results.map((city, idx) => (
                  <button
                    key={`${city.city}-${idx}`}
                    onClick={() => navigate(`/city/${encodeURIComponent(city.city)}/${encodeURIComponent(city.countryCode)}`)}
                    className="w-full flex items-center justify-between px-5 sm:px-6 py-3 sm:py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group text-left"
                  >
                    <span className="text-white text-base sm:text-lg font-body group-hover:text-brand-gold transition-colors">{city.city}</span>
                    <span className="text-brand-gold/60 text-xs sm:text-sm tracking-wider uppercase">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Popular Cities Pills */}
          <div className={`mt-8 sm:mt-12 flex flex-col items-center gap-3 sm:gap-4 opacity-0 animate-[fadeUp_0.8s_ease_forwards_1s] transition-opacity duration-300 ${results.length > 0 ? '!opacity-0 pointer-events-none' : ''}`}>
            {/* <span className="text-white/40 text-xs sm:text-sm font-body tracking-wider uppercase">Popular right now →</span> */}
            <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-4 max-w-[90vw] no-scrollbar">
              {trendingCities.map((city) => (
                <button
                  key={city.name}
                  onClick={() => navigate(`/city/${encodeURIComponent(city.name)}/${encodeURIComponent(city.code)}`)}
                  className="px-4 sm:px-5 py-2 rounded-full border border-white/10 bg-white/5 text-white/80 whitespace-nowrap hover:bg-brand-gold hover:text-brand-dark hover:border-brand-gold transition-all text-xs sm:text-sm font-medium"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-0 animate-[fadeUp_0.8s_ease_forwards_1.4s]">
          {/* <span className="text-white/40 text-[10px] sm:text-xs font-body tracking-wider uppercase">Scroll to explore</span> */}
          <div className="w-1 h-5 rounded-full bg-white/10 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1/2 bg-brand-gold/60 animate-bounce transition-all" />
          </div>
        </div>
      </section>

      {/* Trending Cities Section */}
      <section id="explore" className="py-16 sm:py-24 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-2">
          <div className="w-8 sm:w-12 h-px bg-brand-gold" />
          <h2 className="font-display text-white text-3xl sm:text-4xl leading-none">Trending Cities</h2>
        </div>
        <p className="text-white/40 text-xs sm:text-sm font-body tracking-widest uppercase mb-8 sm:mb-12 ml-12 sm:ml-16">
          Most explored cities this week
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
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

      {/* Explore by Mood Section — each mood navigates to a matching city */}
      <section id="moods" className="bg-[#08080a] py-16 sm:py-24 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center mb-10 sm:mb-16">
          <h2 className="font-display text-white text-3xl sm:text-4xl mb-3 sm:mb-4">Choose Your Mood</h2>
          <p className="text-white/40 font-body text-base sm:text-lg italic">Every city feels different. Pick yours.</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
          {moods.map((mood) => (
            <div
              key={mood.id}
              onClick={() => handleMoodClick(mood.city, mood.code)}
              className="group relative aspect-[4/3] sm:aspect-video rounded-2xl sm:rounded-3xl overflow-hidden cursor-pointer border border-white/5 bg-surface transition-all duration-500 hover:scale-[1.03] hover:border-brand-gold/50"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} transition-all duration-500 group-hover:scale-110`} />
              <div className="relative z-10 h-full flex flex-col items-center justify-center p-4 sm:p-8 text-center bg-black/20 backdrop-blur-sm group-hover:backdrop-blur-0 transition-all duration-500">
                <span className="text-3xl sm:text-5xl mb-3 sm:mb-6 transform transition-transform duration-500 group-hover:-translate-y-2">
                  {mood.emoji}
                </span>
                <h3 className="font-display text-white text-lg sm:text-2xl mb-1 sm:mb-2">{mood.title}</h3>
                <p className="text-white/50 text-[10px] sm:text-sm font-body leading-relaxed max-w-[200px] hidden sm:block">
                  {mood.desc}
                </p>
                <p className="text-brand-gold/60 text-[9px] sm:text-xs font-body mt-2 sm:mt-3 tracking-widest uppercase">
                  Drive {mood.city} →
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-white/5 py-12 sm:py-16 px-4 sm:px-6 bg-brand-dark">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 sm:gap-12 md:gap-24">
          {stats.map((stat, idx) => (
            <React.Fragment key={stat.label}>
              <div className="text-center">
                <div className="font-display text-brand-gold text-3xl sm:text-5xl mb-2 tracking-tight">
                  {stat.value}
                </div>
                <div className="text-white/50 text-[10px] sm:text-xs font-body tracking-[0.2em] uppercase">
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

      {/* About Section */}
      <section id="about" className="bg-[#08080a] border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20">

            {/* Left — About */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 sm:w-12 h-px bg-brand-gold" />
                <span className="text-brand-gold text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">About</span>
              </div>
              <h2 className="font-display text-white text-3xl sm:text-4xl mb-6 leading-tight">
                Built for the love of <span className="italic text-brand-gold">driving</span>.
              </h2>
              <p className="text-white/50 font-body text-sm sm:text-base leading-relaxed mb-6">
                DriveVibes is a cinematic web experience that pairs real 4K POV driving footage from cities around the world with live local radio. Whether it's midnight in Tokyo or golden hour in Paris — just pick a city, lean back, and feel the streets.
              </p>
              <p className="text-white/50 font-body text-sm sm:text-base leading-relaxed mb-8">
                No ads. No interruptions. Just you, the road, and the sound of the city.
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2">
                {['React', 'Vite', 'Tailwind CSS', 'YouTube API', 'Radio Browser API'].map((tech) => (
                  <span key={tech} className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/60 text-[10px] sm:text-xs font-body tracking-wider">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Developer + Contact */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 sm:w-12 h-px bg-brand-gold" />
                <span className="text-brand-gold text-[10px] sm:text-xs font-bold tracking-[0.3em] uppercase">Developer</span>
              </div>

              <div className="mb-8">
                <h3 className="font-display text-white text-2xl sm:text-3xl mb-1">Ammar Tahir</h3>
                <p className="text-brand-gold/70 font-body text-sm tracking-wider">Web Developer</p>
              </div>

              <div className="flex flex-col gap-4">
                {/* Email */}
                <a href="mailto:ammartahir444@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-brand-gold/50 transition-colors shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-body tracking-widest uppercase">Email</p>
                    <p className="text-white/80 text-sm font-body group-hover:text-brand-gold transition-colors">ammartahir444@gmail.com</p>
                  </div>
                </a>

                {/* Phone */}
                <a href="tel:+923145135500" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-brand-gold/50 transition-colors shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-body tracking-widest uppercase">Phone</p>
                    <p className="text-white/80 text-sm font-body group-hover:text-brand-gold transition-colors">+92 314 5135500</p>
                  </div>
                </a>

                {/* GitHub */}
                <a href="https://github.com/ammar-tahir012/drive-vibe" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:border-brand-gold/50 transition-colors shrink-0">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e8c97a">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-white/40 text-[10px] font-body tracking-widest uppercase">Source Code</p>
                    <p className="text-white/80 text-sm font-body group-hover:text-brand-gold transition-colors">github.com/ammar-tahir012/drive-vibe</p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/5 py-6 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/30 text-[10px] sm:text-xs font-body tracking-widest uppercase">
              DriveVibes © 2026 — All Rights Reserved
            </p>
            {/* <p className="text-white/20 text-[10px] font-body tracking-wider">
              Built with ☕ and late nights by Ammar Tahir
            </p> */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
