'use client';
import { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Phone, Menu, X, ShieldCheck, Sparkles, UserCog } from 'lucide-react';

export default function Navbar({ settings, onBookClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const instituteName = settings?.instituteName || 'First Class Global Education';
  const phone = settings?.phone || '+91 98765 43210';

  const navLinks = [
    { label: 'Courses', href: '#courses' },
    { label: '8+ Band Results', href: '#results' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Batches', href: '#batches' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-blue-900 to-red-600 flex items-center justify-center text-white shadow-md shadow-blue-900/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                  {instituteName.split(' ')[0]}
                </span>
                <span className="text-xl font-extrabold text-red-600">
                  {instituteName.split(' ').slice(1).join(' ')}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block truncate max-w-xs">
                {settings?.tagline || 'British Council & IDP Accredited Center'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-semibold text-slate-700 hover:text-red-600 transition-colors py-1"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>{phone}</span>
            </a>

            <button
              onClick={onBookClick}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold px-4 py-2.5 shadow-md shadow-red-600/30 transition-all hover:shadow-lg active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>Book Free Demo</span>
            </button>

            <Link
              href="/admin"
              className="p-2 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
              title="Admin Panel"
            >
              <UserCog className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onBookClick}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm"
            >
              Free Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 animate-in fade-in duration-200">
          <div className="grid grid-cols-2 gap-2 pt-2 pb-3 border-b border-slate-100">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-semibold text-slate-700 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-800 bg-slate-50"
            >
              <Phone className="w-4 h-4 text-red-600" />
              Call: {phone}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="w-full py-3 rounded-xl bg-red-600 text-white text-sm font-bold shadow-md shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Book Free Demo & Mock Test
            </button>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
            >
              <UserCog className="w-4 h-4" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
