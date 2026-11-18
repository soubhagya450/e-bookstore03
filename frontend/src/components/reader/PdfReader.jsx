import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfReader({
  fileUrl,
  currentPage,
  onPageChange,
  onTotalPages,
  zoom = 1.0,
  theme = 'sepia',
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const renderTaskRef = useRef(null);
  const touchStartRef = useRef(null);

  const [pdfDoc, setPdfDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [containerWidth, setContainerWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 800);

  // Auto-refit PDF canvas on phone rotation, tablet split-view, or laptop window resize
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      if (el.clientWidth > 0) setContainerWidth(el.clientWidth);
    };
    updateSize();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(updateSize);
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      window.addEventListener('resize', updateSize);
      return () => window.removeEventListener('resize', updateSize);
    }
  }, []);

  // Load PDF Document
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    const loadingTask = pdfjsLib.getDocument({
      url: fileUrl,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });

    loadingTask.promise
      .then((loadedDoc) => {
        if (!active) return;
        setPdfDoc(loadedDoc);
        setLoading(false);
        if (onTotalPages) onTotalPages(loadedDoc.numPages);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Error loading PDF:', err);
        setError('Unable to load PDF document.');
        setLoading(false);
      });

    return () => {
      active = false;
      if (loadingTask) loadingTask.destroy();
    };
  }, [fileUrl]);

  // Render Page onto Canvas
  const renderPage = useCallback(
    async (pageNumber) => {
      if (!pdfDoc || !canvasRef.current) return;

      try {
        const page = await pdfDoc.getPage(pageNumber);

        if (renderTaskRef.current) {
          try { renderTaskRef.current.cancel(); } catch { /* ignore */ }
        }

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const horizontalPadding = containerWidth < 400 ? 16 : containerWidth < 768 ? 24 : 48;
        const targetWidth = Math.max(260, Math.min(containerWidth - horizontalPadding, 860));

        const unscaledViewport = page.getViewport({ scale: 1 });
        const scale = (targetWidth / unscaledViewport.width) * zoom;
        const viewport = page.getViewport({ scale });

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2.5);
        canvas.height = Math.floor(viewport.height * pixelRatio);
        canvas.width = Math.floor(viewport.width * pixelRatio);
        canvas.style.height = `${Math.floor(viewport.height)}px`;
        canvas.style.width = `${Math.floor(viewport.width)}px`;

        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

        const renderTask = page.render({ canvasContext: context, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Page render error:', err);
        }
      }
    },
    [pdfDoc, zoom, containerWidth]
  );

  useEffect(() => {
    if (pdfDoc && currentPage) {
      renderPage(currentPage);
    }
  }, [pdfDoc, currentPage, zoom, containerWidth, renderPage]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        if (pdfDoc && currentPage < pdfDoc.numPages) onPageChange(currentPage + 1);
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (currentPage > 1) onPageChange(currentPage - 1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pdfDoc, currentPage, onPageChange]);

  // Touch swipe navigation for mini mobile, wide mobile & tablet
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && zoom <= 1.05) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = (e) => {
    if (!touchStartRef.current || e.changedTouches.length !== 1) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      if (dx < 0 && pdfDoc && currentPage < pdfDoc.numPages) {
        onPageChange(currentPage + 1);
      } else if (dx > 0 && currentPage > 1) {
        onPageChange(currentPage - 1);
      }
    }
  };

  const getCanvasFilter = () => {
    switch (theme) {
      case 'sepia': return 'sepia(35%) brightness(95%) contrast(98%)';
      case 'dark':
      case 'oled': return 'invert(90%) hue-rotate(180deg) contrast(90%)';
      default: return 'none';
    }
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className={`flex-1 w-full overflow-y-auto ${zoom > 1.05 ? 'overflow-x-auto' : 'overflow-x-hidden'} flex flex-col items-center justify-start py-3 xs:py-4 sm:py-6 px-2 xs:px-3 sm:px-6 select-none relative`}
    >
      {loading && (
        <div className="flex flex-col items-center justify-center my-auto py-16 space-y-3">
          <div className="w-10 h-10 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
          <p className="text-xs font-medium tracking-wide uppercase opacity-60">Preparing Reader...</p>
        </div>
      )}

      {error && (
        <div className="max-w-md my-auto p-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-center space-y-4">
          <h3 className="text-base font-semibold text-red-500">Failed to render book</h3>
          <p className="text-xs opacity-80">{error}</p>
          <a
            href={fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold"
          >
            Open Document in New Tab
          </a>
        </div>
      )}

      <div
        className={`transition-all duration-200 rounded-lg sm:rounded-xl overflow-hidden shadow-xl sm:shadow-2xl border border-black/10 ${
          loading || error ? 'hidden' : 'block'
        }`}
        style={{ filter: getCanvasFilter() }}
      >
        <canvas ref={canvasRef} className="block" />
      </div>
    </div>
  );
}
