'use client';
import { Award, Trophy, Star, CheckCircle, GraduationCap } from 'lucide-react';

export default function ResultsSection({ results = [] }) {
  if (!results || results.length === 0) return null;

  return (
    <section id="results" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-600" />
            <span>Hall of Fame & High Achievers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Real Students, Real 8+ Band Results
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Hundreds of our students clear their target band scores on their first attempt every month and secure admissions in top Ivy League & Global Universities.
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {results.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 rounded-2xl border border-slate-200/80 p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative group overflow-hidden"
            >
              {/* Top Accent Gradient Bar */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-blue-900"></div>

              <div>
                {/* Header: Student Info & Band Score Badge */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                      alt={item.studentName}
                      className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 text-base leading-snug">
                        {item.studentName}
                      </h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {item.examType || 'IELTS Academic'}
                      </p>
                      <div className="flex items-center gap-1 mt-1 text-xs text-emerald-700 font-semibold">
                        <span>{item.flag}</span>
                        <span>{item.destination}</span>
                      </div>
                    </div>
                  </div>

                  {/* Big Band Score Stamp */}
                  <div className="text-center shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex flex-col items-center justify-center shadow-lg shadow-red-600/20">
                      <span className="text-lg font-black leading-none">{item.overallBand}</span>
                      <span className="text-[9px] font-bold uppercase tracking-wider opacity-90 mt-0.5">Band</span>
                    </div>
                  </div>
                </div>

                {/* Score breakdown pills */}
                {item.scores && (
                  <div className="grid grid-cols-4 gap-2 mt-5 bg-white p-3 rounded-xl border border-slate-200/70 text-center">
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Listening</div>
                      <div className="text-xs font-black text-slate-800">{item.scores.listening}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Reading</div>
                      <div className="text-xs font-black text-slate-800">{item.scores.reading}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Writing</div>
                      <div className="text-xs font-black text-slate-800">{item.scores.writing}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase">Speaking</div>
                      <div className="text-xs font-black text-slate-800">{item.scores.speaking}</div>
                    </div>
                  </div>
                )}

                {/* Student Quote */}
                <p className="text-xs text-slate-600 italic mt-4 leading-relaxed line-clamp-3">
                  "{item.quote}"
                </p>
              </div>

              {/* Bottom Admission Status Badge */}
              <div className="mt-5 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-blue-800" />
                  {item.admitted || 'Admitted & Visa Approved'}
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Verified Result ✓
                </span>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
