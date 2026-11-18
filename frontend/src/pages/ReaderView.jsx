import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { api } from '../services/api';
import { Storage } from '../utils/storage';
import { useReading } from '../context/ReadingContext';
import ReaderToolbar from '../components/reader/ReaderToolbar';
import PdfReader from '../components/reader/PdfReader';

export default function ReaderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { readerSettings, updateReaderSettings, recordProgress, addBookmark, removeBookmark, bookmarks } = useReading();

  const [book, setBook] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [zoom, setZoom] = useState(1.0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const containerRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api.getBook(id)
      .then((data) => {
        if (!mounted) return;
        const b = data.book;
        setBook(b);
        setTotalPages(b.page_count || 1);
        const savedProgress = Storage.getProgress(b.id);
        if (savedProgress && savedProgress.page) setCurrentPage(savedProgress.page);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err.message || 'Failed to load book');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, [id]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || (totalPages > 0 && newPage > totalPages)) return;
    setCurrentPage(newPage);
    if (book) {
      recordProgress(book.id, {
        page: newPage,
        totalPages: totalPages || book.page_count || 1,
        bookTitle: book.title,
        author: book.author,
        coverUrl: book.cover_url,
        slug: book.slug,
      });
    }
  };

  const handleTotalPages = (num) => {
    setTotalPages(num);
    if (book) {
      recordProgress(book.id, {
        page: Math.min(currentPage, num),
        totalPages: num,
        bookTitle: book.title,
        author: book.author,
        coverUrl: book.cover_url,
        slug: book.slug,
      });
    }
  };

  const isCurrentBookmarked = book ? Storage.isBookmarked(book.id, currentPage) : false;
  const bookBookmarks = book ? bookmarks.filter((b) => String(b.bookId) === String(book.id)) : [];

  const handleToggleBookmark = () => {
    if (!book) return;
    if (isCurrentBookmarked) {
      const match = bookBookmarks.find((b) => b.page === currentPage);
      if (match) removeBookmark(match.id);
    } else {
      addBookmark(book.id, { bookTitle: book.title, page: currentPage });
    }
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  const getThemeClass = () => {
    switch (readerSettings.theme) {
      case 'light': return 'bg-[#FAF9F6] text-[#1A1A1A] border-slate-200';
      case 'sepia': return 'bg-[#F4ECD8] text-[#5B4636] border-[#DCCBB2]';
      case 'dark': return 'bg-[#1E2022] text-[#E4E6EB] border-slate-800';
      case 'oled': return 'bg-black text-[#CCCCCC] border-slate-900';
      default: return 'bg-[#F4ECD8] text-[#5B4636] border-[#DCCBB2]';
    }
  };

  if (loading) {
    return (
      <div className="min-h-[100dvh] bg-slate-900 flex flex-col items-center justify-center text-white space-y-4 px-4">
        <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        <p className="text-sm font-medium tracking-wide">Opening your digital book...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-[100dvh] bg-slate-900 flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
        <h2 className="text-xl font-bold text-red-400">Book Not Found</h2>
        <p className="text-sm text-slate-400 max-w-sm">{error || 'Unable to open the requested book.'}</p>
        <button
          onClick={() => navigate('/books')}
          className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm"
        >
          Return to Library
        </button>
      </div>
    );
  }

  const progressPct = Math.round((currentPage / (totalPages || 1)) * 100);

  return (
    <div
      ref={containerRef}
      className={`h-[100dvh] w-full flex flex-col transition-colors duration-200 select-none overflow-hidden ${getThemeClass()}`}
    >
      {/* 100% Ad-Free Reading Toolbar */}
      <ReaderToolbar
        book={book}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        isBookmarked={isCurrentBookmarked}
        onToggleBookmark={handleToggleBookmark}
        bookmarks={bookBookmarks}
        readerSettings={readerSettings}
        onUpdateSettings={updateReaderSettings}
        zoom={zoom}
        onZoomChange={setZoom}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
      />

      {/* Reader Body Canvas */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        <PdfReader
          fileUrl={book.file_url}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onTotalPages={handleTotalPages}
          zoom={zoom}
          theme={readerSettings.theme}
        />
      </main>

      {/* Thumb-friendly Bottom Page Bar for Mini Mobile & Wide Mobile (< 768px) */}
      <div className="md:hidden border-t border-inherit px-3 py-2 pb-safe flex items-center justify-between gap-2 flex-shrink-0">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 disabled:opacity-30 text-xs font-semibold min-w-[74px]"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>

        <div className="flex-1 flex flex-col items-center gap-1 px-1 min-w-0">
          <div className="text-[11px] font-semibold">
            {currentPage} / {totalPages} <span className="opacity-60">({progressPct}%)</span>
          </div>
          <input
            type="range"
            min={1}
            max={Math.max(1, totalPages)}
            value={currentPage}
            onChange={(e) => handlePageChange(parseInt(e.target.value, 10))}
            aria-label="Page slider"
            className="w-full h-1.5 accent-amber-500"
          />
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="flex items-center justify-center gap-1 px-3 py-2 rounded-xl bg-black/5 dark:bg-white/10 disabled:opacity-30 text-xs font-semibold min-w-[74px]"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Subtle Footer Bar for Tablet & Laptop (>= 768px) */}
      <footer className="hidden md:flex h-8 border-t border-inherit px-6 items-center justify-between text-[11px] opacity-60 flex-shrink-0">
        <span>Public Domain &bull; 100% Ad-Free Reader &bull; Arrow Keys or Swipe</span>
        <span>Page {currentPage} of {totalPages} ({progressPct}%)</span>
      </footer>
    </div>
  );
}
