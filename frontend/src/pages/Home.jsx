import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Search,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Layers
} from 'lucide-react';
import { api } from '../services/api';
import BookCard from '../components/BookCard';
import ContinueReading from '../components/ContinueReading';
import AdBanner from '../components/AdBanner';

export default function Home() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [recentBooks, setRecentBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    Promise.all([
      api.getFeaturedBooks(),
      api.getRecentBooks(),
      api.getCategories(),
    ])
      .then(([featuredRes, recentRes, catRes]) => {
        if (!mounted) return;
        setFeaturedBooks(featuredRes.books || []);
        setRecentBooks(recentRes.books || []);
        setCategories(catRes.categories || []);
      })
      .catch((err) => console.error('Failed to load homepage data:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/books?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/20 dark:via-slate-900 dark:to-slate-950 py-10 xs:py-12 sm:py-16 lg:py-24 border-b border-slate-200/60 dark:border-slate-800/60">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 text-center relative z-10">

          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800/80 text-amber-800 dark:text-amber-300 text-[11px] sm:text-xs font-semibold mb-4 sm:mb-6 shadow-sm max-w-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
            <span className="truncate">Free Public Domain & Open Digital Library</span>
          </div>

          <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 dark:text-white max-w-4xl mx-auto leading-[1.15]">
            Read Timeless Classics <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 bg-clip-text text-transparent">
              Without Registration or Barriers
            </span>
          </h1>

          <p className="mt-3.5 sm:mt-5 text-xs xs:text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed px-1">
            Discover public domain books and read directly in your browser on mobile, tablet, or laptop with automatic progress saving and a 100% ad-free reader.
          </p>

          {/* Responsive Search Box: Stacked on mini mobile, inline on wide mobile+ */}
          <div className="mt-6 sm:mt-8 max-w-2xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2 shadow-lg rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2"
            >
              <div className="flex items-center flex-1 min-w-0">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 ml-2.5 sm:ml-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search title, author, genre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm sm:text-base bg-transparent text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none min-w-0"
                />
              </div>
              <button
                type="submit"
                className="px-5 sm:px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm transition-all shadow-md shadow-amber-500/25 flex-shrink-0"
              >
                Search
              </button>
            </form>
          </div>

          {/* Feature Highlights */}
          <div className="mt-6 sm:mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2.5 text-[11px] xs:text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" /> No Login Required
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" /> 100% Ad-Free Reader
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <Clock className="w-4 h-4 text-blue-500 flex-shrink-0" /> Auto-Saved Progress
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 sm:py-10">

        <ContinueReading />

        <AdBanner slotKey="home_hero" />

        {/* Featured Books */}
        <section className="mb-10 sm:mb-14">
          <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex-shrink-0">
                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  Featured Masterpieces
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                  Curated foundational works of literature
                </p>
              </div>
            </div>

            <Link
              to="/books"
              className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 flex-shrink-0"
            >
              <span className="hidden xs:inline">Browse All</span>
              <span className="xs:hidden">All</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {featuredBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </section>

        <AdBanner slotKey="home_grid" />

        {/* Categories */}
        <section className="mb-10 sm:mb-14">
          <div className="flex items-center justify-between gap-2 mb-5 sm:mb-6">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex-shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="min-w-0">
                <h2 className="text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white truncate">
                  Explore by Category
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate">
                  Browse literature by genre and subject
                </p>
              </div>
            </div>

            <Link
              to="/categories"
              className="text-xs sm:text-sm font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 flex items-center gap-1 flex-shrink-0"
            >
              All <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/category/${cat.slug}`}
                className="group p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 shadow-sm hover:shadow-md transition-all text-center flex flex-col items-center justify-center space-y-2 min-w-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 dark:bg-slate-800 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-amber-50 dark:group-hover:bg-amber-950/40 transition-all">
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <h4 className="font-semibold text-xs sm:text-sm text-slate-900 dark:text-white line-clamp-1 w-full group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {cat.name}
                </h4>
                <span className="text-[10px] sm:text-[11px] text-slate-400">
                  {cat.book_count || 0} books
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recently Added */}
        <section className="mb-10 sm:mb-14">
          <div className="flex items-center gap-2.5 mb-5 sm:mb-6">
            <div className="p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex-shrink-0">
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h2 className="text-lg xs:text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                Recently Added Books
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
                Fresh additions to our digital collection
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {recentBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* Philosophy CTA Banner */}
        <section className="rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-700 to-amber-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-3 sm:space-y-4">
            <h3 className="text-xl xs:text-2xl sm:text-3xl font-extrabold tracking-tight">
              Knowledge Belongs to Everyone
            </h3>
            <p className="text-xs xs:text-sm sm:text-base text-amber-100 leading-relaxed">
              No subscription fees, no credit cards, and no account creation. Our library is supported transparently by discrete website ads, leaving your actual reading screen 100% serene and ad-free.
            </p>
            <div className="pt-2 flex flex-col xs:flex-row items-stretch xs:items-center gap-3">
              <Link
                to="/books"
                className="px-5 py-3 rounded-xl bg-white text-slate-900 font-bold text-sm text-center hover:bg-amber-50 shadow-md transition-all"
              >
                Start Reading Now
              </Link>
              <Link
                to="/about"
                className="px-5 py-3 rounded-xl bg-amber-800/60 hover:bg-amber-800 text-white font-semibold text-sm text-center border border-amber-500/40 transition-all"
              >
                About Our Mission
              </Link>
            </div>
          </div>
          <BookOpen className="w-56 h-56 sm:w-72 sm:h-72 text-white/5 absolute -right-8 -bottom-10 pointer-events-none" />
        </section>

      </div>
    </div>
  );
}
