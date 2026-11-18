import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../../services/api';

export default function AdminSettings() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  useEffect(() => {
    api.getAdminSettings()
      .then((data) => {
        const map = {};
        Object.entries(data.settings || {}).forEach(([k, item]) => { map[k] = item.value; });
        setSettings(map);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSettingChange = (key, val) => setSettings((prev) => ({ ...prev, [key]: val }));

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.updateAdminSettings(settings);
      setSuccess('Platform settings saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwdError('');
    setPwdSuccess('');
    try {
      await api.updateAdminProfile({ current_password: currentPassword, new_password: newPassword });
      setPwdSuccess('Admin password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setPwdError(err.message || 'Failed to update password');
    }
  };

  if (loading) return <div className="text-center py-12 text-xs text-slate-400">Loading settings...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Website Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">Configure platform branding, legal terms, and admin security</p>
      </div>

      {success && <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>{success}</span></div>}
      {error && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{error}</span></div>}

      <form onSubmit={handleSaveSettings} className="space-y-5 sm:space-y-6">
        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">General Configuration</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Library Name</label>
              <input type="text" value={settings.site_name || ''} onChange={(e) => handleSettingChange('site_name', e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Contact Email</label>
              <input type="email" value={settings.contact_email || ''} onChange={(e) => handleSettingChange('contact_email', e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Tagline</label>
            <input type="text" value={settings.site_tagline || ''} onChange={(e) => handleSettingChange('site_tagline', e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Library Description</label>
            <textarea rows={2} value={settings.site_description || ''} onChange={(e) => handleSettingChange('site_description', e.target.value)} className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 resize-none" />
          </div>
        </div>

        <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="font-bold text-sm pb-2 border-b border-slate-100 dark:border-slate-800">Legal & Policy Documents</h3>
          <div>
            <label className="block text-xs font-semibold mb-1">Privacy Policy</label>
            <textarea rows={4} value={settings.privacy_policy || ''} onChange={(e) => handleSettingChange('privacy_policy', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Terms and Conditions</label>
            <textarea rows={4} value={settings.terms_conditions || ''} onChange={(e) => handleSettingChange('terms_conditions', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">About Us</label>
            <textarea rows={4} value={settings.about_us || ''} onChange={(e) => handleSettingChange('about_us', e.target.value)} className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono" />
          </div>
        </div>

        <button type="submit" className="w-full xs:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/20">
          Save All Platform Settings
        </button>
      </form>

      <div className="p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Lock className="w-4 h-4 text-amber-500" />
          <h3 className="font-bold text-sm">Change Administrator Password</h3>
        </div>
        {pwdSuccess && <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 text-xs flex items-center gap-2"><CheckCircle2 className="w-4 h-4" /><span>{pwdSuccess}</span></div>}
        {pwdError && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 text-xs flex items-center gap-2"><AlertCircle className="w-4 h-4" /><span>{pwdError}</span></div>}

        <form onSubmit={handlePasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1">Current Password</label>
            <input type="password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">New Password</label>
            <input type="password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full px-3 py-2.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700" />
          </div>
          <button type="submit" className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
}
