'use client';
import { useState, useMemo } from 'react';
import {
  ChevronDown,
  HelpCircle,
  Search,
  X,
  Phone,
  MessageSquare,
  ArrowRight,
  Sparkles,
  ChevronUp
} from 'lucide-react';

export default function FaqSection({ faqs = [], config = {}, settings = {}, onBookClick }) {
  if (config?.show === false) return null;
  const [openIds, setOpenIds] = useState(() => (faqs && faqs.length > 0 ? [faqs[0].id || 'faq-0'] : []));
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter active FAQs and sort by order
  const activeFaqs = useMemo(() => {
    return (faqs || [])
      .filter((f) => f.isActive !== false)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [faqs]);

  // Extract unique categories and counts
  const categories = useMemo(() => {
    const map = new Map();
    activeFaqs.forEach((f) => {
      const cat = f.category?.trim() || 'General';
      map.set(cat, (map.get(cat) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, count]) => ({ name, count }));
  }, [activeFaqs]);

  // Filtered FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return activeFaqs.filter((f) => {
      const matchesCat =
        selectedCategory === 'ALL' || (f.category?.trim() || 'General') === selectedCategory;
      if (!matchesCat) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        f.question?.toLowerCase().includes(q) ||
        f.answer?.toLowerCase().includes(q) ||
        f.category?.toLowerCase().includes(q)
      );
    });
  }, [activeFaqs, selectedCategory, searchQuery]);

  const toggleFaq = (id) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleExpandAll = () => {
    setOpenIds(filteredFaqs.map((f) => f.id));
  };

  const handleCollapseAll = () => {
    setOpenIds([]);
  };

  if (!faqs || faqs.length === 0) return null;

  // Support phone & whatsapp values with fallbacks
  const supportPhone = config?.supportPhone || settings?.phone || '+91 98765 43210';
  const cleanPhone = supportPhone.replace(/[^\d+]/g, '');
  const supportWhatsapp = config?.supportWhatsapp || settings?.whatsapp || '+91 98765 43210';
  const cleanWhatsapp = supportWhatsapp.replace(/[^\d]/g, '');

  return (
    <section id="faqs" className="py-14 sm:py-20 lg:py-28 bg-slate-50 border-t border-slate-200/80 relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-100/40 rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="absolute bottom-0 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-8 sm:mb-10">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 rounded-full bg-blue-100 text-blue-900 text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-blue-800" />
            <span>{config?.badge || 'Got Questions?'}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {config?.title || 'Frequently Asked Questions'}
          </h2>

          <p className="text-xs sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {config?.subtitle ||
              'Everything you need to know about our IELTS, PTE courses, mock test schedules, and guarantee methodology.'}
          </p>
        </div>

        {/* Search Bar */}
        {config?.showSearch !== false && (
          <div className="mb-5 sm:mb-6">
            <div className="relative max-w-2xl mx-auto">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 sm:left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={
                  config?.searchPlaceholder ||
                  'Search questions by topic, e.g. fees, mock test, speaking...'
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 sm:py-3.5 bg-white border border-slate-200/90 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-sm focus:outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/10 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-lg"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Category Filter Tabs */}
        {config?.showCategories !== false && categories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedCategory === 'ALL'
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
              }`}
            >
              <span>{config?.allCategoryLabel || 'All Questions'}</span>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                  selectedCategory === 'ALL' ? 'bg-red-700/60 text-white' : 'bg-slate-100 text-slate-500'
                }`}
              >
                {activeFaqs.length}
              </span>
            </button>

            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80 shadow-sm'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      isSelected ? 'bg-red-700/60 text-white' : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* List Header / Quick Controls */}
        <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
          <span>
            Showing <strong className="text-slate-800">{filteredFaqs.length}</strong> of{' '}
            <strong>{activeFaqs.length}</strong> questions
            {searchQuery && (
              <span>
                {' '}
                for &ldquo;<span className="text-red-600">{searchQuery}</span>&rdquo;
              </span>
            )}
          </span>

          {filteredFaqs.length > 1 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleExpandAll}
                className="hover:text-red-600 font-semibold transition-colors"
              >
                Expand All
              </button>
              <span>•</span>
              <button
                onClick={handleCollapseAll}
                className="hover:text-red-600 font-semibold transition-colors"
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        {/* FAQ Accordion List */}
        {filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-3 shadow-sm">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-base">No Matching Questions</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              We couldn&apos;t find any questions matching your current search or category filter.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('ALL');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredFaqs.map((faq, idx) => {
              const isOpen = openIds.includes(faq.id);
              return (
                <div
                  key={faq.id || idx}
                  className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm ${
                    isOpen
                      ? 'border-blue-900/30 shadow-md ring-1 ring-blue-900/5'
                      : 'border-slate-200/90 hover:border-slate-300'
                  }`}
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full text-left px-5 sm:px-6 py-4 sm:py-5 flex items-start sm:items-center justify-between gap-4 group"
                  >
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      <span
                        className={`w-7 h-7 rounded-xl font-black text-xs flex items-center justify-center shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-red-600 text-white'
                            : 'bg-red-50 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                        }`}
                      >
                        Q{idx + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-sm sm:text-base font-bold transition-colors ${
                              isOpen ? 'text-blue-950 font-extrabold' : 'text-slate-900 group-hover:text-red-600'
                            }`}
                          >
                            {faq.question}
                          </span>
                          {faq.category && (
                            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-slate-100 text-slate-500 text-[10px] font-semibold">
                              {faq.category}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-slate-400 group-hover:text-slate-600 shrink-0">
                      <ChevronDown
                        className={`w-5 h-5 transition-transform duration-300 ${
                          isOpen ? 'rotate-180 text-red-600' : ''
                        }`}
                      />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-5 pt-1 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100/90 bg-slate-50/50 animate-in fade-in duration-200">
                      <div className="whitespace-pre-line pt-2">{faq.answer}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still Have Questions? / Helpdesk Support Card */}
        {config?.showSupportCard !== false && (
          <div className="mt-10 sm:mt-12 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 text-white shadow-xl relative overflow-hidden border border-white/10">
            {/* Background glowing circles */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
              <div className="space-y-2.5 max-w-xl text-center lg:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-red-400 text-[11px] sm:text-xs font-bold tracking-wide backdrop-blur-sm border border-white/10">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{config?.supportBadge || 'Still Have Questions?'}</span>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight leading-tight">
                  {config?.supportTitle || 'Need Personalized Guidance for Your Target Band?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-lg">
                  {config?.supportSubtitle ||
                    "Can't find the answer you are looking for? Speak directly with our master trainers or visit our Chandigarh branch for a 1-on-1 assessment."}
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-end gap-3 w-full lg:w-auto">
                {/* Book Demo Button */}
                {config?.supportCtaAction === 'url' && config?.supportCtaUrl ? (
                  <a
                    href={config.supportCtaUrl}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 text-center shrink-0"
                  >
                    <span>{config?.supportCtaText || 'Book Free 1-on-1 Demo'}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      if (typeof onBookClick === 'function') onBookClick();
                      else {
                        const el = document.getElementById('contact') || document.getElementById('inquiry');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 text-center shrink-0"
                  >
                    <span>{config?.supportCtaText || 'Book Free 1-on-1 Demo'}</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </button>
                )}

                {/* Direct Call Button */}
                <a
                  href={`tel:${cleanPhone}`}
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all border border-white/15 text-center shrink-0"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{config?.supportPhoneText || 'Call Admissions'}</span>
                </a>

                {/* WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/${cleanWhatsapp}?text=${encodeURIComponent(
                    'Hello First Class Academy! I have a question regarding IELTS/PTE courses and fees.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-4 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 text-center shrink-0"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>{config?.supportWhatsappText || 'Chat on WhatsApp'}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
