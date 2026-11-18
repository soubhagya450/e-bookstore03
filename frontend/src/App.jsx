import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ReadingProvider } from './context/ReadingContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

// Public Components & Pages
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import ReaderView from './pages/ReaderView';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import MyShelf from './pages/MyShelf';
import LegalPage from './pages/LegalPage';

// Admin Components & Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBooks from './pages/admin/AdminBooks';
import AdminBookForm from './pages/admin/AdminBookForm';
import AdminCategories from './pages/admin/AdminCategories';
import AdminAds from './pages/admin/AdminAds';
import AdminReports from './pages/admin/AdminReports';
import AdminSettings from './pages/admin/AdminSettings';

// Public Layout Wrapper
function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors overflow-x-hidden">
      <Navbar />
      <main className="flex-1 min-w-0">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AdminAuthProvider>
      <ReadingProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages with Standard Navbar & Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/book/:slug" element={<BookDetail />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/category/:slug" element={<CategoryDetail />} />
              <Route path="/my-shelf" element={<MyShelf />} />
              
              {/* Legal & Policy Pages */}
              <Route path="/about" element={<LegalPage pageType="about" />} />
              <Route path="/privacy" element={<LegalPage pageType="privacy" />} />
              <Route path="/terms" element={<LegalPage pageType="terms" />} />
              <Route path="/dmca" element={<LegalPage pageType="dmca" />} />
              <Route path="/contact" element={<LegalPage pageType="contact" />} />
            </Route>

            {/* Online Book Reader: 100% Fullscreen, Distraction-Free, Zero Ads */}
            <Route path="/read/:id" element={<ReaderView />} />

            {/* Admin Authentication */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Private Admin Dashboard */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="books" element={<AdminBooks />} />
              <Route path="books/new" element={<AdminBookForm />} />
              <Route path="books/:id/edit" element={<AdminBookForm />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="ads" element={<AdminAds />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </ReadingProvider>
    </AdminAuthProvider>
  );
}
