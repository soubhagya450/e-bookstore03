const API_BASE = '/api';

export async function request(endpoint, options = {}) {
  const token = localStorage.getItem('admin_token');
  const headers = { ...options.headers };

  if (token && !headers['Authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (!(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type');
  let data = null;
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  }

  if (!response.ok) {
    throw new Error(data?.error || response.statusText || 'Request failed');
  }

  return data;
}

export const api = {
  getBooks: (params = {}) => request(`/books?${new URLSearchParams(params).toString()}`),
  getFeaturedBooks: () => request('/books/featured'),
  getRecentBooks: () => request('/books/recent'),
  getBook: (idOrSlug) => request(`/books/${idOrSlug}`),
  getCategories: () => request('/categories'),
  getCategory: (slug) => request(`/categories/${slug}`),
  getAds: () => request('/ads'),
  getSettings: () => request('/settings'),
  submitCopyrightReport: (report) => request('/copyright-report', { method: 'POST', body: JSON.stringify(report) }),

  adminLogin: (credentials) => request('/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),
  adminLogout: () => request('/admin/logout', { method: 'POST' }),
  adminMe: () => request('/admin/me'),
  updateAdminProfile: (profile) => request('/admin/profile', { method: 'PUT', body: JSON.stringify(profile) }),

  getAdminStats: () => request('/admin/stats'),
  getAdminBooks: (params = {}) => request(`/admin/books?${new URLSearchParams(params).toString()}`),
  getAdminBook: (id) => request(`/admin/books/${id}`),
  createBook: (formData) => request('/admin/books', { method: 'POST', body: formData }),
  updateBook: (id, formData) => request(`/admin/books/${id}`, { method: 'PUT', body: formData }),
  deleteBook: (id) => request(`/admin/books/${id}`, { method: 'DELETE' }),
  togglePublishBook: (id) => request(`/admin/books/${id}/toggle-publish`, { method: 'PATCH' }),
  toggleFeaturedBook: (id) => request(`/admin/books/${id}/toggle-featured`, { method: 'PATCH' }),

  getAdminCategories: () => request('/admin/categories'),
  createCategory: (cat) => request('/admin/categories', { method: 'POST', body: JSON.stringify(cat) }),
  updateCategory: (id, cat) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
  deleteCategory: (id) => request(`/admin/categories/${id}`, { method: 'DELETE' }),

  getAdminAds: () => request('/admin/ads'),
  updateAdSlot: (key, config) => request(`/admin/ads/${key}`, { method: 'PUT', body: JSON.stringify(config) }),

  getReports: (status = '') => request(`/admin/reports${status ? `?status=${status}` : ''}`),
  updateReportStatus: (id, status) => request(`/admin/reports/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

  getAdminSettings: () => request('/admin/settings'),
  updateAdminSettings: (settings) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(settings) }),
};
