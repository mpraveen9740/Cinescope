import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Film, User, LogOut, Bookmark, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, signOut, displayName, avatarUrl } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/discover?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/discover', label: 'Discover' },
    { to: '/trending', label: 'Trending' },
    { to: '/top-rated', label: 'Top Rated' },
    { to: '/watchlist', label: 'Watchlist' },
    { to: '/about', label: 'About' },
  ];

  return (
    <>
      <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
        <div className="navbar-inner">
          {/* Logo */}
          <Link to="/" className="navbar-logo">
            <div className="logo-icon">
              <Film size={22} />
            </div>
            <span className="logo-text">CineScope</span>
          </Link>

          {/* Desktop nav links */}
          <ul className="nav-links">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div className="nav-actions">
            {/* Search */}
            <button className="nav-icon-btn" onClick={() => setSearchOpen(true)} aria-label="Search">
              <Search size={20} />
            </button>

            {/* Auth */}
            {user ? (
              <div className="profile-dropdown-wrap">
                <button className="profile-btn" onClick={() => setProfileOpen(!profileOpen)}>
                  <img src={avatarUrl} alt={displayName} className="profile-avatar" />
                  <span className="profile-name">{displayName}</span>
                  <ChevronDown size={14} />
                </button>
                {profileOpen && (
                  <div className="profile-dropdown" onMouseLeave={() => setProfileOpen(false)}>
                    <Link to="/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <User size={15} /> Profile
                    </Link>
                    <Link to="/watchlist" className="dropdown-item" onClick={() => setProfileOpen(false)}>
                      <Bookmark size={15} /> Watchlist
                    </Link>
                    <button className="dropdown-item danger" onClick={() => { signOut(); setProfileOpen(false); }}>
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-sm">Sign In</Link>
            )}

            {/* Hamburger */}
            <button className="hamburger-btn" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="mobile-menu">
          {navLinks.map(({ to, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className="mobile-nav-link"
              onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <div className="mobile-menu-bottom">
            {user ? (
              <button className="btn btn-outline w-full" onClick={() => { signOut(); setMenuOpen(false); }}>
                Sign Out
              </button>
            ) : (
              <Link to="/login" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Search overlay */}
      {searchOpen && (
        <div className="search-overlay" onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="search-modal">
            <form onSubmit={handleSearch} className="search-form">
              <Search size={22} className="search-icon-form" />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search movies, genres..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input-modal"
              />
              <button type="button" className="search-close-btn" onClick={() => setSearchOpen(false)}>
                <X size={20} />
              </button>
            </form>
            <p className="search-hint">Press Enter to search</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
