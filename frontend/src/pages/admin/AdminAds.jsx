import React, { useState, useEffect } from 'react';
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminAds() {
  const [ads, setAds] = useState([]);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const fetchAds = () => {
    api.getAdminAds()
      .then((data) => setAds(data.ads || []))
      .catch((err) => setError(err.message));
  };

  useEffect(() => { fetchAds(); }, []);

  const handleUpdate = async (slotKey, updatedFields) => {
    setError('');
    setSuccess('');
    try {
      await api.updateAdSlot(slotKey, updatedFields);
      setSuccess(`Updated ad slot: ${slotKey}`);
      fetchAds();
    } catch (err) {
      setError(err.message || 'Failed to update ad slot');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-5 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Advertisement Management</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure Google AdSense slots across public pages</p>
      </div>

      <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-3">
        <Sparkles className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
        <div>
          <strong className="block font-bold">Zero-Ad Reading Guarantee</strong>
          Ads appear only on public discovery and book detail pages. The online reader remains 100% ad-free.
        </div>
      </div>

      {success && (
        <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" /><span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" /><span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {ads.map((ad) => (
          <div key={ad.slot_key} className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="min-w-0">
                <h3 className="font-bold text-sm truncate">{ad.slot_name}</h3>
                <span className="text-[10px] font-mono text-slate-400">slot_key: {ad.slot_key}</span>
              </div>
              <label className="flex items-center gap-2 cursor-pointer flex-shrink-0">
                <input
                  type="checkbox"
                  checked={ad.is_enabled}
                  onChange={(e) => handleUpdate(ad.slot_key, { is_enabled: e.target.checked })}
                  className="w-4 h-4 accent-amber-500 rounded"
                />
                <span className="text-xs font-semibold">{ad.is_enabled ? 'Active' : 'Off'}</span>
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">AdSense Client ID</label>
                <input type="text" defaultValue={ad.ad_client_id} onBlur={(e) => handleUpdate(ad.slot_key, { ad_client_id: e.target.value })} className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Ad Slot ID</label>
                <input type="text" defaultValue={ad.ad_slot_id} onBlur={(e) => handleUpdate(ad.slot_key, { ad_slot_id: e.target.value })} className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-500 mb-1">Custom HTML Snippet</label>
                <textarea rows={2} defaultValue={ad.custom_html || ''} onBlur={(e) => handleUpdate(ad.slot_key, { custom_html: e.target.value })} className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
