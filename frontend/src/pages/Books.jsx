import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookX } from 'lucide-react';
import { api } from '../services/api';
import BookCard from '../components/BookCard';
import AdBanner from '../components/AdBanner';

export default function Books() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, total_pages: 1, total_items: 0 });
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || '';
  const selectedLicense = searchParams.get('license') || '';
  const sortBy = searchParams.get('sort') || 'recent';
  const page = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    api.getCategories().then((data) => setCategories(data.categories || []));
  }, []);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getBooks({ q: searchQuery, category: selectedCategory, license: selectedLicense, sort: sortBy, page, limit: 12 })
      .then((data) => {
        if (!mounted) return;
        setBooks(data.books || []);
        setPagination(data.pagination || { page: 1, total_pages: 1, total_items: 0 });
      })
      .catch((err) => console.error('Failed to load books:', err))
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [searchQuery, selectedCategory, selectedLicense, sortBy, page]);

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.set('page', '1');
    setSearchParams(next);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Explore Digital Library
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Browse {pagination.total_items} open-access and public domain titles
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 xs:p-4 mb-6 sm:mb-8 shadow-sm space-y-3 sm:space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title, author, description..."
            value={searchQuery}
            onChange={(e) => updateParam('q', e.target.value)}
            className="w-full pl-10 sm:pl-11 pr-4 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => updateParam('category', e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>{c.name} ({c.book_count || 0})</option>
            ))}
          </select>

          <select
            value={selectedLicense}
            onChange={(e) => updateParam('license', e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Licenses</option>
            <option value="public_domain">Public Domain</option>
            <option value="creative_commons">Creative Commons</option>
            <option value="author_permission">Author Permission</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => updateParam('sort', e.target.value)}
            className="w-full xs:col-span-2 sm:col-span-1 px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          >
            <option value="recent">Sort: Recently Added</option>
            <option value="popular">Sort: Most Popular</option>
            <option value="title_asc">Title (A &rarr; Z)</option>
            <option value="title_desc">Title (Z &rarr; A)</option>
          </select>
        </div>
      </div>

      {/* Book Grid */}
      {loading ? (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="py-16 sm:py-20 text-center space-y-4 px-4">
          <BookX className="w-14 h-14 text-slate-400 mx-auto" />
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No books match your criteria</h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, selecting another category, or resetting filters.
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {books.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>

          <AdBanner slotKey="home_grid" className="my-8 sm:my-10" />

          {pagination.total_pages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2 sm:gap-3">
              <button
                disabled={page <= 1}
                onClick={() => updateParam('page', page - 1)}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                &larr; Prev
              </button>
              <span className="text-xs text-slate-500 px-2">
                Page {pagination.page} / {pagination.total_pages}
              </span>
              <button
                disabled={page >= pagination.total_pages}
                onClick={() => updateParam('page', page + 1)}
                className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
