'use client';
import Link from 'next/link';
import { GraduationCap, Phone, Mail, MapPin, Clock, ArrowRight, ShieldCheck, UserCog } from 'lucide-react';

export default function Footer({ settings }) {
  const instituteName = settings?.instituteName || 'Apex IELTS Academy';
  const phone = settings?.phone || '+91 98765 43210';
  const email = settings?.email || 'admissions@apexieltsacademy.com';
  const address = settings?.address || 'SCO 42-45, 2nd Floor, Sector 17, Chandigarh';
  const hours = settings?.workingHours || 'Mon - Sat: 7:00 AM - 8:30 PM';

  return (
    <footer id="contact" className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Brand & Bio */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                {instituteName}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official British Council & IDP certified coaching partner specializing in high-band IELTS Academic, General Training, and PTE Academic preparation.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certified IELTS & PTE Test Venue</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <a href="#courses" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>Band 8+ Courses</span>
                </a>
              </li>
              <li>
                <a href="#results" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>Hall of Fame & Results</span>
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>Campus Photo Gallery</span>
                </a>
              </li>
              <li>
                <a href="#batches" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>Upcoming Batches</span>
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>Student Reviews</span>
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-red-500" />
                  <span>Frequently Asked Questions</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Programs */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Programs
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>IELTS Academic Comprehensive</li>
              <li>IELTS General Training (Express Entry)</li>
              <li>Fast-Track 21-Day Crash Course</li>
              <li>PTE Academic 79+ Guaranteed</li>
              <li>Computer Delivered (CD) IELTS Lab</li>
              <li>1-on-1 Daily Speaking Cabins</li>
              <li>Spoken English & Fluency</li>
            </ul>
          </div>

          {/* Col 4: Contact & Branch Info */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Head Campus
            </h4>
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{address}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-white">
                {phone}
              </a>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <a href={`mailto:${email}`} className="hover:text-white truncate">
                {email}
              </a>
            </div>
            <div className="flex items-start gap-3 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
              <span>{hours}</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} {instituteName}. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Official Training Partner IDP & Cambridge</span>
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
