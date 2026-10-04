'use client';
import { useState, useEffect } from 'react';
import { X, Sparkles, CheckCircle2, Phone, Mail, User, BookOpen, MapPin, Send } from 'lucide-react';

export default function InquiryModal({ isOpen, onClose, prefilledCourse = '', modalConfig, courses = [] }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: prefilledCourse || (courses[0]?.title || 'IELTS Academic Comprehensive'),
    targetBand: '7.5 - 8.5 Bands',
    city: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (prefilledCourse) {
      setFormData(prev => ({ ...prev, course: prefilledCourse }));
    } else if (courses && courses.length > 0 && !formData.course) {
      setFormData(prev => ({ ...prev, course: courses[0].title }));
    }
  }, [prefilledCourse, courses]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError(data.error || 'Failed to submit form');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 min-h-screen">
      <div className="relative w-full max-w-lg bg-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200 max-h-[92vh] flex flex-col my-auto">
        
        {/* Header gradient bar */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-red-600 p-4 sm:p-6 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 sm:top-5 sm:right-5 text-white/80 hover:text-white bg-black/20 hover:bg-black/40 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 sm:py-1 rounded-full bg-white/10 text-yellow-300 text-[11px] sm:text-xs font-bold mb-1.5 sm:mb-2">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>{modalConfig?.badge || "Limited Free Slots Available"}</span>
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight leading-tight">
            {modalConfig?.title || "Book Free Demo & Mock Test"}
          </h3>
          <p className="text-xs text-slate-200 mt-1 leading-normal">
            {modalConfig?.subtitle || "Experience our 1-on-1 speaking session, software lab & diagnostic evaluation test without paying anything."}
          </p>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-900">
                {modalConfig?.successTitle || "Seat Reserved Successfully!"}
              </h4>
              <p className="text-sm text-slate-600 max-w-sm mx-auto leading-relaxed">
                {modalConfig?.successMessage || `Thank you, ${formData.name}. Our senior counseling mentor will call you within 30 minutes to confirm your demo timing and send the Cambridge preparation kit.`}
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-md"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                  {error}
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jasleen Kaur"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Phone & Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
                    />
                  </div>
                </div>
              </div>

              {/* Course & Target Band */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Interested Course
                  </label>
                  <div className="relative">
                    <BookOpen className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <select
                      value={formData.course}
                      onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800 bg-white"
                    >
                      {courses && courses.length > 0 ? (
                        courses.map((c) => (
                          <option key={c.id || c.title} value={c.title}>
                            {c.title}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="IELTS Academic Comprehensive">IELTS Academic</option>
                          <option value="IELTS General Training (PR)">IELTS General Training (PR)</option>
                          <option value="Fast-Track IELTS Crash Course">Fast-Track Crash Course</option>
                          <option value="PTE Academic 79+">PTE Academic</option>
                          <option value="CD-IELTS Computer Delivered">CD-IELTS Computer Lab</option>
                          <option value="Spoken English & Fluency">Spoken English & Fluency</option>
                        </>
                      )}
                      {formData.course && courses && !courses.some(c => c.title === formData.course) && (
                        <option value={formData.course}>{formData.course}</option>
                      )}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Band / Score
                  </label>
                  <select
                    value={formData.targetBand}
                    onChange={(e) => setFormData({ ...formData, targetBand: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800 bg-white"
                  >
                    <option value="8.0 - 8.5 Bands (Top University / PR)">8.0 - 8.5 Bands (Elite)</option>
                    <option value="7.0 - 7.5 Bands (Canada / UK / Aus)">7.0 - 7.5 Bands</option>
                    <option value="8777 CLB 10 (Express Entry)">8-7-7-7 (Canada PR CLB 9/10)</option>
                    <option value="79+ Score (PTE Academic)">79+ PTE Pearson</option>
                    <option value="6.5 Bands (Foundation)">6.5 Bands</option>
                  </select>
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  City / Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    placeholder="e.g. Chandigarh / Amritsar / Delhi / Online"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Confirming Demo...' : (modalConfig?.buttonText || 'Book Free 2-Hour Demo Class')}</span>
              </button>

              <p className="text-[11px] text-center text-slate-400 font-medium pt-1">
                {modalConfig?.footerNote || "🔒 100% Confidential. No spam. You will only be contacted by an academic counselor."}
              </p>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
