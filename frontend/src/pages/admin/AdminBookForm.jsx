import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Image, FileText, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminBookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('English');
  const [publishedYear, setPublishedYear] = useState('');
  const [pageCount, setPageCount] = useState(1);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [copyrightStatus, setCopyrightStatus] = useState('public_domain');
  const [licenseName, setLicenseName] = useState('Public Domain Mark 1.0');
  const [copyrightNotes, setCopyrightNotes] = useState('');
  const [bookFile, setBookFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [existingFileUrl, setExistingFileUrl] = useState('');
  const [existingCoverUrl, setExistingCoverUrl] = useState('');

  useEffect(() => {
    api.getAdminCategories().then((data) => {
      setCategories(data.categories || []);
      if (!categoryId && data.categories?.length > 0) setCategoryId(data.categories[0].id);
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      setFetching(true);
      api.getAdminBook(id)
        .then((data) => {
          const b = data.book;
          setTitle(b.title || '');
          setAuthor(b.author || '');
          setCategoryId(b.category_id || '');
          setDescription(b.description || '');
          setLanguage(b.language || 'English');
          setPublishedYear(b.published_year || '');
          setPageCount(b.page_count || 1);
          setIsFeatured(Boolean(b.is_featured));
          setIsPublished(Boolean(b.is_published));
          setCopyrightStatus(b.copyright_status || 'public_domain');
          setLicenseName(b.license_name || 'Public Domain Mark 1.0');
          setCopyrightNotes(b.copyright_notes || '');
          setExistingFileUrl(b.file_url || '');
          setExistingCoverUrl(b.cover_url || '');
        })
        .catch((err) => setError(err.message))
        .finally(() => setFetching(false));
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('category_id', categoryId);
      formData.append('description', description);
      formData.append('language', language);
      formData.append('published_year', publishedYear);
      formData.append('page_count', pageCount);
      formData.append('is_featured', isFeatured);
      formData.append('is_published', isPublished);
      formData.append('copyright_status', copyrightStatus);
      formData.append('license_name', licenseName);
      formData.append('copyright_notes', copyrightNotes);

      if (bookFile) formData.append('book_file', bookFile);
      else if (existingFileUrl) formData.append('file_url', existingFileUrl);

      if (coverImage) formData.append('cover_image', coverImage);
      else if (existingCoverUrl) formData.append('cover_url', existingCoverUrl);

      if (isEdit) {
        await api.updateBook(id, formData);
        setSuccess('Book details updated successfully!');
      } else {
        await api.createBook(formData);
        setSuccess('Book added to library successfully!');
        setTimeout(() => navigate('/admin/books'), 1500);
      }
    } catch (err) {
      setError(err.message || 'Failed to save book');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5 sm:space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/admin/books" className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white flex-shrink-0">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight truncate">{isEdit ? 'Edit Book Record' : 'Publish New Book'}</h1>
          <p className="text-xs text-slate-500 truncate">Metadata, legal licensing, and reading files</p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-xs text-red-600 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
        </div>
      )}
      {success && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-600 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">Book Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Book Title *</label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Author Name *</label>
              <input type="text" required value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
            <div className="xs:col-span-2 sm:col-span-1">
              <label className="block text-xs font-semibold mb-1">Category *</label>
              <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="">Select category...</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Page Count</label>
              <input type="number" min="1" value={pageCount} onChange={(e) => setPageCount(parseInt(e.target.value, 10) || 1)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Year</label>
              <input type="number" value={publishedYear} onChange={(e) => setPublishedYear(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Description</label>
            <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">Digital Files & Cover Image</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2 overflow-hidden">
              <FileText className="w-7 h-7 text-amber-500 mx-auto" />
              <p className="text-xs font-bold">Book File (PDF or EPUB) *</p>
              <input type="file" accept=".pdf,.epub" onChange={(e) => setBookFile(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-amber-50 file:text-amber-700" />
              {existingFileUrl && !bookFile && <p className="text-[10px] text-slate-400 truncate">Current: {existingFileUrl}</p>}
            </div>
            <div className="p-4 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-center space-y-2 overflow-hidden">
              <Image className="w-7 h-7 text-blue-500 mx-auto" />
              <p className="text-xs font-bold">Cover Art (SVG, PNG, JPG, WEBP)</p>
              <input type="file" accept=".svg,.png,.jpg,.jpeg,.webp" onChange={(e) => setCoverImage(e.target.files[0])} className="w-full text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700" />
              {existingCoverUrl && !coverImage && <p className="text-[10px] text-slate-400 truncate">Current: {existingCoverUrl}</p>}
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800 text-amber-600">
            <ShieldCheck className="w-4 h-4" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">Copyright & Licensing Verification</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Copyright Status *</label>
              <select value={copyrightStatus} onChange={(e) => setCopyrightStatus(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500">
                <option value="public_domain">Public Domain</option>
                <option value="creative_commons">Creative Commons</option>
                <option value="author_permission">Written Author Permission</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">License Name *</label>
              <input type="text" required value={licenseName} onChange={(e) => setLicenseName(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Legal Provenance Notes</label>
            <textarea rows={2} value={copyrightNotes} onChange={(e) => setCopyrightNotes(e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} className="w-4 h-4 accent-emerald-500 rounded" />
              <span className="text-xs font-bold">Publish to Library</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="w-4 h-4 accent-amber-500 rounded" />
              <span className="text-xs font-bold">Feature on Homepage</span>
            </label>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Link to="/admin/books" className="px-4 py-2.5 text-xs font-semibold text-slate-500">Cancel</Link>
            <button type="submit" disabled={loading} className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md disabled:opacity-50">
              {loading ? 'Saving...' : isEdit ? 'Update Book' : 'Publish Book'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
