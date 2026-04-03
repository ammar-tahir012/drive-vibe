import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { searchCities } from '../api/cities';
import { useDebounce } from '../hooks/useDebounce';

const Navbar = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleCitySelect = (cityName, countryCode) => {
    if (cityName && countryCode) {
      setIsSearchOpen(false);
      setSearchQuery('');
      setResults([]);
      navigate(`/city/${encodeURIComponent(cityName)}/${encodeURIComponent(countryCode)}`);
    }
  };

  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  // Debounced search logic using custom hook
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

  const navLinks = [
    { name: 'Explore', path: '/' },
    { name: 'Moods', path: '/#moods' },
    { name: 'About', path: '/#about' },
  ];

  const Logo = () => (
    <Link to="/" className="flex items-center gap-3 group">
      <div className="w-10 h-10 flex items-center justify-center rounded-full border border-brand-gold/30 group-hover:border-brand-gold transition-colors">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#e8c97a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="2" x2="12" y2="22"></line>
          <line x1="2" y1="12" x2="22" y2="12"></line>
          <circle cx="12" cy="12" r="3"></circle>
          <path d="M4.93 4.93l14.14 14.14"></path>
          <path d="M19.07 4.93L4.93 19.07"></path>
        </svg>
      </div>
      <span className="font-display italic text-xl sm:text-2xl text-brand-gold">DriveVibes</span>
    </Link>
  );

  return (
    <>
      <nav className="sticky top-0 z-50 w-full bg-[#0c0c0e]/85 backdrop-blur-[24px] border-b border-white/5 px-4 sm:px-6 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Logo */}
          <Logo />

          {/* Center: Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path || (link.path !== '/' && location.hash === link.path.split('#')[1]);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative font-body text-sm transition-colors duration-300 ${
                    isActive ? 'text-brand-gold' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-brand-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-white/60 hover:text-white transition-colors"
              aria-label="Search"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>

            <button 
              onClick={() => navigate('/#explore')}
              className="hidden sm:block px-5 py-2 rounded-full bg-brand-gold text-brand-dark font-medium text-sm hover:shadow-glow hover:scale-105 transition-all duration-300"
            >
              Start Driving →
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsDrawerOpen(true)}
              className="md:hidden p-2 text-white/60 hover:text-white"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-black/95 backdrop-blur-xl flex flex-col items-center pt-20 sm:pt-32 px-4 sm:px-6">
          <button
            onClick={() => setIsSearchOpen(false)}
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 text-white/60 hover:text-white transition-colors"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div className="w-full max-w-3xl relative">
            <input
              type="text"
              autoFocus
              placeholder="Search any city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white text-2xl sm:text-3xl md:text-5xl placeholder:text-white/20 focus:ring-0 focus:outline-none font-display text-center"
            />
            <div className="mt-4 h-[2px] w-full bg-white/10 overflow-hidden">
               <div className={`h-full bg-brand-gold transition-all duration-500 ease-in-out ${searchQuery ? 'w-full' : 'w-0'}`} />
            </div>

            {/* Results Dropdown */}
            {results.length > 0 && (
              <div className="mt-8 grid gap-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                {results.map((city, idx) => (
                  <button
                    key={`${city.city}-${idx}`}
                    onClick={() => handleCitySelect(city.city, city.countryCode)}
                    className="flex flex-col items-center p-4 rounded-xl hover:bg-white/5 transition-colors text-center group"
                  >
                    <span className="text-white text-2xl font-body group-hover:text-brand-gold transition-colors">
                      {city.city}
                    </span>
                    <span className="text-brand-gold/60 text-sm">{city.country}</span>
                  </button>
                ))}
              </div>
            )}
            
            {searchQuery && results.length === 0 && !isSearching && (
               <p className="mt-8 text-center text-white/40">No cities found. Try another search.</p>
            )}
          </div>
        </div>
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsDrawerOpen(false)}>
        <div 
          className={`absolute right-0 top-0 h-full w-64 bg-[#0c0c0e] border-l border-white/5 shadow-2xl transition-transform duration-300 transform ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
          onClick={e => e.stopPropagation()}
        >
          <div className="p-6 flex flex-col gap-8">
            <button onClick={() => setIsDrawerOpen(false)} className="self-end text-white/60 hover:text-white">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsDrawerOpen(false)}
                  className="font-body text-xl text-white/80 hover:text-brand-gold transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-white/5" />
              <button 
                onClick={() => {
                  setIsDrawerOpen(false);
                  navigate('/#explore');
                }}
                className="w-full py-3 rounded-full bg-brand-gold text-brand-dark font-medium"
              >
                Start Driving →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
