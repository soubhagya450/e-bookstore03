import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import BookCard from '../components/BookCard';
import AdBanner from '../components/AdBanner';

export default function CategoryDetail() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getCategory(slug)
      .then((data) => {
        if (!mounted) return;
        setCategory(data.category);
        setBooks(data.books || []);
      })
      .catch((err) => console.error(err))
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!category) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <Link to="/categories" className="text-amber-600 underline">Back to categories</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">
      <Link
        to="/categories"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 mb-5 sm:mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> All Categories
      </Link>

      <div className="mb-6 sm:mb-8 p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-tr from-amber-500/10 to-amber-500/5 dark:from-slate-900 dark:to-slate-950 border border-amber-200/50 dark:border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {category.name}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-2 max-w-2xl leading-relaxed">
          {category.description}
        </p>
        <span className="inline-block mt-4 text-xs font-semibold text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-800">
          {books.length} Books in Collection
        </span>
      </div>

      <AdBanner slotKey="category_banner" className="mb-6 sm:mb-8" />

      {books.length === 0 ? (
        <div className="py-16 text-center text-slate-400 space-y-2">
          <BookOpen className="w-12 h-12 mx-auto" />
          <p className="text-sm">No books have been published in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
