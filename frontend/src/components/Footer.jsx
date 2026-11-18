import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ShieldCheck, Heart, Sparkles, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-8">

          {/* Brand & Mission */}
          <div className="xs:col-span-2 space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600 flex items-center justify-center text-white flex-shrink-0">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                eBook Digital Library
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
              A free online digital sanctuary for world literature and open knowledge. Read seamlessly on any mini mobile, wide mobile, tablet, or laptop without registration.
            </p>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> No Registration
              </span>
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> 100% Ad-Free Reading
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Explore
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/books" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">All Books</Link></li>
              <li><Link to="/categories" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">Book Categories</Link></li>
              <li><Link to="/my-shelf" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">My Shelf & Progress</Link></li>
              <li><Link to="/about" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">About Our Mission</Link></li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-200 mb-3">
              Legal & Policy
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/privacy" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">Terms & Conditions</Link></li>
              <li><Link to="/dmca" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">Copyright & DMCA</Link></li>
              <li><Link to="/contact" className="text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400">Contact Us</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
          <p>© 2026 eBook Digital Library. Dedicated to free and accessible open literature.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for readers
            </span>
            <Link
              to="/admin/login"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded transition-colors"
              title="Admin Panel Login"
            >
              <Lock className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
