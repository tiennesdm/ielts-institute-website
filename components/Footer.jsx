'use client';
import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, UserCog } from 'lucide-react';

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
            <div className="flex items-center gap-3">
              {logo.type === 'image' && logo.imageUrl ? (
                <img
                  src={logo.imageUrl}
                  alt={instituteName}
                  className="h-10 w-auto object-contain max-w-[180px]"
                />
              ) : (
                <>
                  {logo.showIcon !== false && (
                    <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold shrink-0">
                      <GraduationCap className="w-6 h-6" />
                    </div>
                  )}
                  <span className="text-xl font-black text-white tracking-tight">
                    {instituteName}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {bio}
            </p>
            {accreditation && (
              <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{accreditation}</span>
              </div>
            )}
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
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
              Programs
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
              Head Campus
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
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <UserCog className="w-3.5 h-3.5" />
              <span>Admin Portal Login</span>
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
