'use client';
import { Star, Quote, CheckCircle2, MessageSquare } from 'lucide-react';

export default function TestimonialsSection({ testimonials = [] }) {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
            <span>Student Experiences</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Loved By Thousands of Test Takers
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Read how our structured training, daily evaluations, and master feedback helped our students achieve their immigration and admission scores.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/90 flex flex-col justify-between hover:shadow-lg transition-all duration-300 relative"
            >
              <div>
                {/* 5 Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(test.rating || 5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed italic">
                  "{test.text}"
                </p>
              </div>

              {/* Student Footer */}
              <div className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-200/70">
                <img
                  src={test.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop'}
                  alt={test.name}
                  className="w-11 h-11 rounded-full object-cover border border-slate-300 shadow-sm"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{test.name}</h4>
                  <p className="text-xs text-red-600 font-semibold">{test.course}</p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
