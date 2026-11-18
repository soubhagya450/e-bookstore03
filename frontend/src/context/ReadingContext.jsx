import React, { createContext, useContext, useState, useEffect } from 'react';
import { Storage } from '../utils/storage';

const ReadingContext = createContext(null);

export const ReadingProvider = ({ children }) => {
  const [appTheme, setAppThemeState] = useState('light');
  const [inProgressBooks, setInProgressBooks] = useState([]);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [readerSettings, setReaderSettingsState] = useState(Storage.getReaderSettings());

  // Initialize theme and local storage data
  useEffect(() => {
    const savedTheme = Storage.getAppTheme();
    setAppThemeState(savedTheme);
    Storage.setAppTheme(savedTheme);

    refreshLocalData();
  }, []);

  const refreshLocalData = () => {
    setInProgressBooks(Storage.getAllProgress());
    setHistory(Storage.getHistory());
    setBookmarks(Storage.getBookmarks());
  };

  const setAppTheme = (theme) => {
    setAppThemeState(theme);
    Storage.setAppTheme(theme);
  };

  const toggleAppTheme = () => {
    const next = appTheme === 'dark' ? 'light' : 'dark';
    setAppTheme(next);
  };

  const updateReaderSettings = (newSettings) => {
    const updated = { ...readerSettings, ...newSettings };
    setReaderSettingsState(updated);
    Storage.saveReaderSettings(updated);
  };

  const recordProgress = (bookId, progressData) => {
    Storage.saveProgress(bookId, progressData);
    refreshLocalData();
  };

  const addBookmark = (bookId, data) => {
    const created = Storage.addBookmark(bookId, data);
    refreshLocalData();
    return created;
  };

  const removeBookmark = (id) => {
    Storage.removeBookmark(id);
    refreshLocalData();
  };

  const clearAllHistory = () => {
    Storage.clearHistory();
    refreshLocalData();
  };

  return (
    <ReadingContext.Provider
      value={{
        appTheme,
        setAppTheme,
        toggleAppTheme,
        inProgressBooks,
        history,
        bookmarks,
        readerSettings,
        updateReaderSettings,
        recordProgress,
        addBookmark,
        removeBookmark,
        clearAllHistory,
        refreshLocalData,
      }}
    >
      {children}
    </ReadingContext.Provider>
  );
};

export const useReading = () => {
  const context = useContext(ReadingContext);
  if (!context) {
    throw new Error('useReading must be used within ReadingProvider');
  }
  return context;
};
