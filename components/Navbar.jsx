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

  const instituteName = settings?.instituteName || 'First Class Global Education';
  const phone = settings?.phone || '+91 98765 43210';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on click outside
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
    { title: 'IELTS Academic Comprehensive', tag: '8+ Bands', desc: 'For University Admissions in Canada, UK, Australia' },
    { title: 'IELTS General Training (PR)', tag: 'CLB 9/10', desc: 'Canada Express Entry & Work Visa Special' },
    { title: 'Fast-Track IELTS Crash Course', tag: '21 Days', desc: 'Intensive exam strategies & high-frequency papers' },
    { title: 'PTE Academic 79+ Guaranteed', tag: 'Pearson Lab', desc: 'AI software scoring lab with real headphones' },
    { title: 'CD-IELTS Computer Delivered', tag: 'Computer Lab', desc: 'Official test interface replica & typing drills' },
    { title: 'Spoken English & Fluency', tag: 'Fluency', desc: 'Grammar foundation & interview confidence' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-slate-200/80'
          : 'bg-white border-b border-slate-200 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-blue-950 via-blue-900 to-red-600 flex items-center justify-center text-white shadow-md shadow-blue-950/20 group-hover:scale-105 transition-transform shrink-0">
              <GraduationCap className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-lg sm:text-xl font-black text-slate-900 tracking-tight group-hover:text-blue-900 transition-colors">
                  First Class
                </span>
                <span className="text-lg sm:text-xl font-black text-red-600">
                  Global Education
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-xs">
                {settings?.tagline || 'Premier IELTS, PTE & Study Abroad Academy'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* Home */}
            <a
              href="#"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors"
            >
              Home
            </a>

            {/* Courses Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setCoursesDropdownOpen(!coursesDropdownOpen)}
                className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1 group"
              >
                <span>Courses & Programs</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${coursesDropdownOpen ? 'rotate-180 text-red-600' : 'text-slate-400 group-hover:text-red-600'}`} />
              </button>

              {/* Dropdown Menu */}
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

            {/* Results */}
            <a
              href="#results"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>8+ Band Results</span>
            </a>

            {/* Gallery */}
            <a
              href="#gallery"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4 text-blue-600" />
              <span>Campus Gallery</span>
            </a>

            {/* Batches */}
            <a
              href="#batches"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors"
            >
              Batches
            </a>

            {/* Why Us */}
            <a
              href="#why-us"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors"
            >
              Why Us
            </a>

            {/* Reviews */}
            <a
              href="#testimonials"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors"
            >
              Reviews
            </a>

            {/* Contact */}
            <a
              href="#contact"
              className="px-3 py-2 text-sm font-bold text-slate-700 hover:text-red-600 rounded-lg transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Right Action CTA */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Phone Dial */}
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="hidden xl:flex items-center gap-2 text-xs font-bold text-slate-700 hover:text-blue-900 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-600" />
              <span>{phone}</span>
            </a>

            {/* Book Demo Button */}
            <button
              onClick={onBookClick}
              className="relative group overflow-hidden rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-500 hover:to-rose-500 text-white text-xs font-black px-4 py-2.5 shadow-md shadow-red-600/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin-slow" />
              <span>Book Free Demo</span>
            </button>

            {/* Admin Portal Shortcut */}
            <Link
              href="/admin"
              className="p-2 text-slate-400 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Admin CMS Portal"
            >
              <UserCog className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={onBookClick}
              className="bg-red-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm"
            >
              Free Demo
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-4 pb-6 space-y-4 animate-in fade-in duration-200 shadow-xl">
          <div className="grid grid-cols-2 gap-2 text-xs font-bold text-slate-700">
            <a
              href="#"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              🏠 Home
            </a>
            <a
              href="#courses"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl text-red-600"
            >
              📚 Courses & Fees
            </a>
            <a
              href="#results"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              🏆 8+ Band Results
            </a>
            <a
              href="#gallery"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              🖼️ Photo Gallery
            </a>
            <a
              href="#batches"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              ⏰ Batch Timings
            </a>
            <a
              href="#why-us"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              ⭐ Why Choose Us
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              💬 Student Reviews
            </a>
            <a
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl"
            >
              📍 Contact Campus
            </a>
          </div>

          <div className="pt-2 space-y-2 border-t border-slate-100">
            <a
              href={`tel:${phone.replace(/\s+/g, '')}`}
              className="flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50"
            >
              <Phone className="w-4 h-4 text-red-600" />
              Call Now: {phone}
            </a>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onBookClick();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black shadow-lg shadow-red-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              Book Free Demo & Mock Test
            </button>

            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2 text-xs font-medium text-slate-400 hover:text-slate-800"
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
