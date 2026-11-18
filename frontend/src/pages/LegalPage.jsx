import React, { useState, useEffect } from 'react';
import { ShieldCheck, FileText, Info, AlertCircle, Mail, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';

export default function LegalPage({ pageType }) {
  const [settings, setSettings] = useState({});
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSent, setContactSent] = useState(false);

  useEffect(() => {
    api.getSettings().then((data) => setSettings(data.settings || {})).catch(() => {});
  }, []);

  const getPageMeta = () => {
    switch (pageType) {
      case 'privacy':
        return { title: 'Privacy Policy', icon: ShieldCheck, content: settings.privacy_policy || 'Zero user registration, zero reader tracking, local storage data containment.' };
      case 'terms':
        return { title: 'Terms & Conditions', icon: FileText, content: settings.terms_conditions || 'Terms of access to public domain literature without account restrictions.' };
      case 'about':
        return { title: 'About Our Mission', icon: Info, content: settings.about_us || 'Committed to universal access to literature, free reading in the browser, and legal copyright compliance.' };
      case 'dmca':
        return { title: 'Copyright & DMCA Notice', icon: AlertCircle, content: settings.dmca_policy || 'Notice and takedown procedures for authors and rights holders.' };
      default:
        return { title: 'Contact Us', icon: Mail, content: `Reach our library administration at: ${settings.contact_email || 'contact@ebook-library.example.org'}` };
    }
  };

  const meta = getPageMeta();
  const IconComponent = meta.icon;

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.submitCopyrightReport({
        reporter_name: contactName,
        reporter_email: contactEmail,
        reason: 'General Inquiry / Contact Form',
        details: contactMessage,
      });
      setContactSent(true);
    } catch {
      alert('Unable to send inquiry. Please email us directly.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-3 xs:px-4 sm:px-6 py-8 sm:py-12 min-h-screen">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center flex-shrink-0">
          <IconComponent className="w-5 h-5" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {meta.title}
        </h1>
      </div>

      <div className="prose dark:prose-invert max-w-none text-slate-700 dark:text-slate-300 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line break-words">
        {meta.content}
      </div>

      {pageType === 'contact' && (
        <div className="mt-8 sm:mt-10 p-5 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4">Send a Direct Message</h3>
          {contactSent ? (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center gap-2 text-sm font-semibold">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> Thank you! Your message has been delivered.
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Message</label>
                <textarea
                  rows={4}
                  required
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full xs:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-sm shadow-md"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
