'use client';
import { useState } from 'react';
import { ArrowRight, CheckCircle2, Star, Sparkles, Award, Shield, Users, Headphones } from 'lucide-react';

export default function HeroSection({ hero, settings, onBookClick }) {
  const [quickPhone, setQuickPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const headline = hero?.headline || 'Achieve Your Dream 8+ Band in IELTS on First Try';
  const subheadline = hero?.subheadline || 'Certified British Council & IDP Master Faculty. Daily 1-on-1 Speaking, line-by-line Writing evaluations, and official Computer-Delivered IELTS simulation labs.';
  const badge = hero?.badge || '⭐ Rated 4.9/5 by 12,000+ Achievers • British Council Partner';
  const bannerImage = hero?.bannerImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop';

  const handleQuickSubmit = async (e) => {
    e.preventDefault();
    if (!quickPhone) return;
    setLoading(true);
    try {
      await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Quick Callback Request',
          phone: quickPhone,
          course: 'Callback Requested',
          message: 'Student requested an instant phone callback from hero section.'
        })
      });
      setSubmitted(true);
      setQuickPhone('');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative overflow-hidden bg-slate-900 text-white py-16 lg:py-24">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 opacity-95"></div>
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top pill badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-xs font-semibold text-yellow-300 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badge}</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {headline}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
              {subheadline}
            </p>

            {/* Key feature checkmarks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {(hero?.highlights && hero.highlights.length > 0
                ? hero.highlights
                : [
                    "Daily 1-on-1 Speaking with Certified Examiners",
                    "Daily Writing Task 1 & 2 Line Corrections",
                    "Official CD-IELTS Computer Simulation Lab",
                    "Cambridge Official Books (1-19) Study Kits"
                  ]
              ).map((highlight, idx) => (
                <div key={idx} className="flex items-center gap-2.5 text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onBookClick}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
              >
                <span>{hero?.primaryCtaText || 'Book Free Mock & Demo Class'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#courses"
                className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-sm transition-all hover:border-white/40 backdrop-blur-sm"
              >
                {hero?.secondaryCtaText || 'Explore Band Programs'}
              </a>
            </div>

            {/* Instant Phone Callback Box */}
            <div className="pt-3 max-w-md">
              <form onSubmit={handleQuickSubmit} className="flex items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-md">
                <input
                  type="tel"
                  placeholder={hero?.callbackBox?.placeholder || "Enter Mobile No for Instant Call"}
                  value={quickPhone}
                  onChange={(e) => setQuickPhone(e.target.value)}
                  required
                  className="bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none flex-1"
                />
                <button
                  type="submit"
                  disabled={loading || submitted}
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-3.5 py-2 rounded-lg text-xs transition-colors shrink-0 disabled:opacity-50"
                >
                  {loading ? 'Sending...' : submitted ? '✓ Callback Booked' : (hero?.callbackBox?.buttonText || 'Request Call')}
                </button>
              </form>
              {submitted && (
                <p className="text-xs text-emerald-400 mt-1.5 pl-1">
                  {hero?.callbackBox?.successText || 'Thank you! Our senior counselor will call you within 15 minutes.'}
                </p>
              )}
            </div>

          </div>

          {/* Right Visual Image & Live Student Result Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 group">
              <img
                src={bannerImage}
                alt="IELTS Institute Class and Training"
                className="w-full h-80 sm:h-96 lg:h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent"></div>

              {/* Floating Band 8.5 Badge */}
              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md text-slate-900 p-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 animate-bounce">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center font-black text-white text-lg shadow-md">
                  {hero?.floatingBadge?.score || '8.5'}
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">
                    {hero?.floatingBadge?.label || 'Top Achiever'}
                  </div>
                  <div className="text-xs font-extrabold text-slate-900">
                    {hero?.floatingBadge?.title || 'Overall IELTS Band'}
                  </div>
                  <div className="text-[10px] text-emerald-600 font-bold">
                    {hero?.floatingBadge?.sub || 'L: 9.0 • R: 9.0 • S: 8.5'}
                  </div>
                </div>
              </div>

              {/* Bottom Feature Bar */}
              <div className="absolute bottom-4 left-4 right-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-xl border border-white/10">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  {(hero?.bottomPills && hero.bottomPills.length > 0
                    ? hero.bottomPills
                    : [
                        { icon: 'Award', text: 'IDP & British Council' },
                        { icon: 'Headphones', text: 'Real Headset Lab' },
                        { icon: 'Shield', text: '100% Guaranteed' }
                      ]
                  ).map((pill, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      {pill.icon === 'Award' && <Award className="w-4 h-4 text-yellow-400" />}
                      {pill.icon === 'Headphones' && <Headphones className="w-4 h-4 text-rose-400" />}
                      {pill.icon === 'Shield' && <Shield className="w-4 h-4 text-emerald-400" />}
                      {!['Award', 'Headphones', 'Shield'].includes(pill.icon) && (
                        <Award className="w-4 h-4 text-yellow-400" />
                      )}
                      <span className={idx === 0 ? "font-semibold text-white" : ""}>{pill.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
