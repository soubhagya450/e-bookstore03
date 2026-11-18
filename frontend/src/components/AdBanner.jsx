import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Info } from 'lucide-react';

export default function AdBanner({ slotKey, className = '' }) {
  const [adConfig, setAdConfig] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.getAds()
      .then((data) => {
        if (mounted && data?.ads && data.ads[slotKey]) {
          setAdConfig(data.ads[slotKey]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (mounted) setLoaded(true);
      });
    return () => { mounted = false; };
  }, [slotKey]);

  if (!loaded || !adConfig || !adConfig.is_enabled) return null;

  return (
    <div className={`w-full my-5 sm:my-6 flex flex-col items-center justify-center overflow-hidden ${className}`}>
      <div className="w-full flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1 px-1">
        <span>Advertisement</span>
        <span className="flex items-center gap-0.5">
          <Info className="w-2.5 h-2.5" /> AdSense
        </span>
      </div>

      <div className="w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/40 p-3 xs:p-4 sm:p-6 text-center overflow-hidden">
        {adConfig.custom_html ? (
          <div className="max-w-full overflow-x-auto" dangerouslySetInnerHTML={{ __html: adConfig.custom_html }} />
        ) : (
          <div className="flex flex-col items-center justify-center py-2 sm:py-4 space-y-1.5 sm:space-y-2">
            <div className="px-2.5 py-1 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 text-[11px] sm:text-xs font-semibold max-w-full truncate">
              Google AdSense &bull; {adConfig.slot_name}
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 max-w-sm px-2">
              Supporting free open-access literature. The reading interface remains 100% ad-free.
            </p>
            <span className="text-[10px] text-slate-400 font-mono">
              Slot: {adConfig.ad_slot_id || 'ca-pub-active'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
