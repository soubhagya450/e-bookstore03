import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen,
  Award,
  Eye,
  Clock,
  Globe,
  Calendar,
  ShieldCheck,
  Flag,
  Share2,
} from 'lucide-react';
import { api } from '../services/api';
import { useReading } from '../context/ReadingContext';
import BookCard from '../components/BookCard';
import AdBanner from '../components/AdBanner';
import ReportModal from '../components/ReportModal';

export default function BookDetail() {
  const { slug } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { inProgressBooks } = useReading();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getBook(slug)
      .then((data) => { if (mounted) setBook(data.book); })
      .catch((err) => { if (mounted) setError(err.message || 'Book not found'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: book.title,
        text: `Read "${book.title}" by ${book.author} for free on eBook Digital Library!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const inProgress = book ? inProgressBooks.find((p) => String(p.bookId) === String(book.id)) : null;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex justify-center">
        <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Book Not Found</h2>
        <p className="text-sm text-slate-500">{error || 'The book you requested is unavailable.'}</p>
        <Link to="/books" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm">
          Browse Library
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">

      {/* Breadcrumb (scrollable on mini mobile without breaking layout) */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs text-slate-400 mb-6 sm:mb-8 overflow-x-auto no-scrollbar whitespace-nowrap">
        <Link to="/" className="hover:text-slate-600 dark:hover:text-slate-300">Home</Link>
        <span>/</span>
        <Link to="/books" className="hover:text-slate-600 dark:hover:text-slate-300">Books</Link>
        <span>/</span>
        <Link to={`/category/${book.category_slug}`} className="hover:text-slate-600 dark:hover:text-slate-300">
          {book.category_name}
        </Link>
        <span>/</span>
        <span className="text-slate-600 dark:text-slate-300 truncate max-w-[160px] sm:max-w-xs">{book.title}</span>
      </nav>

      {/* Main Grid: Centered compact cover on mobile/tablet, 12-col split on laptop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* Left Column: Cover & Actions */}
        <div className="lg:col-span-4 space-y-5 sm:space-y-6">
          <div className="aspect-[3/4] w-full max-w-[240px] xs:max-w-[270px] sm:max-w-[300px] lg:max-w-none mx-auto rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
            {book.cover_url ? (
              <img src={book.cover_url} alt={book.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-slate-800 flex flex-col items-center justify-center p-6 text-center text-white">
                <BookOpen className="w-14 h-14 text-amber-400 mb-3" />
                <h3 className="font-serif font-bold text-lg">{book.title}</h3>
                <p className="text-xs text-slate-400 mt-2">{book.author}</p>
              </div>
            )}
          </div>

          <div className="max-w-sm lg:max-w-none mx-auto space-y-2.5 sm:space-y-3">
            <Link
              to={`/read/${book.id}`}
              className="w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
            >
              <BookOpen className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{inProgress ? `Continue (Page ${inProgress.page})` : 'Read Online Free'}</span>
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Share2 className="w-4 h-4 text-slate-400" />
                <span>{copied ? 'Link Copied!' : 'Share Book'}</span>
              </button>

              <button
                onClick={() => setReportModalOpen(true)}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors"
                title="Report Copyright or Content Issue"
                aria-label="Report issue"
              >
                <Flag className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="hidden lg:block">
            <AdBanner slotKey="book_detail_sidebar" />
          </div>
        </div>

        {/* Right Column: Title, Specs, Description & Related */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8 min-w-0">
          <div className="text-center lg:text-left">
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-3">
              <Link
                to={`/category/${book.category_slug}`}
                className="px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
              >
                {book.category_name}
              </Link>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                <ShieldCheck className="w-3.5 h-3.5" />
                {book.license_name || 'Public Domain'}
              </span>
            </div>

            <h1 className="text-2xl xs:text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight font-serif">
              {book.title}
            </h1>
            <p className="text-sm sm:text-lg text-slate-600 dark:text-slate-400 mt-2 font-medium">
              By <span className="text-slate-900 dark:text-slate-200 font-semibold">{book.author}</span>
            </p>
          </div>

          {/* Quick Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <Clock className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 block">Length</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{book.page_count} pages</span>
            </div>
            <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <Eye className="w-4 h-4 text-blue-500 mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 block">Reads</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{book.view_count || 1} views</span>
            </div>
            <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <Globe className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 block">Language</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">{book.language || 'English'}</span>
            </div>
            <div className="p-3 sm:p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center">
              <Calendar className="w-4 h-4 text-purple-500 mx-auto mb-1" />
              <span className="text-[11px] text-slate-400 block">Published</span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                {book.published_year ? (book.published_year > 0 ? book.published_year : `${Math.abs(book.published_year)} BCE`) : 'Historical'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2.5 sm:space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Synopsis & Overview</h3>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base whitespace-pre-line">
              {book.description || 'No description provided for this edition.'}
            </p>
          </div>

          {/* Copyright Box */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              <Award className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Copyright & Licensing Verification</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              <strong>License:</strong> {book.license_name || 'Public Domain'}. {book.copyright_notes || 'Verified public domain or open content authorization.'}
            </p>
            <p className="text-[11px] text-slate-400">
              Believe this work infringes copyright?{' '}
              <button onClick={() => setReportModalOpen(true)} className="text-amber-600 dark:text-amber-400 underline font-medium">
                Submit a takedown request
              </button>.
            </p>
          </div>

          <AdBanner slotKey="book_detail_bottom" />

          {/* Related Books */}
          {book.related_books && book.related_books.length > 0 && (
            <div className="pt-6 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">
                More in {book.category_name}
              </h3>
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {book.related_books.map((rel) => (
                  <BookCard key={rel.id} book={rel} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <ReportModal isOpen={reportModalOpen} onClose={() => setReportModalOpen(false)} book={book} />
    </div>
  );
}
