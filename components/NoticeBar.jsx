'use client';
import { useState } from 'react';
import { Megaphone, X, PhoneCall } from 'lucide-react';

export default function NoticeBar({ announcement, phone, show = true, onBookClick }) {
  const [visible, setVisible] = useState(show);

  if (!visible || !announcement) return null;

  return (
    <aside aria-label="Announcement" className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 overflow-hidden">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 shrink-0 animate-pulse">
            <Megaphone className="w-3 h-3 text-white" />
          </span>
          <p className="truncate font-medium tracking-wide">
            {announcement}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {phone && (
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hidden md:inline-flex items-center gap-1.5 bg-white text-red-700 font-bold px-3 py-1 rounded-full text-xs hover:bg-red-50 transition-colors shadow-sm"
            >
              <PhoneCall className="w-3 h-3" />
              Call Now
            </a>
          )}
          <button
            onClick={onBookClick}
            className="inline-flex items-center bg-yellow-400 text-slate-950 font-bold px-3 py-1 rounded-full text-xs hover:bg-yellow-300 transition-colors shadow-sm"
          >
            Claim Free Demo
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-white/80 hover:text-white p-1 rounded transition-colors"
            title="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
}
