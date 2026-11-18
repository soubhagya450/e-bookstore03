import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  BookmarkCheck,
  Maximize,
  Minimize,
  Sliders,
  X,
  List,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export default function ReaderToolbar({
  book,
  currentPage,
  totalPages,
  onPageChange,
  isBookmarked,
  onToggleBookmark,
  bookmarks,
  readerSettings,
  onUpdateSettings,
  zoom,
  onZoomChange,
  isFullscreen,
  onToggleFullscreen,
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showBookmarks, setShowBookmarks] = useState(false);

  const themeOptions = [
    { id: 'light', label: 'Light', bg: 'bg-[#FAF9F6]', text: 'text-slate-900', border: 'border-slate-300' },
    { id: 'sepia', label: 'Sepia', bg: 'bg-[#F4ECD8]', text: 'text-[#5B4636]', border: 'border-[#DCCBB2]' },
    { id: 'dark', label: 'Night', bg: 'bg-[#1E2022]', text: 'text-slate-100', border: 'border-slate-700' },
    { id: 'oled', label: 'OLED', bg: 'bg-black', text: 'text-slate-200', border: 'border-slate-800' },
  ];

  const fontOptions = [
    { id: 'serif', label: 'Serif' },
    { id: 'sans', label: 'Sans' },
    { id: 'mono', label: 'Mono' },
  ];

  const togglePanel = (panel) => {
    if (panel === 'settings') {
      setShowSettings((v) => !v);
      setShowBookmarks(false);
    } else {
      setShowBookmarks((v) => !v);
      setShowSettings(false);
    }
  };

  return (
    <>
      <header className="h-14 border-b border-inherit px-2 xs:px-3 sm:px-6 flex items-center justify-between gap-2 transition-colors z-30 flex-shrink-0 pt-safe">
        <div className="flex items-center gap-1.5 xs:gap-2.5 min-w-0 flex-1 md:flex-initial">
          <Link
            to={`/book/${book?.slug || book?.id}`}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-inherit flex-shrink-0"
            title="Exit Reader"
            aria-label="Exit Reader"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-xs xs:text-sm font-semibold truncate leading-tight">{book?.title}</h1>
            <p className="text-[10px] xs:text-[11px] opacity-70 truncate">{book?.author}</p>
          </div>
        </div>

        {/* Center Page Controls (Tablet & Laptop) */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Previous Page (Left Arrow)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-black/5 dark:bg-white/10">
            <span>{currentPage}</span>
            <span className="opacity-50">/</span>
            <span>{totalPages || 1}</span>
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Next Page (Right Arrow)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-1.5 flex-shrink-0">
          <div className="hidden lg:flex items-center gap-0.5 mr-1">
            <button
              onClick={() => onZoomChange(Math.max(0.7, +(zoom - 0.15).toFixed(2)))}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono px-1 opacity-70 w-11 text-center">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => onZoomChange(Math.min(2.4, +(zoom + 0.15).toFixed(2)))}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onToggleBookmark}
            className={`p-2 rounded-lg transition-colors ${
              isBookmarked ? 'text-amber-500 bg-amber-500/10' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title={isBookmarked ? 'Page Bookmarked' : 'Bookmark this page'}
            aria-label="Bookmark page"
          >
            {isBookmarked ? <BookmarkCheck className="w-4 h-4 sm:w-5 sm:h-5" /> : <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>

          <button
            onClick={() => togglePanel('bookmarks')}
            className={`p-2 rounded-lg transition-colors relative ${
              showBookmarks ? 'bg-amber-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="View Bookmarks"
            aria-label="Bookmarks list"
          >
            <List className="w-4 h-4 sm:w-5 sm:h-5" />
            {bookmarks.length > 0 && !showBookmarks && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 absolute top-1.5 right-1.5" />
            )}
          </button>

          <button
            onClick={() => togglePanel('settings')}
            className={`p-2 rounded-lg transition-colors ${
              showSettings ? 'bg-amber-500 text-white' : 'hover:bg-black/5 dark:hover:bg-white/10'
            }`}
            title="Reading Display Settings"
            aria-label="Reading settings"
          >
            <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors hidden sm:block"
            title="Toggle Fullscreen"
            aria-label="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {(showSettings || showBookmarks) && (
        <div
          onClick={() => {
            setShowSettings(false);
            setShowBookmarks(false);
          }}
          className="fixed inset-0 z-30 bg-black/25 sm:bg-transparent"
        />
      )}

      {/* Reader Settings Panel: Bottom Sheet on Mobile, Dropdown on Tablet/Laptop */}
      {showSettings && (
        <div className="fixed inset-x-3 bottom-16 sm:inset-auto sm:top-16 sm:right-6 z-40 sm:w-80 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-slate-900 dark:text-slate-100">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Reading Display</h4>
            <button onClick={() => setShowSettings(false)} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">Color Theme</label>
            <div className="grid grid-cols-4 gap-2">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onUpdateSettings({ theme: t.id })}
                  className={`py-2 px-1 rounded-xl text-center text-[11px] font-medium border transition-all ${t.bg} ${t.text} ${t.border} ${
                    readerSettings.theme === t.id ? 'ring-2 ring-amber-500 ring-offset-1 font-bold' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4 lg:hidden">
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
              <span>Page Zoom</span>
              <span className="font-mono font-semibold">{Math.round(zoom * 100)}%</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onZoomChange(Math.max(0.7, +(zoom - 0.15).toFixed(2)))}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <ZoomOut className="w-3.5 h-3.5" /> Out
              </button>
              <button
                onClick={() => onZoomChange(1.0)}
                className="px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
              >
                Fit
              </button>
              <button
                onClick={() => onZoomChange(Math.min(2.4, +(zoom + 0.15).toFixed(2)))}
                className="flex-1 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1"
              >
                <ZoomIn className="w-3.5 h-3.5" /> In
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-2">Typography</label>
            <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1">
              {fontOptions.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onUpdateSettings({ fontFamily: f.id })}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    readerSettings.fontFamily === f.id
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm font-semibold'
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span>Text Scale</span>
              <span className="font-mono">{readerSettings.fontSize}px</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs font-serif">A</span>
              <input
                type="range"
                min="14"
                max="28"
                step="1"
                value={readerSettings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value, 10) })}
                className="w-full accent-amber-500"
              />
              <span className="text-base font-serif font-bold">A</span>
            </div>
          </div>
        </div>
      )}

      {/* Bookmarks Panel: Bottom Sheet on Mobile, Dropdown on Tablet/Laptop */}
      {showBookmarks && (
        <div className="fixed inset-x-3 bottom-16 sm:inset-auto sm:top-16 sm:right-14 z-40 sm:w-80 max-h-[65vh] rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-4 text-slate-900 dark:text-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Bookmarks ({bookmarks.length})</h4>
            </div>
            <button onClick={() => setShowBookmarks(false)} className="p-1 text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">
                No bookmarks yet. Tap the bookmark icon on any page to save your spot!
              </p>
            ) : (
              bookmarks.map((b) => (
                <button
                  key={b.id}
                  onClick={() => {
                    onPageChange(b.page);
                    setShowBookmarks(false);
                  }}
                  className="w-full text-left p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50 dark:hover:bg-amber-950/30 border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="text-xs font-bold text-amber-600 dark:text-amber-400">Page {b.page}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{new Date(b.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Jump &rarr;</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
