import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useReading } from '../context/ReadingContext';

export default function ContinueReading() {
  const { inProgressBooks } = useReading();

  if (!inProgressBooks || inProgressBooks.length === 0) return null;

  const recentItems = inProgressBooks.slice(0, 3);

  return (
    <section className="mb-10 sm:mb-12">
      <div className="flex items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Continue Reading
          </h2>
        </div>
        <Link
          to="/my-shelf"
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1 flex-shrink-0"
        >
          My Shelf <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {recentItems.map((item) => (
          <div
            key={item.bookId}
            className="flex items-center gap-3 sm:gap-4 p-3 sm:p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group min-w-0"
          >
            <Link to={`/read/${item.bookId}`} className="w-14 sm:w-16 aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm block">
              {item.coverUrl ? (
                <img src={item.coverUrl} alt={item.bookTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/read/${item.bookId}`}>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {item.bookTitle}
                </h4>
              </Link>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-2">{item.author}</p>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Page {item.page}/{item.totalPages}</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">{item.percent}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full transition-all duration-300" style={{ width: `${item.percent}%` }} />
                </div>
              </div>

              <div className="mt-2.5 flex items-center justify-between">
                <Link
                  to={`/read/${item.bookId}`}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700"
                >
                  <Play className="w-3 h-3 fill-current" /> Resume
                </Link>
                {item.percent >= 100 && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                    <CheckCircle2 className="w-3 h-3" /> Done
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
