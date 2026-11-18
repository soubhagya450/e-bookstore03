import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  BookOpen,
  Layers,
  Megaphone,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLayout() {
  const { admin, loading, isAuthenticated, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/admin/login', { replace: true });
    }
  }, [loading, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
        <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Books Library', path: '/admin/books', icon: BookOpen },
    { name: 'Categories', path: '/admin/categories', icon: Layers },
    { name: 'AdSense Ads', path: '/admin/ads', icon: Megaphone },
    { name: 'Copyright & DMCA', path: '/admin/reports', icon: ShieldAlert },
    { name: 'Site Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white flex-shrink-0">
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="font-bold text-sm tracking-tight block truncate">Admin Console</span>
              <p className="text-[10px] text-slate-400 truncate">eBook Digital Library</p>
            </div>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-3.5 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname.startsWith(item.path);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  active
                    ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3 pb-safe">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between text-xs text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" /> View Public Site
          </span>
          &rarr;
        </Link>

        <div className="flex items-center justify-between px-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="min-w-0 pr-2">
            <p className="text-xs font-bold truncate">{admin?.username}</p>
            <p className="text-[10px] text-slate-400 truncate">{admin?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            title="Sign Out"
            aria-label="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-col lg:flex-row text-slate-900 dark:text-slate-100 overflow-x-hidden">
      {/* Desktop Sidebar (Laptop & Wide Screens >= 1024px) */}
      <aside className="hidden lg:block w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile & Tablet Sticky Topbar (< 1024px) */}
      <header className="lg:hidden sticky top-0 z-30 h-14 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 xs:px-4 flex items-center justify-between pt-safe">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Open navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-7 h-7 rounded-lg bg-amber-600 flex items-center justify-center text-white flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-sm truncate">Admin Portal</span>
          </div>
        </div>
        <Link
          to="/"
          target="_blank"
          className="text-xs font-semibold text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center gap-1 flex-shrink-0"
        >
          Site <ExternalLink className="w-3 h-3" />
        </Link>
      </header>

      {/* Mobile & Tablet Slide-over Sidebar Drawer */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div onClick={() => setDrawerOpen(false)} className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" />
          <aside className="relative w-72 max-w-[82vw] bg-white dark:bg-slate-900 h-full shadow-2xl z-10">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-3 xs:p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
