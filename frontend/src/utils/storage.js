const KEYS = {
  PROGRESS: 'ebook_reading_progress',
  HISTORY: 'ebook_reading_history',
  BOOKMARKS: 'ebook_bookmarks',
  SETTINGS: 'ebook_reader_settings',
  THEME: 'ebook_theme',
};

// Safe JSON parser
function safeGet(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error(`Error reading ${key} from localStorage`, e);
    return fallback;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Error writing ${key} to localStorage`, e);
  }
}

export const Storage = {
  // Reading Progress
  saveProgress: (bookId, { page, totalPages, bookTitle, author, coverUrl, slug }) => {
    const all = safeGet(KEYS.PROGRESS, {});
    const percent = totalPages > 0 ? Math.min(100, Math.round((page / totalPages) * 100)) : 0;
    
    all[bookId] = {
      bookId,
      page,
      totalPages,
      percent,
      bookTitle,
      author,
      coverUrl,
      slug,
      lastReadAt: new Date().toISOString(),
    };
    safeSet(KEYS.PROGRESS, all);

    // Also update history
    Storage.addToHistory({ bookId, bookTitle, author, coverUrl, slug });
  },

  getProgress: (bookId) => {
    const all = safeGet(KEYS.PROGRESS, {});
    return all[bookId] || null;
  },

  getAllProgress: () => {
    const all = safeGet(KEYS.PROGRESS, {});
    return Object.values(all).sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt));
  },

  clearProgress: (bookId) => {
    const all = safeGet(KEYS.PROGRESS, {});
    delete all[bookId];
    safeSet(KEYS.PROGRESS, all);
  },

  // Reading History
  addToHistory: (book) => {
    const history = safeGet(KEYS.HISTORY, []);
    const filtered = history.filter((item) => String(item.bookId) !== String(book.bookId));
    filtered.unshift({
      ...book,
      lastReadAt: new Date().toISOString(),
    });
    // Keep up to 50 items
    safeSet(KEYS.HISTORY, filtered.slice(0, 50));
  },

  getHistory: () => {
    return safeGet(KEYS.HISTORY, []);
  },

  clearHistory: () => {
    safeSet(KEYS.HISTORY, []);
  },

  // Bookmarks
  addBookmark: (bookId, { bookTitle, page, note = '' }) => {
    const bookmarks = safeGet(KEYS.BOOKMARKS, []);
    const newBookmark = {
      id: `${bookId}_${page}_${Date.now()}`,
      bookId,
      bookTitle,
      page,
      note,
      createdAt: new Date().toISOString(),
    };
    bookmarks.unshift(newBookmark);
    safeSet(KEYS.BOOKMARKS, bookmarks);
    return newBookmark;
  },

  removeBookmark: (bookmarkId) => {
    const bookmarks = safeGet(KEYS.BOOKMARKS, []);
    const filtered = bookmarks.filter((b) => b.id !== bookmarkId);
    safeSet(KEYS.BOOKMARKS, filtered);
  },

  getBookmarks: (bookId = null) => {
    const bookmarks = safeGet(KEYS.BOOKMARKS, []);
    if (bookId) {
      return bookmarks.filter((b) => String(b.bookId) === String(bookId));
    }
    return bookmarks;
  },

  isBookmarked: (bookId, page) => {
    const bookmarks = safeGet(KEYS.BOOKMARKS, []);
    return bookmarks.some((b) => String(b.bookId) === String(bookId) && b.page === page);
  },

  // Reader Settings
  getReaderSettings: () => {
    return safeGet(KEYS.SETTINGS, {
      theme: 'sepia', // 'light' | 'sepia' | 'dark' | 'oled'
      fontSize: 18,   // 14 to 28
      lineHeight: 1.7,
      fontFamily: 'serif', // 'serif' | 'sans' | 'mono'
      maxWidth: 'prose-lg', // 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl'
    });
  },

  saveReaderSettings: (settings) => {
    safeSet(KEYS.SETTINGS, settings);
  },

  // App Dark/Light Theme
  getAppTheme: () => {
    return localStorage.getItem(KEYS.THEME) || 'light';
  },

  setAppTheme: (theme) => {
    localStorage.setItem(KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },
};
