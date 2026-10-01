'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  Phone,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  BookOpen,
  Trophy,
  Image as ImageIcon,
  Calendar,
  HelpCircle,
  Mail,
  UserCog,
  CheckCircle2,
  Globe,
  ArrowRight
} from 'lucide-react';

export default function Navbar({ settings, onBookClick }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);

  const logo = settings?.logo || {};
  const navConfig = settings?.navigation || {};
  const phone = settings?.phone || '+91 98765 43210';
  const ctaText = navConfig.ctaText || 'Book Free Demo';

  const defaultLinks = [
    { id: 'nav-1', label: 'Home', href: '#' },
    { id: 'nav-2', label: 'Courses', href: '#courses' },
    { id: 'nav-3', label: '8+ Band Results', href: '#results' },
    { id: 'nav-uni', label: 'University Tie-ups', href: '#universities' },
    { id: 'nav-4', label: 'Gallery', href: '#gallery' },
    { id: 'nav-5', label: 'Batches', href: '#batches' },
    { id: 'nav-6', label: 'Why Us', href: '#why-us' },
    { id: 'nav-7', label: 'Reviews', href: '#testimonials' },
    { id: 'nav-8', label: 'FAQs', href: '#faqs' },
    { id: 'nav-9', label: 'Contact', href: '#contact' },
  ];

  const links = navConfig.links && navConfig.links.length > 0 ? navConfig.links : defaultLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCoursesDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const courseList = [
    { title: 'IELTS Academic Comprehensive', tag: '8+ Band Focus', desc: 'Complete 4-module mastery with daily mock drills' },
    { title: 'IELTS General Training (PR)', tag: 'Canada & Aus', desc: 'CLB 9/10 targeted strategies for express entry' },
    { title: 'Fast-Track 21-Day Crash Course', tag: 'Super Fast', desc: 'Exam shortcuts, band 8 templates & speaking cabins' },
    { title: 'PTE Academic 79+ Guaranteed', tag: 'Pearson Lab', desc: 'AI software scoring lab with real headphones' },
    { title: 'CD-IELTS Computer Delivered', tag: 'Computer Lab', desc: 'Official test interface replica & typing drills' },
    { title: 'Spoken English & Fluency', tag: 'Fluency', desc: 'Grammar foundation & interview confidence' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2 border-b border-slate-200/80'
          : 'bg-white border-b border-slate-200/90 py-2.5 sm:py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 xl:gap-6">
          
          {/* Brand Logo - Sleek & Balanced Spacing */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            {logo.type === 'image' && logo.imageUrl ? (
              <img
                src={logo.imageUrl}
                alt={settings?.instituteName || 'Logo'}
                className="h-9 sm:h-10 w-auto object-contain max-w-[170px] sm:max-w-[210px]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <>
                {logo.showIcon !== false && (
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-950 via-blue-900 to-red-600 flex items-center justify-center text-white shadow-md shadow-blue-950/15 group-hover:scale-105 transition-transform shrink-0">
                    <GraduationCap className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-base sm:text-lg font-black text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors whitespace-nowrap">
                      {logo.textPart1 || settings?.instituteName?.split(' ')[0] || 'First Class'}
                    </span>
                    <span className="text-base sm:text-lg font-black text-red-600 whitespace-nowrap">
                      {logo.textPart2 || settings?.instituteName?.split(' ').slice(1).join(' ') || 'Global Education'}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-[200px] xl:max-w-[260px] leading-tight">
                    {logo.tagline || settings?.tagline || 'Premier IELTS, PTE & Study Abroad Academy'}
                  </p>
                </div>
              </>
            )}
          </Link>

          {/* Desktop Navigation Links - Perfectly Spaced & Proportional */}
          <nav className="hidden lg:flex items-center justify-center gap-0.5 xl:gap-1.5 flex-1 max-w-3xl">
            {links.map((link) => {
              const isCourses = link.href === '#courses' || link.label.toLowerCase().includes('course');

              if (isCourses) {
                return (
                  <div key={link.id || link.label} className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                      className="px-2 xl:px-2.5 py-1.5 text-[13px] xl:text-sm font-bold text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1 group whitespace-nowrap"
                    >
                      <span>{link.label}</span>
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 ${
                          coursesDropdownOpen ? 'rotate-180 text-red-600' : 'text-slate-400 group-hover:text-red-600'
                        }`}
                      />
                    </button>

                    {coursesDropdownOpen && (
                      <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                          Featured Training Programs
                        </div>
                        <div className="space-y-1">
                          {courseList.map((c, i) => (
                            <a
                              key={i}
                              href="#courses"
                              onClick={() => setCoursesDropdownOpen(false)}
                              className="p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-start gap-3 group"
                            >
                              <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <BookOpen className="w-4 h-4" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                                    {c.title}
                                  </span>
                                  <span className="text-[10px] font-black text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                                    {c.tag}
                                  </span>
                                </div>
                                <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                  {c.desc}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <a
                            href="#courses"
                            onClick={() => setCoursesDropdownOpen(false)}
                            className="text-xs font-bold text-blue-900 hover:text-red-600 p-2 block text-center"
                          >
                            View All Course Fees & Schedules →
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <a
                  key={link.id || link.label}
                  href={link.href}
                  className="px-2 xl:px-2.5 py-1.5 text-[13px] xl:text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
                >
                  {link.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action CTA - Balanced with Nav */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-2.5 shrink-0">
            {navConfig.showPhone !== false && phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>{phone}</span>
              </a>
            )}

            <button
              onClick={onBookClick}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black px-4 py-2 sm:py-2.5 shadow-md shadow-red-600/25 transition-all hover:scale-105 active:scale-95 flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>{ctaText}</span>
            </button>

            <Link
              href="/admin"
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Admin CMS Portal"
            >
              <UserCog className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2 shrink-0">
            <button
              onClick={onBookClick}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
            >
              {ctaText}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu - Clean Spacing */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3 animate-in fade-in duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            {links.map((link) => (
              <a
                key={link.id || link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-100 rounded-xl flex items-center justify-center text-center transition-colors"
              >
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-100">
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
              >
                <Phone className="w-3.5 h-3.5 text-red-600" />
                Call Now: {phone}
              </a>
            )}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black shadow-lg shadow-red-600/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              {ctaText}
            </button>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-1.5 text-xs font-medium text-slate-400 hover:text-slate-800"
            >
              <UserCog className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
