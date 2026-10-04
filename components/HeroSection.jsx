'use client';
import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Star,
  Sparkles,
  Award,
  Shield,
  Users,
  Headphones,
  BookOpen,
  GraduationCap,
  Globe,
  Clock,
  Zap,
  Target,
  Heart
} from 'lucide-react';

export const HERO_PILL_ICONS = {
  Award: { label: 'Award Ribbon', component: Award },
  Headphones: { label: 'Headphones Lab', component: Headphones },
  Shield: { label: 'Guarantee Shield', component: Shield },
  Star: { label: 'Rating Star', component: Star },
  Sparkles: { label: 'Sparkles', component: Sparkles },
  CheckCircle2: { label: 'Check Circle', component: CheckCircle2 },
  Users: { label: 'Students / Faculty', component: Users },
  BookOpen: { label: 'Cambridge Book', component: BookOpen },
  GraduationCap: { label: 'Graduation Cap', component: GraduationCap },
  Globe: { label: 'Global World', component: Globe },
  Clock: { label: 'Fast-Track Clock', component: Clock },
  Zap: { label: 'Lightning Zap', component: Zap },
  Target: { label: 'Target 8+ Band', component: Target },
  Heart: { label: 'Loved / Trust', component: Heart },
};

export const HERO_ICON_COLORS = {
  yellow: { label: 'Gold / Yellow', class: 'text-yellow-400' },
  rose: { label: 'Rose / Pink', class: 'text-rose-400' },
  emerald: { label: 'Emerald / Green', class: 'text-emerald-400' },
  sky: { label: 'Sky / Blue', class: 'text-sky-400' },
  amber: { label: 'Amber / Orange', class: 'text-amber-400' },
  purple: { label: 'Purple / Violet', class: 'text-purple-400' },
  white: { label: 'Crisp White', class: 'text-white' },
};

export const HERO_BADGE_THEMES = {
  amber: { label: 'Amber / Gold Gradient', class: 'bg-gradient-to-tr from-amber-500 to-yellow-400 text-white' },
  crimson: { label: 'Crimson / Red Gradient', class: 'bg-gradient-to-tr from-red-600 to-rose-500 text-white' },
  blue: { label: 'Navy / Blue Gradient', class: 'bg-gradient-to-tr from-blue-600 to-indigo-600 text-white' },
  emerald: { label: 'Emerald / Green Gradient', class: 'bg-gradient-to-tr from-emerald-600 to-teal-500 text-white' },
  purple: { label: 'Purple / Fuchsia Gradient', class: 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white' },
  dark: { label: 'Sleek Dark Slate', class: 'bg-gradient-to-tr from-slate-900 to-slate-800 text-white' },
};

export const HERO_BADGE_POSITIONS = {
  'top-right': { label: 'Top-Right (Default)', class: 'top-3 right-3 sm:top-4 sm:right-4' },
  'top-left': { label: 'Top-Left', class: 'top-3 left-3 sm:top-4 sm:left-4' },
  'bottom-right': { label: 'Bottom-Right (Above Bar)', class: 'bottom-16 right-3 sm:bottom-20 sm:right-4' },
  'bottom-left': { label: 'Bottom-Left (Above Bar)', class: 'bottom-16 left-3 sm:bottom-20 sm:left-4' },
};

export const HERO_PILLS_STYLES = {
  'dark-glass': { label: 'Translucent Dark Glass (Default)', class: 'bg-slate-900/85 backdrop-blur-md border border-white/10 text-slate-300' },
  'navy-glass': { label: 'Midnight Navy Glass', class: 'bg-blue-950/85 backdrop-blur-md border border-blue-400/20 text-blue-100' },
  'light-glass': { label: 'Frost Light Glass', class: 'bg-white/90 backdrop-blur-md text-slate-800 border border-slate-200/80 shadow-lg' },
  'black-solid': { label: 'Deep Solid Black', class: 'bg-black/90 border border-slate-800 text-slate-300' },
};

export const HERO_OVERLAY_STYLES = {
  'dark': { label: 'Cinematic Bottom Dark (Default)', class: 'bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent' },
  'soft': { label: 'Soft Slate Shadow', class: 'bg-gradient-to-t from-slate-950/70 to-transparent' },
  'navy': { label: 'Midnight Blue Hue', class: 'bg-gradient-to-t from-blue-950 via-slate-900/40 to-transparent' },
  'warm': { label: 'Warm Sunset Amber', class: 'bg-gradient-to-t from-amber-950/80 via-slate-950/30 to-transparent' },
  'none': { label: 'No Overlay (Clean Photo)', class: 'hidden' },
};

export const HERO_BANNER_HEIGHTS = {
  'standard': { label: 'Standard (420px Desktop)', class: 'w-full h-72 sm:h-96 lg:h-[420px]' },
  'tall': { label: 'Tall / Portrait (500px Desktop)', class: 'w-full h-80 sm:h-[460px] lg:h-[500px]' },
  'compact': { label: 'Compact (360px Desktop)', class: 'w-full h-64 sm:h-80 lg:h-[360px]' },
};

export const HERO_BANNER_BORDERS = {
  'glass': { label: 'Glass Accent (Default)', class: 'border-4 border-white/10' },
  'amber': { label: 'Gold Glow', class: 'border-4 border-amber-400/30' },
  'crimson': { label: 'Crimson Glow', class: 'border-4 border-red-500/30' },
  'subtle': { label: 'Minimalist Subtle', class: 'border border-white/20' },
};

export default function HeroSection({ hero, settings, onBookClick }) {
  const [quickPhone, setQuickPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const headline = hero?.headline || 'Achieve Your Dream 8+ Band in IELTS on First Try';
  const subheadline = hero?.subheadline !== undefined ? hero.subheadline : 'Certified British Council & IDP Master Faculty. Daily 1-on-1 Speaking, line-by-line Writing evaluations, and official Computer-Delivered IELTS simulation labs.';
  const badge = hero?.badge !== undefined ? hero.badge : '⭐ Rated 4.9/5 by 12,000+ Achievers • British Council Partner';
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
    <section className="relative overflow-hidden bg-slate-900 text-white py-12 sm:py-16 lg:py-24">
      {/* Background glowing gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-slate-950 opacity-95"></div>
      <div className="absolute top-0 right-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-5 sm:left-10 w-72 sm:w-96 h-72 sm:h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            
            {/* Top pill badge */}
            {hero?.showBadge !== false && badge && badge.trim() !== '' && (
              <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-white/10 border border-white/15 text-[11px] sm:text-xs font-semibold text-yellow-300 backdrop-blur-md shadow-sm max-w-full">
                <Sparkles className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{badge}</span>
              </div>
            )}

            {/* Main Headline */}
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight break-words">
              {headline}
            </h1>

            {/* Subtitle */}
            {subheadline && subheadline.trim() !== '' && (
              <p className="text-sm sm:text-base lg:text-lg text-slate-300 leading-relaxed max-w-2xl font-normal">
                {subheadline}
              </p>
            )}

            {/* Key feature checkmarks */}
            {hero?.showHighlights !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-1 sm:pt-2">
                {(hero?.highlights && hero.highlights.length > 0
                  ? hero.highlights
                  : [
                      "Daily 1-on-1 Speaking with Certified Examiners",
                      "Daily Writing Task 1 & 2 Line Corrections",
                      "Official CD-IELTS Computer Simulation Lab",
                      "Cambridge Official Books (1-19) Study Kits"
                    ]
                ).map((highlight, idx) => (
                  <div key={idx} className="flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            {(hero?.showPrimaryCta !== false || hero?.showSecondaryCta !== false) && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-3 sm:pt-4">
                {hero?.showPrimaryCta !== false && (
                  hero?.primaryCtaType === 'link' && hero?.primaryCtaLink ? (
                    <a
                      href={hero.primaryCtaLink}
                      className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-center"
                    >
                      <span>{hero?.primaryCtaText || 'Book Free Mock Test & Demo'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <button
                      onClick={onBookClick}
                      className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 text-center"
                    >
                      <span>{hero?.primaryCtaText || 'Book Free Mock Test & Demo'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )
                )}

                {hero?.showSecondaryCta !== false && (
                  <a
                    href={hero?.secondaryCtaLink || '#courses'}
                    className="px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs sm:text-sm transition-all hover:border-white/40 backdrop-blur-sm text-center flex items-center justify-center"
                  >
                    {hero?.secondaryCtaText || 'Explore Band Programs'}
                  </a>
                )}
              </div>
            )}

            {/* Instant Phone Callback Box */}
            {hero?.showCallbackBox !== false && (
              <div className="pt-2 sm:pt-3 max-w-md">
                <form onSubmit={handleQuickSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-md">
                  <input
                    type="tel"
                    placeholder={hero?.callbackBox?.placeholder || "Enter Mobile No for Instant Call"}
                    value={quickPhone}
                    onChange={(e) => setQuickPhone(e.target.value)}
                    required
                    className="bg-transparent px-3 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none flex-1 min-w-0"
                  />
                  <button
                    type="submit"
                    disabled={loading || submitted}
                    className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-bold px-4 py-2.5 sm:py-2 rounded-lg text-xs transition-colors shrink-0 disabled:opacity-50 text-center"
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
            )}

          </div>

          {/* Right Visual Image & Live Student Result Card */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <HeroVisualCard hero={hero} />
          </div>

        </div>
      </div>
    </section>
  );
}

export function HeroVisualCard({ hero, isPreview = false }) {
  const bannerImage = hero?.bannerImage || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop';
  const bannerAlt = hero?.bannerAlt || 'IELTS Institute Class and Training';

  // Sizing & Frame Styles
  const heightClass = HERO_BANNER_HEIGHTS[hero?.bannerHeight]?.class || HERO_BANNER_HEIGHTS['standard'].class;
  const borderClass = HERO_BANNER_BORDERS[hero?.bannerBorder]?.class || HERO_BANNER_BORDERS['glass'].class;
  const overlayClass = HERO_OVERLAY_STYLES[hero?.bannerOverlay]?.class || HERO_OVERLAY_STYLES['dark'].class;

  // Floating Badge Styles
  const badgePositionClass = HERO_BADGE_POSITIONS[hero?.floatingBadge?.position]?.class || HERO_BADGE_POSITIONS['top-right'].class;
  const badgeThemeClass = HERO_BADGE_THEMES[hero?.floatingBadge?.theme]?.class || HERO_BADGE_THEMES['amber'].class;
  const isDarkBadgeStyle = hero?.floatingBadge?.style === 'glass-dark';
  const badgeContainerClass = isDarkBadgeStyle
    ? 'bg-slate-900/95 backdrop-blur-md text-white border border-white/15 shadow-2xl'
    : 'bg-white/95 backdrop-blur-md text-slate-900 border border-white/50 shadow-xl';

  const badgeSubColorClass =
    hero?.floatingBadge?.subColor === 'amber' ? 'text-amber-500' :
    hero?.floatingBadge?.subColor === 'blue' ? 'text-sky-400' :
    hero?.floatingBadge?.subColor === 'rose' ? 'text-rose-500' :
    hero?.floatingBadge?.subColor === 'slate' ? (isDarkBadgeStyle ? 'text-slate-300' : 'text-slate-500') :
    'text-emerald-600';

  // Bottom Pills Bar Styles
  const pillsContainerClass = HERO_PILLS_STYLES[hero?.pillsStyle]?.class || HERO_PILLS_STYLES['dark-glass'].class;
  const isLightPills = hero?.pillsStyle === 'light-glass';

  // Normalized Pills List with Safe Non-Empty Text Fallbacks
  const rawPills = (hero?.bottomPills && hero.bottomPills.length > 0)
    ? hero.bottomPills
    : [
        { icon: 'Award', text: 'IDP & British Council', iconColor: 'yellow', highlight: true },
        { icon: 'Headphones', text: 'Real Headset Lab', iconColor: 'rose', highlight: false },
        { icon: 'Shield', text: '100% Guaranteed', iconColor: 'emerald', highlight: false }
      ];

  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-2xl ${borderClass} group`}>
      <img
        src={bannerImage}
        alt={bannerAlt}
        className={`object-cover group-hover:scale-105 transition-transform duration-700 ${heightClass}`}
      />
      
      {/* Overlay Gradient */}
      <div className={`absolute inset-0 ${overlayClass}`}></div>

      {/* Floating Achiever Band Badge */}
      {hero?.showFloatingBadge !== false && (
        <div className={`absolute ${badgePositionClass} ${badgeContainerClass} p-2 sm:p-3 rounded-xl sm:rounded-2xl flex items-center gap-2 sm:gap-3 transition-all duration-300`}>
          <div className={`w-9 h-9 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl ${badgeThemeClass} flex items-center justify-center font-black text-sm sm:text-lg shadow-md shrink-0`}>
            {hero?.floatingBadge?.score || '8.5'}
          </div>
          <div>
            <div className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider ${isDarkBadgeStyle ? 'text-slate-400' : 'text-slate-500'}`}>
              {hero?.floatingBadge?.label || 'Top Achiever'}
            </div>
            <div className={`text-[11px] sm:text-xs font-extrabold leading-tight ${isDarkBadgeStyle ? 'text-white' : 'text-slate-900'}`}>
              {hero?.floatingBadge?.title || 'Overall IELTS Band'}
            </div>
            <div className={`text-[9px] sm:text-[10px] font-bold ${badgeSubColorClass}`}>
              {hero?.floatingBadge?.sub || 'L: 9.0 • R: 9.0 • S: 8.5'}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Feature Trust Pills Bar */}
      {hero?.showBottomPills !== false && (
        <div className={`absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 ${pillsContainerClass} p-2.5 sm:p-3.5 rounded-xl`}>
          <div className="flex flex-wrap sm:flex-nowrap items-center justify-around sm:justify-between gap-1.5 sm:gap-2 text-[10px] sm:text-xs">
            {rawPills.map((pill, idx) => {
              const IconData = HERO_PILL_ICONS[pill.icon];
              const IconComp = IconData ? IconData.component : Award;
              
              // Safe fallback for text so it is NEVER blank
              const defaultPillTexts = ['IDP & British Council', 'Real Headset Lab', '100% Guaranteed', 'Cambridge Partner'];
              const pillText = (pill.text && pill.text.trim()) ? pill.text : (defaultPillTexts[idx] || 'Certified Excellence');
              
              // Color selection
              const defaultColor = idx === 0 ? 'yellow' : idx === 1 ? 'rose' : idx === 2 ? 'emerald' : 'sky';
              const iconColorKey = pill.iconColor || defaultColor;
              const iconColorClass = HERO_ICON_COLORS[iconColorKey]?.class || 'text-yellow-400';

              const isHighlighted = pill.highlight ?? (idx === 0);
              const textHighlightClass = isHighlighted
                ? (isLightPills ? 'font-bold text-slate-950' : 'font-bold text-white')
                : (isLightPills ? 'font-medium text-slate-700' : 'font-normal text-slate-300');

              return (
                <div key={idx} className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                  <IconComp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${iconColorClass} shrink-0`} />
                  <span className={textHighlightClass}>{pillText}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
