import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Layers, Eye, ShieldAlert, Plus, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentBooks, setRecentBooks] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then((data) => {
        setStats(data.stats);
        setRecentBooks(data.recent_books || []);
        setRecentReports(data.recent_reports || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Library Dashboard</h1>
          <p className="text-xs text-slate-500 mt-0.5">Overview of library content, views, and copyright reports</p>
        </div>
        <Link
          to="/admin/books/new"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 w-full xs:w-auto"
        >
          <Plus className="w-4 h-4" /> Add New Book
        </Link>
      </div>

      {/* KPI Cards: 1 col mini mobile -> 2 col wide mobile/tablet -> 4 col desktop */}
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs text-slate-500 font-medium">Total Books</span>
            <h3 className="text-2xl font-bold mt-1">{stats?.total_books || 0}</h3>
            <p className="text-[11px] text-emerald-600 mt-1">{stats?.published_books || 0} published</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center flex-shrink-0">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs text-slate-500 font-medium">Total Reads</span>
            <h3 className="text-2xl font-bold mt-1">{stats?.total_views || 0}</h3>
            <p className="text-[11px] text-blue-600 mt-1">Reader views</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Eye className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs text-slate-500 font-medium">Categories</span>
            <h3 className="text-2xl font-bold mt-1">{stats?.total_categories || 0}</h3>
            <p className="text-[11px] text-purple-600 mt-1">Organized genres</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center flex-shrink-0">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="min-w-0">
            <span className="text-xs text-slate-500 font-medium">Pending DMCA</span>
            <h3 className="text-2xl font-bold mt-1">{stats?.pending_reports || 0}</h3>
            <p className="text-[11px] text-red-600 mt-1">Compliance inbox</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 flex items-center justify-center flex-shrink-0">
            <ShieldAlert className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Recent Books</h3>
            <Link to="/admin/books" className="text-xs text-amber-600 font-semibold flex items-center gap-1">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentBooks.map((b) => (
              <div key={b.id} className="py-3 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="text-xs font-bold truncate">{b.title}</h4>
                  <p className="text-[11px] text-slate-400 truncate">{b.author} &bull; {b.category_name}</p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${
                  b.is_published
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                }`}>
                  {b.is_published ? 'Published' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">Copyright Claims</h3>
            <Link to="/admin/reports" className="text-xs text-amber-600 font-semibold flex items-center gap-1">
              Manage <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentReports.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No copyright reports filed. All clear!</p>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentReports.map((r) => (
                <div key={r.id} className="py-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-red-600 truncate">{r.reason}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{r.book_title || 'General'} &bull; {r.reporter_name}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold flex-shrink-0 ${
                    r.status === 'pending' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {r.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
