import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2, Star, ExternalLink, BookOpen } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const fetchBooks = () => {
    setLoading(true);
    api.getAdminBooks({ q: search, status: statusFilter, limit: 50 })
      .then((data) => setBooks(data.books || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBooks();
  }, [search, statusFilter]);

  const handleTogglePublish = async (id) => {
    try {
      await api.togglePublishBook(id);
      fetchBooks();
    } catch (err) {
      alert('Failed to toggle publish status: ' + err.message);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      await api.toggleFeaturedBook(id);
      fetchBooks();
    } catch (err) {
      alert('Failed to toggle featured status: ' + err.message);
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Delete "${title}"? This cannot be undone.`)) {
      try {
        await api.deleteBook(id);
        fetchBooks();
      } catch (err) {
        alert('Failed to delete book: ' + err.message);
      }
    }
  };

  return (
    <div className="space-y-5 sm:space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Book Library</h1>
          <p className="text-xs text-slate-500 mt-0.5">Manage, upload, edit, and publish digital books</p>
        </div>
        <Link
          to="/admin/books/new"
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/25 w-full xs:w-auto"
        >
          <Plus className="w-4 h-4" /> Add New Book
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
        >
          <option value="all">All Books</option>
          <option value="published">Published</option>
          <option value="draft">Drafts</option>
          <option value="featured">Featured Only</option>
        </select>
      </div>

      {/* Mobile & Small Tablet Card View (< 768px) */}
      <div className="md:hidden space-y-3">
        {loading ? (
          <div className="text-center py-10 text-xs text-slate-400">Loading catalog...</div>
        ) : books.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            No books found matching criteria.
          </div>
        ) : (
          books.map((b) => (
            <div key={b.id} className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-12 h-16 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                  {b.cover_url ? (
                    <img src={b.cover_url} alt={b.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <Link to={`/admin/books/${b.id}/edit`} className="font-bold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {b.title}
                  </Link>
                  <p className="text-xs text-slate-500 truncate">{b.author}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5 text-[10px]">
                    <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">{b.category_name}</span>
                    <span className="text-slate-400 font-mono">{b.view_count || 0} views</span>
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleTogglePublish(b.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold ${
                      b.is_published
                        ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                    }`}
                  >
                    {b.is_published ? 'Published' : 'Draft'}
                  </button>
                  <button
                    onClick={() => handleToggleFeatured(b.id)}
                    className={`p-1.5 rounded-lg ${b.is_featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-400 bg-slate-100 dark:bg-slate-800'}`}
                    aria-label="Toggle Featured"
                  >
                    <Star className={`w-4 h-4 ${b.is_featured ? 'fill-amber-500' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center gap-1">
                  <Link to={`/read/${b.id}`} target="_blank" className="p-2 rounded-lg text-slate-400 hover:text-amber-600 bg-slate-50 dark:bg-slate-800">
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                  <Link to={`/admin/books/${b.id}/edit`} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 bg-slate-50 dark:bg-slate-800">
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button onClick={() => handleDelete(b.id, b.title)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 bg-slate-50 dark:bg-slate-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Tablet & Desktop Table View (>= 768px) */}
      <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase tracking-wider text-[10px] font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Book</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">License</th>
                <th className="px-4 py-3.5 text-center">Status</th>
                <th className="px-4 py-3.5 text-center">Featured</th>
                <th className="px-4 py-3.5 text-center">Views</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">Loading catalog...</td></tr>
              ) : books.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-slate-400">No books found.</td></tr>
              ) : (
                books.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3.5 flex items-center gap-3">
                      <div className="w-10 h-14 rounded bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-200 dark:border-slate-700">
                        {b.cover_url ? (
                          <img src={b.cover_url} alt={b.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                            <BookOpen className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 max-w-xs">
                        <Link to={`/admin/books/${b.id}/edit`} className="font-bold text-slate-900 dark:text-white hover:text-amber-600 truncate block">
                          {b.title}
                        </Link>
                        <p className="text-[11px] text-slate-400 truncate">{b.author}</p>
                        <span className="text-[10px] text-slate-400 uppercase font-mono">{b.file_type} &bull; {b.page_count}p</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 font-medium">{b.category_name}</td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {b.license_name || b.copyright_status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleTogglePublish(b.id)}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors ${
                          b.is_published
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-slate-200'
                        }`}
                      >
                        {b.is_published ? 'Published' : 'Draft'}
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <button
                        onClick={() => handleToggleFeatured(b.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          b.is_featured ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40' : 'text-slate-300 hover:text-slate-500'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${b.is_featured ? 'fill-amber-500' : ''}`} />
                      </button>
                    </td>
                    <td className="px-4 py-3.5 text-center font-mono">{b.view_count || 0}</td>
                    <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1">
                      <Link to={`/read/${b.id}`} target="_blank" className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-slate-100 dark:hover:bg-slate-800 inline-block">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <Link to={`/admin/books/${b.id}/edit`} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 inline-block">
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handleDelete(b.id, b.title)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800 inline-block">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
