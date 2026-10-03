import React from 'react';
import {
  GraduationCap,
  Globe,
  BookOpen,
  Award,
  Sparkles,
  School,
  Compass,
  Crown,
  Flame,
  Star
} from 'lucide-react';

export const LOGO_ICONS = {
  GraduationCap: { label: 'Graduation Cap', component: GraduationCap },
  Globe: { label: 'Global World', component: Globe },
  BookOpen: { label: 'Academic Book', component: BookOpen },
  Award: { label: 'Excellence Award', component: Award },
  Sparkles: { label: 'Premium Stars', component: Sparkles },
  School: { label: 'Academy Building', component: School },
  Compass: { label: 'Global Compass', component: Compass },
  Crown: { label: 'Royal Crown', component: Crown },
  Flame: { label: 'Fast-Track Flame', component: Flame },
  Star: { label: 'Top Rated Star', component: Star },
};

export const THEME_GRADIENTS = {
  'blue-red': {
    label: 'Navy Blue & Crimson (Default)',
    badge: 'bg-gradient-to-tr from-blue-950 via-blue-900 to-red-600',
    part1Color: 'text-slate-900',
    part2Color: 'text-red-600',
    hoverText: 'group-hover:text-blue-900',
    shadow: 'shadow-blue-950/20'
  },
  'royal-blue': {
    label: 'Royal Blue & Deep Indigo',
    badge: 'bg-gradient-to-tr from-blue-800 via-blue-700 to-indigo-600',
    part1Color: 'text-slate-900',
    part2Color: 'text-blue-700',
    hoverText: 'group-hover:text-blue-800',
    shadow: 'shadow-blue-700/20'
  },
  'crimson-red': {
    label: 'Crimson Red & Rose Gold',
    badge: 'bg-gradient-to-tr from-red-600 via-rose-600 to-red-700',
    part1Color: 'text-slate-900',
    part2Color: 'text-red-600',
    hoverText: 'group-hover:text-red-700',
    shadow: 'shadow-red-600/20'
  },
  'emerald-teal': {
    label: 'Emerald Green & Teal',
    badge: 'bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500',
    part1Color: 'text-slate-900',
    part2Color: 'text-emerald-700',
    hoverText: 'group-hover:text-emerald-800',
    shadow: 'shadow-emerald-700/20'
  },
  'purple-violet': {
    label: 'Deep Purple & Violet',
    badge: 'bg-gradient-to-tr from-purple-800 via-purple-700 to-indigo-600',
    part1Color: 'text-slate-900',
    part2Color: 'text-purple-700',
    hoverText: 'group-hover:text-purple-800',
    shadow: 'shadow-purple-700/20'
  },
  'amber-gold': {
    label: 'Amber Gold & Sunset Orange',
    badge: 'bg-gradient-to-tr from-amber-600 via-amber-500 to-orange-500',
    part1Color: 'text-slate-900',
    part2Color: 'text-amber-600',
    hoverText: 'group-hover:text-amber-700',
    shadow: 'shadow-amber-600/20'
  },
  'dark-slate': {
    label: 'Minimalist Slate & Onyx',
    badge: 'bg-gradient-to-tr from-slate-950 via-slate-800 to-slate-900',
    part1Color: 'text-slate-900',
    part2Color: 'text-slate-700',
    hoverText: 'group-hover:text-slate-800',
    shadow: 'shadow-slate-900/20'
  }
};

export default function BrandLogo({
  placement = 'navbar',
  settings = {},
  className = '',
  imgClassName = '',
}) {
  const logo = settings?.logo || {};
  const instituteName = settings?.instituteName || 'First Class Global Education';

  // Helper to render selected icon component
  const renderIcon = (iconName, sizeClass = 'w-5 h-5 sm:w-5.5 sm:h-5.5') => {
    const IconComponent = (LOGO_ICONS[iconName] && LOGO_ICONS[iconName].component) || GraduationCap;
    return <IconComponent className={sizeClass} />;
  };

  // Get active theme preset or fallback
  const activeTheme = THEME_GRADIENTS[logo.themeColor] || THEME_GRADIENTS['blue-red'];
  const badgeClass = logo.badgeGradient || activeTheme.badge;

  // 1. FOOTER PLACEMENT (Dark background bg-slate-950)
  if (placement === 'footer') {
    const useCustom = logo.footerUseCustom === true;
    const isImage = useCustom ? (logo.footerType === 'image' && logo.footerImageUrl) : (logo.type === 'image' && logo.imageUrl);
    const imageUrl = useCustom ? logo.footerImageUrl : logo.imageUrl;
    const height = useCustom ? (logo.footerImageHeight || 42) : (logo.imageHeight || 40);

    if (isImage) {
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src={imageUrl}
            alt={instituteName}
            style={{ height: `${height}px` }}
            className={`w-auto object-contain max-w-[200px] ${imgClassName}`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    const footerText = useCustom && logo.footerText ? logo.footerText : instituteName;
    const footerIcon = useCustom && logo.footerIcon ? logo.footerIcon : (logo.icon || 'GraduationCap');
    const footerShowIcon = useCustom ? (logo.footerShowIcon !== false) : (logo.showIcon !== false);
    const footerBadgeColor = useCustom ? (logo.footerBadgeColor || 'bg-red-600') : badgeClass;
    const footerTagline = useCustom ? logo.footerTagline : (logo.tagline !== undefined ? logo.tagline : '');

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {footerShowIcon && (
          <div className={`w-10 h-10 rounded-xl ${footerBadgeColor} flex items-center justify-center text-white font-bold shrink-0 shadow-md`}>
            {renderIcon(footerIcon, 'w-6 h-6')}
          </div>
        )}
        <div>
          <span className="text-xl font-black text-white tracking-tight block">
            {footerText}
          </span>
          {footerTagline && footerTagline.trim() ? (
            <p className="text-[11px] text-slate-400 font-medium truncate max-w-[260px] leading-tight mt-0.5">
              {footerTagline}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  // 2. ADMIN SIDEBAR PLACEMENT (Dark slate background bg-slate-900)
  if (placement === 'admin') {
    const useCustom = logo.adminUseCustom === true;
    const isImage = useCustom ? (logo.adminType === 'image' && logo.adminImageUrl) : (logo.type === 'image' && logo.imageUrl);
    const imageUrl = useCustom ? logo.adminImageUrl : logo.imageUrl;
    const height = useCustom ? (logo.adminImageHeight || 36) : 36;

    if (isImage) {
      return (
        <div className={`flex items-center ${className}`}>
          <img
            src={imageUrl}
            alt="Admin Logo"
            style={{ height: `${height}px` }}
            className={`w-auto object-contain max-w-[180px] ${imgClassName}`}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      );
    }

    const adminTitle = useCustom && logo.adminTitle ? logo.adminTitle : `${logo.textPart1 || 'First Class'} Admin`;
    const adminSubtitle = useCustom && logo.adminSubtitle ? logo.adminSubtitle : 'Content Management';
    const adminIcon = useCustom && logo.adminIcon ? logo.adminIcon : (logo.icon || 'GraduationCap');
    const adminShowIcon = useCustom ? (logo.adminShowIcon !== false) : true;
    const adminBadgeColor = useCustom ? (logo.adminBadgeColor || 'bg-gradient-to-tr from-red-600 to-rose-600') : 'bg-gradient-to-tr from-red-600 to-rose-600';

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {adminShowIcon && (
          <div className={`w-10 h-10 rounded-xl ${adminBadgeColor} flex items-center justify-center text-white shadow-md shrink-0`}>
            {renderIcon(adminIcon, 'w-6 h-6')}
          </div>
        )}
        <div>
          <h2 className="font-black text-white text-base leading-tight">{adminTitle}</h2>
          <p className="text-[11px] text-slate-400">{adminSubtitle}</p>
        </div>
      </div>
    );
  }

  // 3. ADMIN LOGIN PLACEMENT (Centered Card on Dark Background)
  if (placement === 'login') {
    const useCustom = logo.adminUseCustom === true;
    const isImage = useCustom ? (logo.adminType === 'image' && logo.adminImageUrl) : (logo.type === 'image' && logo.imageUrl);
    const imageUrl = useCustom ? logo.adminImageUrl : logo.imageUrl;

    if (isImage) {
      return (
        <div className={`text-center space-y-2 ${className}`}>
          <div className="flex justify-center">
            <img
              src={imageUrl}
              alt="Admin Logo"
              className={`h-16 w-auto object-contain max-w-[240px] mx-auto ${imgClassName}`}
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            {useCustom && logo.adminTitle ? logo.adminTitle : 'First Class Admin Portal'}
          </h1>
          <p className="text-xs text-slate-400">
            {useCustom && logo.adminSubtitle ? logo.adminSubtitle : 'Manage your IELTS website content, gallery, courses & inquiries'}
          </p>
        </div>
      );
    }

    const adminTitle = useCustom && logo.adminTitle ? logo.adminTitle : 'First Class Admin Portal';
    const adminSubtitle = useCustom && logo.adminSubtitle ? logo.adminSubtitle : 'Manage your IELTS website content, gallery, courses & inquiries';
    const adminIcon = useCustom && logo.adminIcon ? logo.adminIcon : (logo.icon || 'GraduationCap');
    const adminBadgeColor = useCustom ? (logo.adminBadgeColor || 'bg-gradient-to-tr from-red-600 to-rose-600') : 'bg-gradient-to-tr from-red-600 to-rose-600';

    return (
      <div className={`text-center space-y-2 ${className}`}>
        <div className={`w-16 h-16 rounded-2xl ${adminBadgeColor} flex items-center justify-center text-white mx-auto shadow-lg shadow-red-600/30`}>
          {renderIcon(adminIcon, 'w-9 h-9')}
        </div>
        <h1 className="text-2xl font-black text-white tracking-tight">{adminTitle}</h1>
        <p className="text-xs text-slate-400">{adminSubtitle}</p>
      </div>
    );
  }

  // 4. NAVBAR / HEADER PLACEMENT (Default - Light Background)
  const isImage = logo.type === 'image' && logo.imageUrl;
  const height = logo.imageHeight || 40;

  if (isImage) {
    return (
      <div className={`flex items-center ${className}`}>
        <img
          src={logo.imageUrl}
          alt={settings?.instituteName || 'Logo'}
          style={{ height: `${height}px` }}
          className={`w-auto object-contain max-w-[180px] sm:max-w-[240px] ${imgClassName}`}
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    );
  }

  const iconName = logo.icon || 'GraduationCap';
  const showIcon = logo.showIcon !== false;
  const textPart1 = logo.textPart1 || settings?.instituteName?.split(' ')[0] || 'First Class';
  const textPart2 = logo.textPart2 || settings?.instituteName?.split(' ').slice(1).join(' ') || 'Global Education';
  const part1Class = logo.textPart1Color || activeTheme.part1Color;
  const part2Class = logo.textPart2Color || activeTheme.part2Color;

  // Handle tagline cleanly: do not fallback if set to empty string
  const taglineText = logo.tagline !== undefined
    ? logo.tagline
    : (settings?.tagline !== undefined ? settings.tagline : 'Premier IELTS, PTE & Study Abroad Academy');

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 group ${className}`}>
      {showIcon && (
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${badgeClass} flex items-center justify-center text-white shadow-md ${activeTheme.shadow} group-hover:scale-105 transition-transform shrink-0`}>
          {renderIcon(iconName, 'w-5 h-5 sm:w-5.5 sm:h-5.5')}
        </div>
      )}
      <div>
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`text-base sm:text-lg font-black ${part1Class} tracking-tight ${activeTheme.hoverText} transition-colors whitespace-nowrap`}>
            {textPart1}
          </span>
          <span className={`text-base sm:text-lg font-black ${part2Class} whitespace-nowrap`}>
            {textPart2}
          </span>
        </div>
        {taglineText && taglineText.trim() ? (
          <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium hidden sm:block truncate max-w-[200px] xl:max-w-[260px] leading-tight mt-0.5">
            {taglineText}
          </p>
        ) : null}
      </div>
    </div>
  );
}
