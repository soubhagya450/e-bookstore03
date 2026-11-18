import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('BookOpen');
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchCats = () => {
    setLoading(true);
    api.getAdminCategories()
      .then((data) => setCategories(data.categories || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCats(); }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      if (editId) {
        await api.updateCategory(editId, { name, description, icon });
        setSuccess('Category updated!');
      } else {
        await api.createCategory({ name, description, icon });
        setSuccess('Category created!');
      }
      setName('');
      setDescription('');
      setEditId(null);
      fetchCats();
    } catch (err) {
      setError(err.message || 'Operation failed');
    }
  };

  const startEdit = (cat) => {
    setEditId(cat.id);
    setName(cat.name);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'BookOpen');
  };

  const handleDelete = async (id, catName) => {
    if (window.confirm(`Delete category "${catName}"?`)) {
      try {
        await api.deleteCategory(id);
        fetchCats();
      } catch (err) {
        alert(err.message || 'Cannot delete category');
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Category Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Organize books into genres and subject matters</p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span>{success}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm h-fit space-y-4">
          <h3 className="font-bold text-sm">{editId ? 'Edit Category' : 'Create New Category'}</h3>
          <form onSubmit={handleSave} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold mb-1">Category Name *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Science Fiction" className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Description</label>
              <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief summary..." className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20">
                {editId ? 'Update' : 'Create Category'}
              </button>
              {editId && (
                <button type="button" onClick={() => { setEditId(null); setName(''); setDescription(''); }} className="px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold text-slate-500">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-2">
          {/* Mobile Card List (< 768px) */}
          <div className="md:hidden space-y-3">
            {loading ? (
              <div className="text-center py-8 text-xs text-slate-400">Loading...</div>
            ) : categories.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <span className="font-bold text-sm block truncate">{c.name}</span>
                  <span className="text-xs text-slate-400 line-clamp-1">{c.description}</span>
                  <span className="inline-block mt-1 text-[11px] font-semibold text-amber-600">{c.published_books || 0} books</span>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => startEdit(c)} className="p-2 rounded-lg text-slate-400 hover:text-blue-600 bg-slate-50 dark:bg-slate-800">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(c.id, c.name)} className="p-2 rounded-lg text-slate-400 hover:text-red-600 bg-slate-50 dark:bg-slate-800">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Tablet & Desktop Table (>= 768px) */}
          <div className="hidden md:block bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-800/60 uppercase tracking-wider text-[10px] font-semibold text-slate-500 border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Slug</th>
                    <th className="px-4 py-3.5 text-center">Books</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={4} className="text-center py-8">Loading...</td></tr>
                  ) : categories.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-slate-900 dark:text-white block">{c.name}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{c.description}</span>
                      </td>
                      <td className="px-4 py-3.5 font-mono text-slate-400">{c.slug}</td>
                      <td className="px-4 py-3.5 text-center font-bold text-amber-600 dark:text-amber-400">{c.published_books || 0}</td>
                      <td className="px-4 py-3.5 text-right whitespace-nowrap space-x-1">
                        <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(c.id, c.name)} className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-slate-100 dark:hover:bg-slate-800">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
