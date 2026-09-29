'use client';
import { useState } from 'react';
import { BookOpen, Clock, Calendar, Check, Sparkles, ArrowRight } from 'lucide-react';

export default function CoursesSection({ courses = [], onSelectCourse }) {
  const [filter, setFilter] = useState('ALL');

  const filteredCourses = courses.filter((course) => {
    if (filter === 'ALL') return true;
    if (filter === 'ACADEMIC') return course.title.toLowerCase().includes('academic') && !course.title.toLowerCase().includes('pte');
    if (filter === 'GENERAL') return course.title.toLowerCase().includes('general');
    if (filter === 'PTE') return course.title.toLowerCase().includes('pte');
    if (filter === 'SPOKEN') return course.title.toLowerCase().includes('spoken');
    return true;
  });

  return (
    <section id="courses" className="py-20 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Target Band 8+ Programs</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Our Certified IELTS & English Programs
          </h2>
          <p className="text-base text-slate-600">
            Tailored curriculums designed by former IELTS examiners. Choose the program that fits your target band, immigration deadline, or study abroad dream.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {[
            { id: 'ALL', label: 'All Courses' },
            { id: 'ACADEMIC', label: 'IELTS Academic' },
            { id: 'GENERAL', label: 'IELTS General (PR)' },
            { id: 'PTE', label: 'PTE Academic' },
            { id: 'SPOKEN', label: 'Spoken English' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                filter === tab.id
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              className={`relative bg-white rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col ${
                course.popular ? 'border-red-500 ring-2 ring-red-500/20 shadow-lg' : 'border-slate-200 shadow-sm'
              }`}
            >
              {/* Popular Badge */}
              {course.tag && (
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md ${
                    course.popular
                      ? 'bg-red-600 text-white'
                      : 'bg-blue-900 text-white'
                  }`}>
                    {course.tag}
                  </span>
                </div>
              )}

              {/* Course Thumbnail */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img
                  src={course.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent"></div>
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs font-semibold">
                  <span className="bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded-md font-bold">
                    {course.targetBand}
                  </span>
                  <span className="text-slate-200">
                    {course.mode}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-900">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Duration & Fee metadata */}
                  <div className="flex items-center justify-between py-3 my-4 border-y border-slate-100 text-xs">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Clock className="w-4 h-4 text-blue-800" />
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 font-medium">Course Fee: </span>
                      <span className="text-base font-extrabold text-red-600">{course.fee}</span>
                    </div>
                  </div>

                  {/* Bullet Features */}
                  <ul className="space-y-2 mb-6">
                    {course.features?.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Enroll / Inquire CTA Button */}
                <button
                  onClick={() => onSelectCourse(course.title)}
                  className={`w-full py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 ${
                    course.popular
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                      : 'bg-blue-900 hover:bg-blue-800 text-white shadow-blue-900/20'
                  }`}
                >
                  <span>Book Free Demo For This Course</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
