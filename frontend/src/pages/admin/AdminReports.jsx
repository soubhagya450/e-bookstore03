import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchReports = () => {
    setLoading(true);
    api.getReports(statusFilter)
      .then((data) => setReports(data.reports || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReports(); }, [statusFilter]);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.updateReportStatus(id, status);
      fetchReports();
    } catch {
      alert('Failed to update status');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Copyright & Legal Complaints</h1>
          <p className="text-xs text-slate-500 mt-0.5">Review takedown notices and provenance challenges</p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full xs:w-auto"
        >
          <option value="">All Reports</option>
          <option value="pending">Pending</option>
          <option value="reviewed">Reviewed</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-xs text-slate-400">Loading inquiries...</div>
        ) : reports.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-10 text-center text-slate-400 space-y-2">
            <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No Complaints Found</h3>
            <p className="text-xs">All legal inquiries have been reviewed.</p>
          </div>
        ) : (
          reports.map((r) => (
            <div key={r.id} className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="min-w-0">
                  <span className="text-xs font-bold text-red-600 block">{r.reason}</span>
                  <p className="text-xs text-slate-500 break-words">
                    From: <strong>{r.reporter_name}</strong> ({r.reporter_email}) &bull; {r.book_title || 'General Platform'}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    r.status === 'pending' ? 'bg-red-50 text-red-600' : r.status === 'reviewed' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {r.status}
                  </span>
                  <select
                    value={r.status}
                    onChange={(e) => handleUpdateStatus(r.id, e.target.value)}
                    className="text-xs px-2.5 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/40 p-3.5 rounded-xl whitespace-pre-line break-words leading-relaxed">
                {r.details}
              </div>
              <span className="text-[10px] text-slate-400 block">Filed: {new Date(r.created_at).toLocaleString()}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
