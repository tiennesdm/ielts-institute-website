'use client';
import { useState } from 'react';
import {
  Globe2,
  GraduationCap,
  Award,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  DollarSign,
  MapPin,
  Building2,
  ExternalLink,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function UniversitySection({ universities, onSelectUniversity, config }) {
  const [activeFilter, setActiveFilter] = useState('ALL');

  const header = universities?.header || {
    badge: "Official Global Study Abroad Network",
    title: "Direct University Tie-Ups & Global College Network",
    subtitle: "First Class Global Education directly represents 850+ world-renowned universities and colleges across 25+ countries. Fast-track offer letters, scholarship evaluations, and end-to-end visa filing.",
    stats: [
      { label: "Direct University Tie-Ups", value: "850+" },
      { label: "Top Destination Countries", value: "25+" },
      { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
      { label: "Scholarships Facilitated", value: "₹12+ Crores" }
    ]
  };

  const items = universities?.items || [];

  const filterTabs = [
    { key: 'ALL', label: 'All Destinations', count: items.length },
    { key: 'Canada', label: 'Canada 🇨🇦' },
    { key: 'Australia', label: 'Australia 🇦🇺' },
    { key: 'United Kingdom', label: 'UK 🇬🇧' },
    { key: 'USA', label: 'USA 🇺🇸' },
    { key: 'Germany', label: 'Germany 🇩🇪' },
    { key: 'Ireland', label: 'Ireland 🇮🇪' },
    { key: 'New Zealand', label: 'New Zealand 🇳🇿' },
  ];

  const filteredItems = items.filter((uni) => {
    if (activeFilter === 'ALL') return true;
    return uni.country?.toLowerCase() === activeFilter.toLowerCase();
  });

  const marqueeUniversities = [
    'University of Toronto 🇨🇦',
    'University of Melbourne 🇦🇺',
    'University of Manchester 🇬🇧',
    'University of British Columbia 🇨🇦',
    'University of Sydney 🇦🇺',
    'Arizona State University 🇺🇸',
    'Technical University of Munich 🇩🇪',
    'University of Birmingham 🇬🇧',
    'Trinity College Dublin 🇮🇪',
    'Northeastern University 🇺🇸',
    'University of Auckland 🇳🇿',
    'Concordia University 🇨🇦',
  ];

  return (
    <section id="universities" className="py-14 sm:py-24 bg-gradient-to-b from-slate-50 via-white to-slate-50 relative overflow-hidden border-t border-slate-200/80">
      
      {/* Background Subtle Gradient Accents */}
      <div className="absolute top-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-900 text-[11px] sm:text-xs font-black tracking-wide uppercase mb-3 sm:mb-4 shadow-sm">
            <Globe2 className="w-4 h-4 text-red-600 animate-spin-slow shrink-0" />
            <span>{header.badge || 'Global University Tie-Ups'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {header.title}
          </h2>

          <p className="text-xs sm:text-base lg:text-lg text-slate-600 font-medium mt-3 sm:mt-4 leading-relaxed">
            {header.subtitle}
          </p>
        </div>

        {/* Global Key Stats Bar */}
        {header.stats && header.stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 mb-8 sm:mb-12">
            {header.stats.map((st, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200/80 rounded-2xl p-3 sm:p-5 text-center shadow-sm hover:shadow-md hover:border-red-300 transition-all group"
              >
                <div className="text-xl sm:text-3xl lg:text-4xl font-black text-blue-950 group-hover:text-red-600 transition-colors">
                  {st.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-wider">
                  {st.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Country Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center gap-1.5 sm:gap-2 overflow-x-auto pb-3 mb-8 scrollbar-none max-w-full">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-950 to-blue-900 text-white shadow-md shadow-blue-950/20'
                    : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* University Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((uni) => (
            <div
              key={uni.id}
              className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col group"
            >
              {/* Card Banner Image & Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-slate-900">
                <img
                  src={uni.logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'}
                  alt={uni.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                
                {/* Gradient Overlay for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Country Flag & Destination Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-slate-900 text-xs font-black shadow-md">
                  <span>{uni.flag}</span>
                  <span>{uni.country}</span>
                </div>

                {/* Global Ranking Badge */}
                {uni.ranking && (
                  <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-red-600/95 text-white text-[10px] font-black uppercase tracking-wider shadow-md">
                    {uni.ranking.split('|')[0].trim()}
                  </div>
                )}

                {/* City & University Title in banner */}
                <div className="absolute bottom-3 left-4 right-4">
                  <div className="flex items-center gap-1 text-slate-300 text-xs font-semibold">
                    <MapPin className="w-3.5 h-3.5 text-red-400 shrink-0" />
                    <span>{uni.city}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-snug drop-shadow-sm mt-0.5 line-clamp-1">
                    {uni.name}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Scholarship Tag */}
                {uni.scholarship && (
                  <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 text-xs font-bold">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{uni.scholarship}</span>
                  </div>
                )}

                {/* Popular Programs */}
                {uni.popularPrograms && uni.popularPrograms.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                      Popular Study Programs:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {uni.popularPrograms.map((prog, pIdx) => (
                        <span
                          key={pIdx}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                        >
                          {prog}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Exclusive Benefits / Features */}
                {uni.features && uni.features.length > 0 && (
                  <div className="space-y-1.5 pt-1 border-t border-slate-100">
                    {uni.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Action CTA Button */}
                <div className="pt-2">
                  <button
                    onClick={() => onSelectUniversity(`Study Abroad - ${uni.name} (${uni.country})`)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-950 to-blue-900 hover:from-red-600 hover:to-rose-600 text-white text-xs sm:text-sm font-black transition-all duration-300 shadow-md shadow-blue-950/15 flex items-center justify-center gap-2 group-hover:shadow-lg"
                  >
                    <span>Check Eligibility & Apply</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Continuous Marquee Ticker */}
        <div className="mt-14 pt-8 border-t border-slate-200">
          <div className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            {config?.marqueeTitle || "Representing 850+ Direct Global Partner Universities & Colleges"}
          </div>

          <div className="relative overflow-hidden py-3 bg-white border border-slate-200 rounded-2xl shadow-inner">
            <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
              {[...marqueeUniversities, ...marqueeUniversities].map((uName, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-700 hover:text-red-600 transition-colors cursor-default"
                >
                  <Building2 className="w-3.5 h-3.5 text-red-600" />
                  <span>{uName}</span>
                  <span className="text-slate-300 mx-2">•</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Global Counseling Callout Banner */}
        <div className="mt-10 sm:mt-12 rounded-3xl bg-gradient-to-r from-blue-950 via-blue-900 to-indigo-950 p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-white/5 transform skew-x-12 pointer-events-none" />
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-600/30 text-red-300 text-xs font-black uppercase tracking-wider border border-red-500/30">
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>{config?.bannerBadge || "Fast-Track Admission & Spot Assessment"}</span>
              </div>
              <h3 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                {config?.bannerTitle || "Confused About Which University & Country Fits Your Profile?"}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm font-medium max-w-2xl leading-relaxed">
                {config?.bannerDesc || "Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities."}
              </p>
            </div>

            <button
              onClick={() => onSelectUniversity('Comprehensive Study Abroad Counseling & University Selection')}
              className="w-full md:w-auto px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs sm:text-sm shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all shrink-0 text-center flex items-center justify-center gap-2 whitespace-normal sm:whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
              <span>{config?.bannerCta || "Book Free 1-on-1 Profile Assessment"}</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
