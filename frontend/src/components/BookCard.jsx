import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Eye, Award, Clock } from 'lucide-react';
import { useReading } from '../context/ReadingContext';

export default function BookCard({ book }) {
  const { inProgressBooks } = useReading();
  const inProgress = inProgressBooks.find((p) => String(p.bookId) === String(book.id));

  const getLicenseLabel = (status) => {
    switch (status) {
      case 'public_domain': return 'Public Domain';
      case 'creative_commons': return 'CC Licensed';
      case 'author_permission': return 'Authorized';
      default: return 'Open Access';
    }
  };

  return (
    <div className="group flex flex-col bg-white dark:bg-slate-900 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl sm:hover:-translate-y-1 transition-all duration-300 overflow-hidden min-w-0">

      {/* Cover Container */}
      <Link to={`/book/${book.slug || book.id}`} className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 block">
        {book.cover_url ? (
          <img
            src={book.cover_url}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-6 text-center bg-gradient-to-tr from-slate-800 to-slate-900 text-white">
            <BookOpen className="w-9 h-9 sm:w-12 sm:h-12 text-amber-400 mb-2 sm:mb-3" />
            <h4 className="font-serif font-bold text-sm sm:text-lg leading-snug line-clamp-2">{book.title}</h4>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1.5 line-clamp-1">{book.author}</p>
          </div>
        )}

        {/* License Pill */}
        <div className="absolute top-2 left-2 z-10 max-w-[calc(100%-1rem)]">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] xs:text-[10px] sm:text-[11px] font-semibold tracking-wide bg-slate-950/75 backdrop-blur-md text-amber-300 border border-white/10 shadow-sm truncate">
            <Award className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-amber-400 flex-shrink-0" />
            <span className="truncate">{getLicenseLabel(book.copyright_status)}</span>
          </span>
        </div>

        {/* Progress overlay */}
        {inProgress && (
          <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 backdrop-blur-md px-2.5 py-1.5 flex items-center justify-between text-[10px] sm:text-[11px] text-white">
            <span className="text-amber-300 font-medium truncate">p. {inProgress.page}/{inProgress.totalPages || book.page_count}</span>
            <span className="font-bold ml-1">{inProgress.percent}%</span>
          </div>
        )}
      </Link>

      {/* Book Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between min-w-0">
        <div>
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium text-amber-600 dark:text-amber-400 truncate">
              {book.category_name || 'General'}
            </span>
            {book.published_year && (
              <span className="text-[10px] text-slate-400 flex-shrink-0">
                {book.published_year > 0 ? book.published_year : `${Math.abs(book.published_year)} BCE`}
              </span>
            )}
          </div>

          <Link to={`/book/${book.slug || book.id}`}>
            <h3 className="font-semibold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {book.title}
            </h3>
          </Link>

          <p className="text-[11px] sm:text-xs text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-1">
            {book.author}
          </p>
        </div>

        {/* Footer Meta & Actions */}
        <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-slate-400 min-w-0">
            <span className="flex items-center gap-0.5 sm:gap-1">
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              {book.view_count || 0}
            </span>
            <span className="hidden xs:flex items-center gap-0.5 sm:gap-1">
              <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
              {book.page_count || 1}p
            </span>
          </div>

          <Link
            to={`/read/${book.id}`}
            className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-sm shadow-amber-500/20 transition-all active:scale-95 flex-shrink-0"
          >
            <BookOpen className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>{inProgress ? 'Resume' : 'Read'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
