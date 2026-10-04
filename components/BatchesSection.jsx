'use client';
import { Calendar, Clock, Users, ArrowRight, Flame } from 'lucide-react';

export default function BatchesSection({ batches = [], onBookClick, config }) {
  if (!batches || batches.length === 0) return null;

  return (
    <section id="batches" className="py-14 sm:py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Flame className="w-3.5 h-3.5 text-emerald-600" />
            <span>{config?.badge || "Admissions Open"}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {config?.title || "Upcoming IELTS & PTE Batches"}
          </h2>
          <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
            {config?.subtitle || "Small batch size (max 15 students per batch) to ensure individualized attention. Secure your preferred timing before seats fill out."}
          </p>
        </div>

        {/* Batches Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-10 sm:mt-12">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 flex flex-col justify-between hover:shadow-xl transition-all duration-300 relative"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] sm:text-[11px] font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-0.5 rounded-full">
                    {batch.status || 'Filling Fast'}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500">
                    {batch.mode}
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {batch.title}
                </h3>
                <p className="text-xs text-blue-900 font-semibold mt-1">
                  {batch.target}
                </p>

                <div className="space-y-2 mt-4 sm:mt-5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                    <span>{batch.timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 shrink-0" />
                    <span className="font-semibold text-slate-800">{batch.startDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" />
                    <span className="text-emerald-700 font-bold">{batch.seatsLeft}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onBookClick}
                className="mt-5 sm:mt-6 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-red-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
              >
                <span>{config?.ctaText || "Reserve Seat Now"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
