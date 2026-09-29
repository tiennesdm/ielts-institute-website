'use client';
import { Mic, Edit3, Monitor, Award, BookCheck, LineChart, ShieldCheck, Clock } from 'lucide-react';

export default function WhyUsSection({ onBookClick }) {
  const features = [
    {
      icon: <Mic className="w-6 h-6 text-red-600" />,
      title: "Daily 1-on-1 Speaking Cabins",
      description: "No group speaking hesitation. Practice daily in sound-isolated acoustic cabins directly with certified examiners who record and grade your fluency, lexical score, and pronunciation."
    },
    {
      icon: <Edit3 className="w-6 h-6 text-blue-600" />,
      title: "Line-by-Line Writing Evaluation",
      description: "Submit Task 1 and Task 2 essays daily. Our master mentors mark grammatical range, coherence & cohesion, and task achievement with handwritten corrections."
    },
    {
      icon: <Monitor className="w-6 h-6 text-indigo-600" />,
      title: "Official CD-IELTS Computer Lab",
      description: "A 50-terminal computer lab equipped with high-fidelity headsets and official exam simulation software to build typing speed and exam stamina."
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "Certified Master Mentors",
      description: "Learn exclusively from former British Council and IDP trained trainers with 12+ years average teaching experience."
    },
    {
      icon: <BookCheck className="w-6 h-6 text-emerald-600" />,
      title: "Cambridge 1 to 19 Original Kits",
      description: "Receive full physical and digital study kits with authentic Cambridge past papers, high-scoring vocabulary banks, and proven task templates."
    },
    {
      icon: <LineChart className="w-6 h-6 text-purple-600" />,
      title: "Saturday Full Hall Mock Tests",
      description: "Strict exam conditions every Saturday with identical timing, invigilators, and real question patterns. Score reports delivered in 24 hours."
    }
  ];

  return (
    <section id="why-us" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>The Apex Advantage</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why 12,000+ Students Chose Us Over Others
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            We don't just lecture; we train you module-by-module until you score your target band. Here is what sets our coaching methodology apart.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 hover:bg-white hover:shadow-xl hover:border-red-200 transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-white shadow-md flex items-center justify-center mb-5 group-hover:scale-110 transition-transform border border-slate-100">
                {feat.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                {feat.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Banner Bar */}
        <div className="mt-14 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl p-8 sm:p-10 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">
              Unsure About Your Current IELTS Band Level?
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
              Take our 45-minute Free Diagnostic Evaluation Test & get an accurate band score report from our Senior Head Examiner today.
            </p>
          </div>
          <button
            onClick={onBookClick}
            className="px-6 py-3.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-black text-sm rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 shrink-0"
          >
            Take Free Diagnostic Test
          </button>
        </div>

      </div>
    </section>
  );
}
