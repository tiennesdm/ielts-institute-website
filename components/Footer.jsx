'use client';
import Link from 'next/link';
import BrandLogo from './BrandLogo';
import { GraduationCap, Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Footer({ settings }) {
  const footerConfig = settings?.footer || {};
  const logo = settings?.logo || {};

  const instituteName = settings?.instituteName || 'First Class Global Education';
  const bio = footerConfig.bio || 'Official British Council & IDP certified coaching partner specializing in high-band IELTS Academic, General Training, and PTE Academic preparation.';
  const accreditation = footerConfig.accreditation || 'Certified IELTS & PTE Test Venue';
  const phone = footerConfig.phone || settings?.phone || '+91 98765 43210';
  const email = footerConfig.email || settings?.email || 'info@firstclassglobaleducation.com';
  const address = footerConfig.address || settings?.address || 'SCO 42-45, 2nd Floor, Sector 17, Chandigarh';
  const hours = footerConfig.hours || settings?.workingHours || 'Mon - Sat: 7:00 AM - 8:30 PM';
  const copyright = footerConfig.copyright || 'All rights reserved.';
  const partnerText = footerConfig.partnerText || 'Official Training Partner IDP & Cambridge';

  const defaultPrograms = [
    'IELTS Academic Comprehensive',
    'IELTS General Training (PR)',
    'Fast-Track 21-Day Crash Course',
    'PTE Academic 79+ Guaranteed',
    'CD-IELTS Computer Simulation Lab',
    '1-on-1 Daily Speaking Cabins',
    'Spoken English & Fluency'
  ];

  const programs = footerConfig.programs && footerConfig.programs.length > 0 ? footerConfig.programs : defaultPrograms;
  const navLinks = settings?.navigation?.links || [
    { label: 'Band 8+ Courses', href: '#courses' },
    { label: 'Hall of Fame & Results', href: '#results' },
    { label: 'Campus Photo Gallery', href: '#gallery' },
    { label: 'Upcoming Batches', href: '#batches' },
    { label: 'Student Reviews', href: '#testimonials' },
    { label: 'Frequently Asked Questions', href: '#faqs' },
  ];

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <BrandLogo placement="footer" settings={settings} />
            <p className="text-xs text-slate-400 leading-relaxed">
              {bio}
            </p>
            {accreditation && (
              <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{accreditation}</span>
              </div>
            )}

            {/* Social Media Links */}
            {settings?.social && Object.values(settings.social).some(Boolean) && (
              <div className="pt-3 flex items-center gap-2.5">
                {settings.social.instagram && (
                  <a
                    href={settings.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-pink-500 hover:text-pink-500 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                )}
                {settings.social.facebook && (
                  <a
                    href={settings.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500 hover:text-blue-500 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.889C10.5 0 9 1.5 9 4.667V8z"/>
                    </svg>
                  </a>
                )}
                {settings.social.youtube && (
                  <a
                    href={settings.social.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                )}
                {settings.social.linkedin && (
                  <a
                    href={settings.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-400 hover:text-blue-400 flex items-center justify-center transition-all hover:scale-110"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {footerConfig.col2Title || 'Explore'}
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              {navLinks.slice(0, 6).map((link) => (
                <li key={link.id || link.label}>
                  <a href={link.href} className="hover:text-white transition-colors flex items-center gap-1.5">
                    <ArrowRight className="w-3 h-3 text-red-500" />
                    <span>{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {footerConfig.col3Title || 'Programs'}
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {programs.map((prog, idx) => (
                <li key={idx}>
                  <a href="#courses" className="hover:text-white transition-colors">
                    {prog}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Branch Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              {footerConfig.col4Title || 'Head Campus'}
            </h4>
            {address && (
              <div className="flex items-start gap-3 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{address}</span>
              </div>
            )}
            {phone && (
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                  {phone}
                </a>
              </div>
            )}
            {email && (
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <a href={`mailto:${email}`} className="hover:text-white truncate">
                  {email}
                </a>
              </div>
            )}
            {hours && (
              <div className="flex items-start gap-3 text-xs text-slate-400">
                <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <span>{hours}</span>
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {instituteName}. {copyright}</p>
          <div className="flex items-center gap-6">
            <span>{partnerText}</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
