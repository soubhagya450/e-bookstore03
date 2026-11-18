import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Clock, Play, Trash2, BookOpen, ShieldCheck, ArrowRight } from 'lucide-react';
import { useReading } from '../context/ReadingContext';

export default function MyShelf() {
  const { inProgressBooks, history, bookmarks, removeBookmark, clearAllHistory } = useReading();
  const [activeTab, setActiveTab] = useState('reading');

  return (
    <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-6 sm:py-10 min-h-screen">

      {/* Header & Responsive Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            My Reading Shelf
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Stored privately in your browser &bull; Zero login required</span>
          </p>
        </div>

        {/* Full-width compact segmented control on mobile, auto-width on tablet/laptop */}
        <div className="grid grid-cols-3 md:flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-1 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('reading')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-[11px] xs:text-xs font-semibold transition-all truncate ${
              activeTab === 'reading'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Reading ({inProgressBooks.length})
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-[11px] xs:text-xs font-semibold transition-all truncate ${
              activeTab === 'bookmarks'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Marks ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-2.5 sm:px-4 py-2 rounded-lg text-[11px] xs:text-xs font-semibold transition-all truncate ${
              activeTab === 'history'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            History ({history.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Continue Reading */}
      {activeTab === 'reading' && (
        <div>
          {inProgressBooks.length === 0 ? (
            <div className="py-16 sm:py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">Your reading shelf is empty</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                Start reading any book and your progress will automatically appear here.
              </p>
              <Link to="/books" className="inline-block px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold">
                Explore Books Now
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {inProgressBooks.map((item) => (
                <div key={item.bookId} className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-w-0">
                  <div className="flex gap-3.5 sm:gap-4 min-w-0">
                    <Link to={`/read/${item.bookId}`} className="w-16 sm:w-20 aspect-[3/4] rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm block">
                      {item.coverUrl ? (
                        <img src={item.coverUrl} alt={item.bookTitle} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                          <BookOpen className="w-7 h-7" />
                        </div>
                      )}
                    </Link>
                    <div className="min-w-0 flex-1">
                      <Link to={`/read/${item.bookId}`}>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate hover:text-amber-600">
                          {item.bookTitle}
                        </h4>
                      </Link>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{item.author}</p>
                      <p className="text-[11px] text-slate-400 mt-2">
                        Last read: {new Date(item.lastReadAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500">Page {item.page} of {item.totalPages}</span>
                      <span className="font-bold text-amber-600 dark:text-amber-400">{item.percent}%</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden mb-3">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${item.percent}%` }} />
                    </div>
                    <Link
                      to={`/read/${item.bookId}`}
                      className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Resume Reading</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Bookmarks */}
      {activeTab === 'bookmarks' && (
        <div>
          {bookmarks.length === 0 ? (
            <div className="py-16 sm:py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <Bookmark className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No saved bookmarks yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                While reading any book, tap the bookmark icon on any page to save it.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {bookmarks.map((b) => (
                <div key={b.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-2 min-w-0">
                  <div className="min-w-0">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                      Page {b.page}
                    </span>
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate mt-1.5">{b.bookTitle}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Link
                      to={`/read/${b.bookId}`}
                      className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-amber-500 hover:text-white text-xs font-semibold transition-colors"
                    >
                      Jump
                    </Link>
                    <button
                      onClick={() => removeBookmark(b.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Remove bookmark"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: History */}
      {activeTab === 'history' && (
        <div>
          {history.length === 0 ? (
            <div className="py-16 sm:py-20 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4">
              <Clock className="w-12 h-12 text-slate-400 mx-auto" />
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">No reading history yet</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Books you open will appear in your private history.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-end">
                <button
                  onClick={clearAllHistory}
                  className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Clear History
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden">
                {history.map((item) => (
                  <div key={item.bookId} className="p-3.5 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-14 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                        {item.coverUrl ? (
                          <img src={item.coverUrl} alt={item.bookTitle} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                            <BookOpen className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <Link to={`/read/${item.bookId}`}>
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate hover:text-amber-600">
                            {item.bookTitle}
                          </h4>
                        </Link>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{item.author}</p>
                        <p className="text-[11px] text-slate-400">{new Date(item.lastReadAt).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <Link
                      to={`/read/${item.bookId}`}
                      className="px-3 py-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1 flex-shrink-0"
                    >
                      <span>Read</span> <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
