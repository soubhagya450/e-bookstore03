import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Bookmark,
  Moon,
  Sun,
  Library,
  Compass,
  Menu,
  X,
  Home as HomeIcon,
} from 'lucide-react';
import { useReading } from '../context/ReadingContext';

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { appTheme, toggleAppTheme, inProgressBooks } = useReading();

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.search]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const navLinks = [
    { to: '/books', label: 'Explore', icon: Compass },
    { to: '/categories', label: 'Categories', icon: Library },
    { to: '/my-shelf', label: 'My Shelf', icon: Bookmark, hasBadge: inProgressBooks.length > 0 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 transition-colors duration-200 pt-safe">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">

            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-2 xs:gap-2.5 sm:gap-3 group flex-shrink-0 min-w-0">
              <div className="w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform flex-shrink-0">
                <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-base xs:text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1 truncate">
                  eBook
                  <span className="text-amber-600 dark:text-amber-400 font-serif text-[10px] xs:text-xs sm:text-sm px-1.5 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/60">
                    Library
                  </span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden lg:block">
                  Free &bull; No Login Required
                </p>
              </div>
            </Link>

            {/* Tablet & Laptop Search Input */}
            <div className="flex-1 max-w-md hidden md:block">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by title, author, topic..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm rounded-full bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-amber-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-all"
                />
              </form>
            </div>

            {/* Tablet & Laptop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {navLinks.map(({ to, label, icon: Icon, hasBadge }) => (
                <Link
                  key={to}
                  to={to}
                  className={`relative px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ${
                    isActive(to)
                      ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {hasBadge && (
                    <span className="w-2 h-2 rounded-full bg-amber-500 absolute top-1.5 right-1.5 animate-pulse" />
                  )}
                </Link>
              ))}

              <button
                onClick={toggleAppTheme}
                aria-label="Toggle theme"
                className="p-2.5 ml-1 rounded-lg text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {appTheme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </nav>

            {/* Mobile Controls (Mini Mobile + Wide Mobile) */}
            <div className="flex md:hidden items-center gap-1">
              <button
                onClick={() => {
                  setMobileSearchOpen((v) => !v);
                  setMobileMenuOpen(false);
                }}
                aria-label="Toggle search"
                className={`p-2.5 rounded-xl transition-colors ${
                  mobileSearchOpen
                    ? 'bg-amber-500 text-white'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Search className="w-4 h-4 xs:w-5 xs:h-5" />
              </button>

              <button
                onClick={toggleAppTheme}
                aria-label="Toggle theme"
                className="p-2.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {appTheme === 'dark' ? <Sun className="w-4 h-4 xs:w-5 xs:h-5" /> : <Moon className="w-4 h-4 xs:w-5 xs:h-5" />}
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen((v) => !v);
                  setMobileSearchOpen(false);
                }}
                aria-label="Open menu"
                className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Collapsible Mobile Search Bar */}
          {mobileSearchOpen && (
            <div className="pb-3 pt-1 md:hidden">
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    autoFocus
                    placeholder="Search title, author..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold flex-shrink-0"
                >
                  Go
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Drawer Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 xs:px-4 py-3 space-y-1 shadow-lg">
            <Link
              to="/"
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium ${
                isActive('/')
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                  : 'text-slate-700 dark:text-slate-300'
              }`}
            >
              <HomeIcon className="w-4 h-4" />
              <span>Home</span>
            </Link>
            {navLinks.map(({ to, label, icon: Icon, hasBadge }) => (
              <Link
                key={to}
                to={to}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                  isActive(to)
                    ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </span>
                {hasBadge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white">
                    {inProgressBooks.length}
                  </span>
                )}
              </Link>
            ))}
            <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-1 text-xs">
              <Link to="/about" className="px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">About</Link>
              <Link to="/privacy" className="px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">Privacy</Link>
              <Link to="/terms" className="px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">Terms</Link>
              <Link to="/dmca" className="px-3 py-2 rounded-lg text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800">Copyright / DMCA</Link>
            </div>
          </div>
        )}
      </header>

      {/* Thumb-friendly Mobile Bottom Navigation Bar (Mini Mobile & Wide Mobile) */}
      <nav
        aria-label="Mobile navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe"
      >
        <div className="grid grid-cols-4 h-14 max-w-lg mx-auto">
          <Link
            to="/"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] xs:text-[11px] font-medium transition-colors ${
              isActive('/') ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link
            to="/books"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] xs:text-[11px] font-medium transition-colors ${
              isActive('/books') ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Explore</span>
          </Link>
          <Link
            to="/categories"
            className={`flex flex-col items-center justify-center gap-0.5 text-[10px] xs:text-[11px] font-medium transition-colors ${
              isActive('/categories') || isActive('/category') ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <Library className="w-5 h-5" />
            <span>Genres</span>
          </Link>
          <Link
            to="/my-shelf"
            className={`relative flex flex-col items-center justify-center gap-0.5 text-[10px] xs:text-[11px] font-medium transition-colors ${
              isActive('/my-shelf') ? 'text-amber-600 dark:text-amber-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="relative">
              <Bookmark className="w-5 h-5" />
              {inProgressBooks.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-amber-500 absolute -top-0.5 -right-1" />
              )}
            </div>
            <span>Shelf</span>
          </Link>
        </div>
      </nav>
    </>
  );
}
