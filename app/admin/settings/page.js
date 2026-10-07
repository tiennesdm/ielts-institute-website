'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Building,
  Phone,
  Mail,
  MapPin,
  Clock,
  Megaphone,
  Image as ImageIcon,
  Lock,
  Plus,
  Trash2,
  Menu,
  Compass,
  LayoutTemplate,
  ShieldCheck,
  UploadCloud,
  Layers,
  MessageCircle,
  Search,
  HelpCircle,
  BookOpen,
  Trophy,
  Calendar,
  Share2,
  FileText,
  Globe,
  Eye,
  EyeOff,
  RefreshCw,
  Sliders,
  Palette,
  Check,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';
import BrandLogo, { LOGO_ICONS, THEME_GRADIENTS } from '@/components/BrandLogo';
import {
  HERO_PILL_ICONS,
  HERO_ICON_COLORS,
  HERO_BADGE_THEMES,
  HERO_BADGE_POSITIONS,
  HERO_PILLS_STYLES,
  HERO_OVERLAY_STYLES,
  HERO_BANNER_HEIGHTS,
  HERO_BANNER_BORDERS,
  HeroVisualCard
} from '@/components/HeroSection';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState('logo');
  const [logoSubTab, setLogoSubTab] = useState('navbar');
  const [heroSubTab, setHeroSubTab] = useState('banner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingFooterLogo, setUploadingFooterLogo] = useState(false);
  const [uploadingAdminLogo, setUploadingAdminLogo] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // New navigation link inputs
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavHref, setNewNavHref] = useState('');

  // New Why Us feature inputs
  const [newFeatureTitle, setNewFeatureTitle] = useState('');
  const [newFeatureDesc, setNewFeatureDesc] = useState('');

  // New program input for footer
  const [newProgram, setNewProgram] = useState('');

  // New footer quick link inputs
  const [newFooterLabel, setNewFooterLabel] = useState('');
  const [newFooterHref, setNewFooterHref] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        const s = data.settings || {};

        // Ensure sub-objects exist with defaults
        if (!s.logo) {
          s.logo = {
            type: 'text',
            imageUrl: '',
            imageHeight: 40,
            showTextWithImage: true,
            textPart1: 'First Class',
            textPart2: 'Global Education',
            tagline: s.tagline !== undefined ? s.tagline : '',
            showIcon: true,
            icon: 'GraduationCap',
            themeColor: 'blue-red',
            badgeGradient: '',
            textPart1Color: 'text-slate-900',
            textPart2Color: 'text-red-600',
            footerUseCustom: false,
            footerType: 'text',
            footerImageUrl: '',
            footerImageHeight: 42,
            footerShowText: true,
            footerText: s.instituteName || 'First Class Global Education',
            footerTagline: '',
            footerShowIcon: true,
            footerIcon: 'GraduationCap',
            footerBadgeColor: 'bg-red-600',
            adminUseCustom: false,
            adminType: 'text',
            adminImageUrl: '',
            adminImageHeight: 36,
            adminShowText: true,
            adminTitle: 'First Class Admin',
            adminSubtitle: 'Content Management',
            adminShowIcon: true,
            adminIcon: 'GraduationCap',
            adminBadgeColor: 'bg-gradient-to-tr from-red-600 to-rose-600',
          };
        } else {
          if (s.logo.tagline === undefined && s.tagline !== undefined) s.logo.tagline = s.tagline;
          if (s.logo.imageHeight === undefined) s.logo.imageHeight = 40;
          if (s.logo.showTextWithImage === undefined) s.logo.showTextWithImage = true;
          if (s.logo.icon === undefined) s.logo.icon = 'GraduationCap';
          if (s.logo.themeColor === undefined) s.logo.themeColor = 'blue-red';
          if (s.logo.footerUseCustom === undefined) s.logo.footerUseCustom = false;
          if (s.logo.footerType === undefined) s.logo.footerType = 'text';
          if (s.logo.footerImageHeight === undefined) s.logo.footerImageHeight = 42;
          if (s.logo.footerShowText === undefined) s.logo.footerShowText = true;
          if (s.logo.footerText === undefined) s.logo.footerText = s.instituteName || 'First Class Global Education';
          if (s.logo.adminUseCustom === undefined) s.logo.adminUseCustom = false;
          if (s.logo.adminType === undefined) s.logo.adminType = 'text';
          if (s.logo.adminImageHeight === undefined) s.logo.adminImageHeight = 36;
          if (s.logo.adminShowText === undefined) s.logo.adminShowText = true;
        }
        if (!s.navigation) {
          s.navigation = {
            ctaText: 'Book Free Demo',
            showPhone: true,
            links: [
              { id: 'nav-1', label: 'Home', href: '#' },
              { id: 'nav-2', label: 'Courses', href: '#courses' },
              { id: 'nav-3', label: '8+ Band Results', href: '#results' },
              { id: 'nav-4', label: 'Gallery', href: '#gallery' },
              { id: 'nav-5', label: 'Batches', href: '#batches' },
              { id: 'nav-6', label: 'Why Us', href: '#why-us' },
              { id: 'nav-7', label: 'Reviews', href: '#testimonials' },
              { id: 'nav-8', label: 'FAQs', href: '#faqs' },
              { id: 'nav-9', label: 'Contact', href: '#contact' }
            ]
          };
        }
        if (!s.footer) {
          s.footer = {
            bio: 'Official British Council & IDP certified coaching partner specializing in high-band IELTS Academic, General Training, and PTE Academic preparation.',
            accreditation: 'Certified IELTS & PTE Test Venue',
            copyright: 'All rights reserved.',
            partnerText: 'Official Training Partner IDP & Cambridge',
            address: s.address || 'SCO 42-45, 2nd & 3rd Floor, Education Hub, Sector 17, Chandigarh, India',
            phone: s.phone || '+91 98765 43210',
            email: s.email || 'info@firstclassglobaleducation.com',
            hours: s.workingHours || 'Mon - Sat: 7:00 AM - 8:30 PM | Sun: Special Mock Tests',
            col2Title: 'Explore',
            col3Title: 'Programs',
            col4Title: 'Head Campus',
            programs: [
              'IELTS Academic Comprehensive',
              'IELTS General Training (PR)',
              'Fast-Track 21-Day Crash Course',
              'PTE Academic 79+ Guaranteed',
              'CD-IELTS Computer Simulation Lab',
              '1-on-1 Daily Speaking Cabins',
              'Spoken English & Fluency'
            ]
          };
        }
        if (!s.whyUs) {
          s.whyUs = {
            badge: 'The First Class Advantage',
            title: 'Why 12,000+ Students Chose Us Over Others',
            subtitle: "We don't just lecture; we train you module-by-module until you score your target band. Here is what sets our coaching methodology apart.",
            diagnosticTitle: 'Unsure About Your Current IELTS Band Level?',
            diagnosticText: 'Take our 45-minute Free Diagnostic Evaluation Test & get an accurate band score report from our Senior Head Examiner today.',
            diagnosticCta: 'Take Free Diagnostic Test',
            items: []
          };
        }

        // Section Headings & Badges Customizer
        if (!s.sections) {
          s.sections = {
            courses: {
              badge: "Target Band 8+ Programs",
              title: "Our Certified IELTS & English Programs",
              subtitle: "Tailored curriculums designed by former IELTS examiners. Choose the program that fits your target band, immigration deadline, or study abroad dream.",
              ctaText: "Book Free Demo For This Course"
            },
            results: {
              badge: "Hall of Fame & High Achievers",
              title: "Real Students, Real 8+ Band Results",
              subtitle: "Hundreds of our students clear their target band scores on their first attempt every month and secure admissions in top Ivy League & Global Universities."
            },
            batches: {
              badge: "Admissions Open",
              title: "Upcoming IELTS & PTE Batches",
              subtitle: "Small batch size (max 15 students per batch) to ensure individualized attention. Secure your preferred timing before seats fill out.",
              ctaText: "Reserve Seat Now"
            },
            testimonials: {
              badge: "Student Experiences",
              title: "Loved By Thousands of Test Takers",
              subtitle: "Read how our structured training, daily evaluations, and master feedback helped our students achieve their immigration and admission scores."
            },
            gallery: {
              badge: "Campus & Life At Academy",
              title: "Our Photo & Campus Gallery",
              subtitle: "Take a look inside our high-tech computer simulation labs, acoustic 1-on-1 speaking cabins, visa celebrations, and student felicitation ceremonies."
            },
            faqs: {
              badge: "Got Questions?",
              title: "Frequently Asked Questions",
              subtitle: "Everything you need to know about our IELTS, PTE courses, mock test schedules, and guarantee methodology."
            },
            universities: {
              badge: "Official Global Study Abroad Network",
              title: "Direct University Tie-Ups & Global College Network",
              subtitle: "First Class Global Education LLP directly represents 100+ world-renowned universities and colleges across 30+ countries. Fast-track offer letters, scholarship evaluations, and end-to-end visa filing.",
              stats: [
                { label: "Direct University Tie-Ups", value: "850+" },
                { label: "Top Destination Countries", value: "25+" },
                { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
                { label: "Scholarships Facilitated", value: "₹12+ Crores" }
              ],
              bannerBadge: "Fast-Track Admission & Spot Assessment",
              bannerTitle: "Confused About Which University & Country Fits Your Profile?",
              bannerDesc: "Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities.",
              bannerCta: "Book Free 1-on-1 Profile Assessment",
              marqueeTitle: "Representing 850+ Direct Global Partner Universities & Colleges"
            }
          };
        }

        // Ensure default footer quick links if empty
        if (!s.footer.links || s.footer.links.length === 0) {
          s.footer.links = [
            { id: 'foot-1', label: 'Band 8+ Courses', href: '#courses' },
            { id: 'foot-2', label: 'Hall of Fame & Results', href: '#results' },
            { id: 'foot-uni', label: 'University Tie-ups', href: '#universities' },
            { id: 'foot-3', label: 'Campus Photo Gallery', href: '#gallery' },
            { id: 'foot-4', label: 'Upcoming Batches', href: '#batches' },
            { id: 'foot-5', label: 'Why Choose Us', href: '#why-us' },
            { id: 'foot-6', label: 'Student Reviews', href: '#testimonials' },
            { id: 'foot-7', label: 'Frequently Asked Questions', href: '#faqs' },
          ];
        }

        // Section Visibility Defaults
        if (!s.sections.courses) s.sections.courses = {};
        if (s.sections.courses.show === undefined) s.sections.courses.show = true;
        if (!s.sections.results) s.sections.results = {};
        if (s.sections.results.show === undefined) s.sections.results.show = true;
        if (!s.sections.batches) s.sections.batches = {};
        if (s.sections.batches.show === undefined) s.sections.batches.show = true;
        if (!s.sections.testimonials) s.sections.testimonials = {};
        if (s.sections.testimonials.show === undefined) s.sections.testimonials.show = true;
        if (!s.sections.gallery) s.sections.gallery = {};
        if (s.sections.gallery.show === undefined) s.sections.gallery.show = true;
        if (!s.sections.faqs) s.sections.faqs = {};
        if (s.sections.faqs.show === undefined) s.sections.faqs.show = true;
        if (!s.sections.universities) s.sections.universities = {};
        if (s.sections.universities.show === undefined) s.sections.universities.show = true;
        if (!s.sections.whyUs) s.sections.whyUs = {};
        if (s.sections.whyUs.show === undefined) s.sections.whyUs.show = true;
        if (s.whyUs && s.whyUs.show === undefined) s.whyUs.show = true;
        if (s.showStats === undefined) s.showStats = true;
        if (s.hero && s.hero.show === undefined) s.hero.show = true;
        if (s.showFooter === undefined) s.showFooter = true;

        // Hero sub-elements
        if (!s.hero) s.hero = {};
        if (s.hero.showBadge === undefined) s.hero.showBadge = true;
        if (s.hero.showHighlights === undefined) s.hero.showHighlights = true;
        if (s.hero.showPrimaryCta === undefined) s.hero.showPrimaryCta = true;
        if (s.hero.primaryCtaType === undefined) s.hero.primaryCtaType = 'modal';
        if (s.hero.primaryCtaLink === undefined) s.hero.primaryCtaLink = '';
        if (s.hero.showSecondaryCta === undefined) s.hero.showSecondaryCta = true;
        if (s.hero.secondaryCtaLink === undefined) s.hero.secondaryCtaLink = '#courses';
        if (s.hero.showCallbackBox === undefined) s.hero.showCallbackBox = true;
        if (s.hero.showFloatingBadge === undefined) s.hero.showFloatingBadge = true;
        if (s.hero.showBottomPills === undefined) s.hero.showBottomPills = true;
        if (!s.hero.highlights) {
          s.hero.highlights = [
            "Daily 1-on-1 Speaking with Certified Examiners",
            "Daily Writing Task 1 & 2 Line Corrections",
            "Official CD-IELTS Computer Simulation Lab",
            "Cambridge Official Books (1-19) Study Kits"
          ];
        }
        if (!s.hero.floatingBadge) {
          s.hero.floatingBadge = {
            score: "8.5",
            label: "Top Achiever",
            title: "Overall IELTS Band",
            sub: "L: 9.0 • R: 9.0 • S: 8.5"
          };
        }
        if (!s.hero.bottomPills) {
          s.hero.bottomPills = [
            { icon: "Award", text: "IDP & British Council" },
            { icon: "Headphones", text: "Real Headset Lab" },
            { icon: "Shield", text: "100% Guaranteed" }
          ];
        }
        if (!s.hero.callbackBox) {
          s.hero.callbackBox = {
            placeholder: "Enter Mobile No for Instant Call",
            buttonText: "Request Call",
            successText: "Thank you! Our senior counselor will call you within 15 minutes."
          };
        }
        if (s.showStats === undefined) s.showStats = true;
        if (!s.stats || s.stats.length === 0) {
          s.stats = [
            { id: "stat-1", value: "98.4%", label: "Success Rate", subtext: "7+ Bands in first attempt" },
            { id: "stat-2", value: "12,500+", label: "Students Trained", subtext: "Across 25+ countries" },
            { id: "stat-3", value: "3,400+", label: "8+ Band Achievers", subtext: "Academic & General" },
            { id: "stat-4", value: "15+ Yrs", label: "Excellence Record", subtext: "Certified Master Mentors" }
          ];
        }

        // Modal Customizer
        if (!s.modal) {
          s.modal = {
            badge: "Limited Free Slots Available",
            title: "Book Free Demo & Mock Test",
            subtitle: "Experience our 1-on-1 speaking session, software lab & diagnostic evaluation test without paying anything.",
            buttonText: "Book Free 2-Hour Demo Class",
            successTitle: "Seat Reserved Successfully!",
            successMessage: "Thank you for contacting us. Our senior counseling mentor will call you within 30 minutes to confirm your demo timing and send the Cambridge preparation kit.",
            footerNote: "🔒 100% Confidential. No spam. You will only be contacted by an academic counselor."
          };
        }

        // WhatsApp Customizer
        if (!s.whatsappConfig) {
          s.whatsappConfig = {
            enabled: true,
            number: s.whatsapp || "919876543210",
            buttonText: "Chat on WhatsApp",
            prefilledMessage: "Hello First Class Global Education, I am interested in IELTS coaching and would like to know batch timings and fees."
          };
        }

        // Social Profiles
        if (!s.social) {
          s.social = {
            instagram: "https://instagram.com",
            facebook: "https://facebook.com",
            youtube: "https://youtube.com",
            linkedin: "https://linkedin.com",
            telegram: ""
          };
        }

        // Dynamic SEO
        if (!s.seo) {
          s.seo = {
            metaTitle: "First Class Global Education | 8+ Bands IELTS, PTE & Study Abroad Coaching",
            metaDescription: "First Class Global Education - Premier IELTS, PTE & Spoken English Institute. Daily 1-on-1 speaking, CD-IELTS computer lab, Cambridge certified trainers and verified 8+ band results.",
            keywords: "IELTS Coaching, PTE Academic, Study Abroad, Canada Visa, UK Student Visa, Chandigarh IELTS Institute, Band 8 Preparation"
          };
        }

        setSettings(s);
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  // Generic Image Uploader with instant client-side preview & compression
  const handleUploadImage = async (file, onUploaded, setUploadingState) => {
    if (!file) return;
    setUploadingState(true);
    setError('');

    try {
      // 1. Instant client-side compression & preview (under 50ms)
      const dataUrl = await processAndUploadImage(file, 1400, 1400, 0.85);
      if (dataUrl) {
        onUploaded(dataUrl);
      }

      // 2. Also send to upload API
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        onUploaded(data.url);
        setMessage('Image uploaded successfully! Remember to click "Save All Changes".');
      }
    } catch (err) {
      console.warn('Upload fallback to client data URL:', err);
      setMessage('Image ready for save! Click "Save All Changes" below.');
    } finally {
      setUploadingState(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = { settings };
      if (adminPassword.trim()) {
        payload.adminPassword = adminPassword.trim();
      }

      const res = await fetch('/api/admin/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('All settings, navigation, logo, and footer saved successfully!');
        setAdminPassword('');
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Network error while saving settings');
    } finally {
      setSaving(false);
    }
  };

  // Nav link helpers
  const handleAddNavLink = () => {
    if (!newNavLabel.trim()) return;
    const newLink = {
      id: `nav-${Date.now()}`,
      label: newNavLabel.trim(),
      href: newNavHref.trim() || '#'
    };
    setSettings(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        links: [...(prev.navigation?.links || []), newLink]
      }
    }));
    setNewNavLabel('');
    setNewNavHref('');
  };

  const handleDeleteNavLink = (id) => {
    setSettings(prev => ({
      ...prev,
      navigation: {
        ...prev.navigation,
        links: prev.navigation?.links?.filter(l => l.id !== id) || []
      }
    }));
  };

  // Why Us feature helpers
  const handleAddFeature = () => {
    if (!newFeatureTitle.trim()) return;
    const newFeat = {
      id: `why-${Date.now()}`,
      title: newFeatureTitle.trim(),
      description: newFeatureDesc.trim()
    };
    setSettings(prev => ({
      ...prev,
      whyUs: {
        ...prev.whyUs,
        items: [...(prev.whyUs?.items || []), newFeat]
      }
    }));
    setNewFeatureTitle('');
    setNewFeatureDesc('');
  };

  const handleDeleteFeature = (id) => {
    setSettings(prev => ({
      ...prev,
      whyUs: {
        ...prev.whyUs,
        items: prev.whyUs?.items?.filter(item => item.id !== id) || []
      }
    }));
  };

  // Footer program helpers
  const handleAddProgram = () => {
    if (!newProgram.trim()) return;
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        programs: [...(prev.footer?.programs || []), newProgram.trim()]
      }
    }));
    setNewProgram('');
  };

  const handleDeleteProgram = (idx) => {
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        programs: prev.footer?.programs?.filter((_, i) => i !== idx) || []
      }
    }));
  };

  // Footer quick link helpers (Column 2: Explore)
  const handleAddFooterLink = () => {
    if (!newFooterLabel.trim()) return;
    const newLink = {
      id: `foot-${Date.now()}`,
      label: newFooterLabel.trim(),
      href: newFooterHref.trim() || '#'
    };
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: [...(prev.footer?.links || []), newLink]
      }
    }));
    setNewFooterLabel('');
    setNewFooterHref('');
  };

  const handleDeleteFooterLink = (id) => {
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: (prev.footer?.links || []).filter(l => l.id !== id)
      }
    }));
  };

  const handleCopyNavToFooter = () => {
    if (!settings.navigation?.links || settings.navigation.links.length === 0) return;
    const copied = settings.navigation.links.map((link, idx) => ({
      id: `foot-copy-${Date.now()}-${idx}`,
      label: link.label,
      href: link.href
    }));
    setSettings(prev => ({
      ...prev,
      footer: {
        ...prev.footer,
        links: copied
      }
    }));
  };

  // Homepage Section Visibility Toggler
  const toggleSectionVisibility = (sectionKey) => {
    if (sectionKey === 'hero') {
      setSettings(prev => ({
        ...prev,
        hero: { ...prev.hero, show: prev.hero?.show === false ? true : false }
      }));
      return;
    }
    if (sectionKey === 'stats') {
      setSettings(prev => ({
        ...prev,
        showStats: prev.showStats === false ? true : false
      }));
      return;
    }
    if (sectionKey === 'whyUs') {
      const currentVal = (settings.whyUs?.show !== false && settings.sections?.whyUs?.show !== false);
      const nextVal = !currentVal;
      setSettings(prev => ({
        ...prev,
        whyUs: { ...prev.whyUs, show: nextVal },
        sections: {
          ...prev.sections,
          whyUs: { ...prev.sections?.whyUs, show: nextVal }
        }
      }));
      return;
    }
    const currentVal = settings.sections?.[sectionKey]?.show !== false;
    setSettings(prev => ({
      ...prev,
      sections: {
        ...prev.sections,
        [sectionKey]: {
          ...prev.sections?.[sectionKey],
          show: !currentVal
        }
      }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'logo', label: '🏷️ Logo & Brand' },
    { id: 'navigation', label: '🧭 Navigation Menu' },
    { id: 'hero', label: '⭐ Hero Banner & Stats' },
    { id: 'sections', label: '📑 Sections & Visibility' },
    { id: 'modal', label: '📝 Inquiry & Demo Popup' },
    { id: 'whatsapp', label: '💬 WhatsApp & Callbacks' },
    { id: 'footer', label: '🦶 Footer & Bio' },
    { id: 'social', label: '🌐 Social Links' },
    { id: 'seo', label: '🔍 Dynamic SEO' },
    { id: 'announcement', label: '📢 Notice Bar' },
    { id: 'whyUs', label: '🌟 Why Choose Us' },
    { id: 'stats', label: '📊 Stats Counters' },
    { id: 'security', label: '🔒 Security & Email' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Full Site & Branding Customizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Change logo, header navigation links, footer content, hero banner, announcement, and why-us section.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-blue-950 text-white shadow-md'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: LOGO & BRAND */}
      {activeTab === 'logo' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Logo & Multi-Placement Identity</h2>
                <p className="text-xs text-slate-500">Configure theme colors, custom icons, and independent logos for Header, Footer, and Admin.</p>
              </div>
            </div>

            {/* Placement Switcher Sub-Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLogoSubTab('navbar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  logoSubTab === 'navbar'
                    ? 'bg-white text-blue-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌐 Header Navbar
              </button>
              <button
                type="button"
                onClick={() => setLogoSubTab('footer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  logoSubTab === 'footer'
                    ? 'bg-white text-blue-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📄 Footer (Dark)
              </button>
              <button
                type="button"
                onClick={() => setLogoSubTab('admin')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  logoSubTab === 'admin'
                    ? 'bg-white text-blue-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🔐 Admin Portal
              </button>
            </div>
          </div>

          {/* SUB-TAB 1: HEADER NAVBAR LOGO */}
          {logoSubTab === 'navbar' && (
            <div className="space-y-6">
              {/* Live Preview Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-500">Live Header Preview (Light Theme)</span>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">Interactive</span>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-between">
                  <BrandLogo placement="navbar" settings={settings} />
                  <span className="text-xs text-slate-400 hidden sm:inline font-mono">Navbar Simulation</span>
                </div>
              </div>

              {/* Logo Type Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Header Logo Type</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border p-3.5 rounded-xl hover:bg-slate-100 transition-colors">
                    <input
                      type="radio"
                      name="headerLogoType"
                      value="text"
                      checked={settings.logo?.type !== 'image'}
                      onChange={() => setSettings(prev => ({
                        ...prev,
                        logo: { ...prev.logo, type: 'text' }
                      }))}
                      className="w-4 h-4 text-red-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Stylized Dynamic Text Logo</span>
                      <span className="text-[11px] text-slate-500">Custom 2-part brand text, theme palette, and icon badge</span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border p-3.5 rounded-xl hover:bg-slate-100 transition-colors">
                    <input
                      type="radio"
                      name="headerLogoType"
                      value="image"
                      checked={settings.logo?.type === 'image'}
                      onChange={() => setSettings(prev => ({
                        ...prev,
                        logo: { ...prev.logo, type: 'image' }
                      }))}
                      className="w-4 h-4 text-red-600"
                    />
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">Custom Image Logo</span>
                      <span className="text-[11px] text-slate-500">Upload official transparent PNG/SVG or JPG file</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Header Image Logo Fields */}
              {settings.logo?.type === 'image' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Header Logo File (PNG / JPG / WEBP / SVG)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        placeholder="Paste Image URL or click Upload"
                        value={settings.logo?.imageUrl || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          logo: { ...prev.logo, imageUrl: e.target.value }
                        }))}
                        className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                      />
                      <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4" />
                        <span>{uploadingLogo ? 'Uploading...' : 'Upload Logo File'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(
                            e.target.files?.[0],
                            (url) => setSettings(prev => ({ ...prev, logo: { ...prev.logo, imageUrl: url } })),
                            setUploadingLogo
                          )}
                          className="hidden"
                          disabled={uploadingLogo}
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-xs font-bold text-slate-700">Logo Display Height (px)</label>
                      <span className="text-xs font-mono font-bold text-slate-600">{settings.logo?.imageHeight || 40}px</span>
                    </div>
                    <input
                      type="range"
                      min="28"
                      max="64"
                      value={settings.logo?.imageHeight || 40}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        logo: { ...prev.logo, imageHeight: Number(e.target.value) }
                      }))}
                      className="w-full accent-red-600 cursor-pointer"
                    />
                  </div>

                  {/* Toggle Display Text with Image */}
                  <div className="pt-3 border-t border-slate-200">
                    <label className="flex items-start sm:items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.logo?.showTextWithImage !== false}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          logo: { ...prev.logo, showTextWithImage: e.target.checked }
                        }))}
                        className="w-4 h-4 text-red-600 rounded mt-0.5 sm:mt-0"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">
                          Display Brand Name & Tagline alongside Logo Image (Image + Text)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Keep this checked if your logo is an emblem/crest and you want your institute name & tagline beside it. Uncheck if your image is already a full banner graphic containing the institute text.
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              )}

              {/* Theme Gradient Color Preset */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Brand Theme & Typography Color Palette
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {Object.entries(THEME_GRADIENTS).map(([key, val]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSettings(prev => ({
                        ...prev,
                        logo: {
                          ...prev.logo,
                          themeColor: key,
                          badgeGradient: val.badge
                        }
                      }))}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                        (settings.logo?.themeColor || 'blue-red') === key
                          ? 'border-blue-900 ring-2 ring-blue-900/20 bg-blue-50/50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-lg ${val.badge} shrink-0 shadow-sm`} />
                      <span className="text-xs font-bold text-slate-800 truncate">{val.label.split('(')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Icon Selector (Only for stylized text mode) */}
              {settings.logo?.type !== 'image' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">
                    Choose Icon Badge Symbol
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                    {Object.entries(LOGO_ICONS).map(([key, item]) => {
                      const IconComp = item.component;
                      const isSelected = (settings.logo?.icon || 'GraduationCap') === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSettings(prev => ({
                            ...prev,
                            logo: { ...prev.logo, icon: key }
                          }))}
                          className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                            isSelected
                              ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                              : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <IconComp className="w-4 h-4 shrink-0" />
                          <span className="text-xs truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Brand Text Inputs (Always visible so user can edit Brand Name Part 1, Part 2, and Tagline!) */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-4 shadow-sm">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">Brand Name & Tagline Text</h3>
                    <p className="text-[11px] text-slate-500">
                      {settings.logo?.type === 'image'
                        ? (settings.logo?.showTextWithImage !== false
                            ? 'This text appears beside your custom logo emblem/image in the header navbar.'
                            : 'Currently hidden on navbar because "Display Brand Name & Tagline alongside Logo Image" is unchecked.')
                        : 'Configure the brand name typography and tagline for your institute.'}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name (Part 1)</label>
                    <input
                      type="text"
                      value={settings.logo?.textPart1 || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        logo: { ...prev.logo, textPart1: e.target.value }
                      }))}
                      placeholder="First Class"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-slate-900"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Usually the first word(s) in bold dark color</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name (Part 2)</label>
                    <input
                      type="text"
                      value={settings.logo?.textPart2 || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        logo: { ...prev.logo, textPart2: e.target.value }
                      }))}
                      placeholder="Global Education"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-red-600"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">Highlighted accent color text</span>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tagline / Subtext under Logo (Leave empty to hide completely)
                    </label>
                    <input
                      type="text"
                      value={settings.logo?.tagline !== undefined ? settings.logo.tagline : (settings.tagline !== undefined ? settings.tagline : '')}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        tagline: e.target.value,
                        logo: { ...prev.logo, tagline: e.target.value }
                      }))}
                      placeholder="e.g. Premier IELTS, PTE & Study Abroad Academy"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700"
                    />
                  </div>

                  {settings.logo?.type !== 'image' && (
                    <div>
                      <label className="flex items-center gap-2 cursor-pointer pt-1">
                        <input
                          type="checkbox"
                          checked={settings.logo?.showIcon !== false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            logo: { ...prev.logo, showIcon: e.target.checked }
                          }))}
                          className="w-4 h-4 text-red-600 rounded"
                        />
                        <span className="text-xs font-bold text-slate-800">Show Icon Badge in Logo</span>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: FOOTER LOGO */}
          {logoSubTab === 'footer' && (
            <div className="space-y-6">
              {/* Live Preview on Dark Background */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Live Footer Preview (Dark Theme)</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">Interactive</span>
                </div>
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-xl shadow-inner flex items-center justify-between">
                  <BrandLogo placement="footer" settings={settings} />
                  <span className="text-xs text-slate-500 hidden sm:inline font-mono">Footer Simulation</span>
                </div>
              </div>

              {/* Custom Footer Logo Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.logo?.footerUseCustom === true}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      logo: { ...prev.logo, footerUseCustom: e.target.checked }
                    }))}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Use Custom / Dedicated Logo for Footer</span>
                    <span className="text-[11px] text-slate-500">Enable this if you want a separate logo (e.g. an all-white PNG for dark backgrounds) in the footer.</span>
                  </div>
                </label>
              </div>

              {settings.logo?.footerUseCustom ? (
                <div className="space-y-5 p-4 border border-slate-200 rounded-2xl">
                  {/* Footer Logo Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border p-3 rounded-xl hover:bg-slate-100">
                      <input
                        type="radio"
                        name="footerLogoType"
                        value="image"
                        checked={settings.logo?.footerType === 'image'}
                        onChange={() => setSettings(prev => ({
                          ...prev,
                          logo: { ...prev.logo, footerType: 'image' }
                        }))}
                        className="w-4 h-4 text-red-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Custom Footer Image</span>
                        <span className="text-[11px] text-slate-500">Transparent white PNG/SVG for dark background</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border p-3 rounded-xl hover:bg-slate-100">
                      <input
                        type="radio"
                        name="footerLogoType"
                        value="text"
                        checked={settings.logo?.footerType !== 'image'}
                        onChange={() => setSettings(prev => ({
                          ...prev,
                          logo: { ...prev.logo, footerType: 'text' }
                        }))}
                        className="w-4 h-4 text-red-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Custom Footer Text</span>
                        <span className="text-[11px] text-slate-500">White typography with customizable icon</span>
                      </div>
                    </label>
                  </div>

                  {/* If Footer Image */}
                  {settings.logo?.footerType === 'image' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Footer Image File (Transparent White PNG / SVG)
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <input
                            type="text"
                            placeholder="Paste Footer Logo URL or upload"
                            value={settings.logo?.footerImageUrl || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logo: { ...prev.logo, footerImageUrl: e.target.value }
                            }))}
                            className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                          />
                          <label className="px-4 py-2.5 bg-blue-950 hover:bg-blue-900 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm flex items-center gap-1.5">
                            <UploadCloud className="w-4 h-4" />
                            <span>{uploadingFooterLogo ? 'Uploading...' : 'Upload Footer Logo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadImage(
                                e.target.files?.[0],
                                (url) => setSettings(prev => ({ ...prev, logo: { ...prev.logo, footerImageUrl: url } })),
                                setUploadingFooterLogo
                              )}
                              className="hidden"
                              disabled={uploadingFooterLogo}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">Footer Logo Height (px)</label>
                          <span className="text-xs font-mono font-bold text-slate-600">{settings.logo?.footerImageHeight || 42}px</span>
                        </div>
                        <input
                          type="range"
                          min="28"
                          max="64"
                          value={settings.logo?.footerImageHeight || 42}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            logo: { ...prev.logo, footerImageHeight: Number(e.target.value) }
                          }))}
                          className="w-full accent-blue-950 cursor-pointer"
                        />
                      </div>

                      {/* Toggle Display Text with Footer Image */}
                      <div className="pt-3 border-t border-slate-200">
                        <label className="flex items-start sm:items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.logo?.footerShowText !== false}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logo: { ...prev.logo, footerShowText: e.target.checked }
                            }))}
                            className="w-4 h-4 text-red-600 rounded mt-0.5 sm:mt-0"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Display Footer Brand Text alongside Image (Image + Text)
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Show your brand text and footer tagline beside the footer image.
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Footer Text inputs if text is shown with image */}
                      {settings.logo?.footerShowText !== false && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Footer Brand Text</label>
                            <input
                              type="text"
                              value={settings.logo?.footerText || ''}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                logo: { ...prev.logo, footerText: e.target.value }
                              }))}
                              placeholder={settings.instituteName || 'First Class Global Education'}
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Footer Tagline (Optional)</label>
                            <input
                              type="text"
                              value={settings.logo?.footerTagline || ''}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                logo: { ...prev.logo, footerTagline: e.target.value }
                              }))}
                              placeholder="e.g. Official Training Partner IDP & Cambridge"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If Footer Text */}
                  {settings.logo?.footerType !== 'image' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Footer Brand Text</label>
                        <input
                          type="text"
                          value={settings.logo?.footerText || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            logo: { ...prev.logo, footerText: e.target.value }
                          }))}
                          placeholder={settings.instituteName || 'First Class Global Education'}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Footer Tagline (Optional)</label>
                        <input
                          type="text"
                          value={settings.logo?.footerTagline || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            logo: { ...prev.logo, footerTagline: e.target.value }
                          }))}
                          placeholder="e.g. Official Training Partner IDP & Cambridge"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Footer Icon Badge Symbol</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {Object.entries(LOGO_ICONS).map(([key, item]) => {
                            const IconComp = item.component;
                            const isSelected = (settings.logo?.footerIcon || 'GraduationCap') === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setSettings(prev => ({
                                  ...prev,
                                  logo: { ...prev.logo, footerIcon: key }
                                }))}
                                className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                                  isSelected
                                    ? 'border-blue-900 bg-blue-50 text-blue-900 font-bold'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <IconComp className="w-4 h-4 shrink-0" />
                                <span className="text-xs truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                  <p className="font-bold">ℹ️ Currently Linked to Header Logo</p>
                  <p className="text-blue-800/80">The footer automatically adapts your header logo with high-contrast text and crisp styling for dark backgrounds. Check the box above if you wish to upload a unique, dedicated image file or custom text for the footer.</p>
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 3: ADMIN PORTAL LOGO */}
          {logoSubTab === 'admin' && (
            <div className="space-y-6">
              {/* Live Preview on Admin Dark Background */}
              <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-400">Live Admin Sidebar Preview</span>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">Interactive</span>
                </div>
                <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl shadow-inner flex items-center justify-between">
                  <BrandLogo placement="admin" settings={settings} />
                  <span className="text-xs text-slate-500 hidden sm:inline font-mono">Sidebar Simulation</span>
                </div>
              </div>

              {/* Custom Admin Logo Toggle */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.logo?.adminUseCustom === true}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      logo: { ...prev.logo, adminUseCustom: e.target.checked }
                    }))}
                    className="w-4 h-4 text-red-600 rounded"
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Use Custom / Dedicated Logo for Admin Portal</span>
                    <span className="text-[11px] text-slate-500">Customize the title, subtitle, icon, or image used on the Admin Sidebar and Login screen.</span>
                  </div>
                </label>
              </div>

              {settings.logo?.adminUseCustom ? (
                <div className="space-y-5 p-4 border border-slate-200 rounded-2xl">
                  {/* Admin Logo Type */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border p-3 rounded-xl hover:bg-slate-100">
                      <input
                        type="radio"
                        name="adminLogoType"
                        value="text"
                        checked={settings.logo?.adminType !== 'image'}
                        onChange={() => setSettings(prev => ({
                          ...prev,
                          logo: { ...prev.logo, adminType: 'text' }
                        }))}
                        className="w-4 h-4 text-red-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Stylized Admin Title & Icon</span>
                        <span className="text-[11px] text-slate-500">Custom portal title with badge</span>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer bg-slate-50 border p-3 rounded-xl hover:bg-slate-100">
                      <input
                        type="radio"
                        name="adminLogoType"
                        value="image"
                        checked={settings.logo?.adminType === 'image'}
                        onChange={() => setSettings(prev => ({
                          ...prev,
                          logo: { ...prev.logo, adminType: 'image' }
                        }))}
                        className="w-4 h-4 text-red-600"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-900 block">Custom Admin Image</span>
                        <span className="text-[11px] text-slate-500">Upload dedicated admin branding image</span>
                      </div>
                    </label>
                  </div>

                  {/* If Admin Image */}
                  {settings.logo?.adminType === 'image' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Admin Logo File
                        </label>
                        <div className="flex flex-col sm:flex-row items-center gap-3">
                          <input
                            type="text"
                            placeholder="Paste Admin Logo URL or upload"
                            value={settings.logo?.adminImageUrl || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logo: { ...prev.logo, adminImageUrl: e.target.value }
                            }))}
                            className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                          />
                          <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm flex items-center gap-1.5">
                            <UploadCloud className="w-4 h-4" />
                            <span>{uploadingAdminLogo ? 'Uploading...' : 'Upload Admin Logo'}</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleUploadImage(
                                e.target.files?.[0],
                                (url) => setSettings(prev => ({ ...prev, logo: { ...prev.logo, adminImageUrl: url } })),
                                setUploadingAdminLogo
                              )}
                              className="hidden"
                              disabled={uploadingAdminLogo}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-xs font-bold text-slate-700">Admin Logo Height (px)</label>
                          <span className="text-xs font-mono font-bold text-slate-600">{settings.logo?.adminImageHeight || 36}px</span>
                        </div>
                        <input
                          type="range"
                          min="24"
                          max="54"
                          value={settings.logo?.adminImageHeight || 36}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            logo: { ...prev.logo, adminImageHeight: Number(e.target.value) }
                          }))}
                          className="w-full accent-red-600 cursor-pointer"
                        />
                      </div>

                      {/* Toggle Display Text with Admin Image */}
                      <div className="pt-3 border-t border-slate-200">
                        <label className="flex items-start sm:items-center gap-2.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.logo?.adminShowText !== false}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logo: { ...prev.logo, adminShowText: e.target.checked }
                            }))}
                            className="w-4 h-4 text-red-600 rounded mt-0.5 sm:mt-0"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              Display Admin Title & Subtitle alongside Image
                            </span>
                            <span className="text-[11px] text-slate-500">
                              Show admin portal title and subtitle beside the logo image on the sidebar.
                            </span>
                          </div>
                        </label>
                      </div>

                      {/* Admin Text inputs if text is shown with image */}
                      {settings.logo?.adminShowText !== false && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Portal Title</label>
                            <input
                              type="text"
                              value={settings.logo?.adminTitle || ''}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                logo: { ...prev.logo, adminTitle: e.target.value }
                              }))}
                              placeholder="First Class Admin"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Admin Subtitle</label>
                            <input
                              type="text"
                              value={settings.logo?.adminSubtitle || ''}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                logo: { ...prev.logo, adminSubtitle: e.target.value }
                              }))}
                              placeholder="Content Management"
                              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* If Admin Text */}
                  {settings.logo?.adminType !== 'image' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Admin Portal Title</label>
                          <input
                            type="text"
                            value={settings.logo?.adminTitle || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logo: { ...prev.logo, adminTitle: e.target.value }
                            }))}
                            placeholder="First Class Admin"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Admin Subtitle</label>
                          <input
                            type="text"
                            value={settings.logo?.adminSubtitle || ''}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              logo: { ...prev.logo, adminSubtitle: e.target.value }
                            }))}
                            placeholder="Content Management"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Admin Icon Badge Symbol</label>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {Object.entries(LOGO_ICONS).map(([key, item]) => {
                            const IconComp = item.component;
                            const isSelected = (settings.logo?.adminIcon || 'GraduationCap') === key;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setSettings(prev => ({
                                  ...prev,
                                  logo: { ...prev.logo, adminIcon: key }
                                }))}
                                className={`p-2 rounded-xl border flex items-center gap-2 transition-all ${
                                  isSelected
                                    ? 'border-red-600 bg-red-50 text-red-600 font-bold'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <IconComp className="w-4 h-4 shrink-0" />
                                <span className="text-xs truncate">{item.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600 space-y-1">
                  <p className="font-bold text-slate-900">ℹ️ Currently Linked to Brand Logo</p>
                  <p>The Admin Sidebar & Login screen inherit your institute's name and icon automatically.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: NAVIGATION MENU MANAGER */}
      {activeTab === 'navigation' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-900" />
              <h2 className="text-base font-bold text-slate-900">Header Navigation Menu Links</h2>
            </div>
          </div>

          {/* Helpful Guidance Notice */}
          <div className="p-4 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-start gap-3">
            <Compass className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs text-blue-900 leading-relaxed">
              <span className="font-bold text-blue-950">Independent Header Navigation Controls:</span>
              <p>
                Removing or editing links here <strong>only affects the top header navigation bar</strong>. Removing a link here will <em>not</em> delete or hide the section from your public homepage, and will not alter your footer links.
              </p>
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setActiveTab('sections')}
                  className="font-bold text-red-600 hover:text-red-700 underline inline-flex items-center gap-1"
                >
                  <span>Go to Homepage Sections & Visibility Controls →</span>
                </button>
              </div>
            </div>
          </div>

          {/* CTA & Phone Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Header Button Text</label>
              <input
                type="text"
                value={settings.navigation?.ctaText || 'Book Free Demo'}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  navigation: { ...prev.navigation, ctaText: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Header Phone Number</label>
              <input
                type="text"
                value={settings.phone || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  phone: e.target.value
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
              />
            </div>
          </div>

          {/* Add New Nav Link Form */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Navigation Link</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Link Label (e.g. Visa Services)"
                value={newNavLabel}
                onChange={(e) => setNewNavLabel(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <input
                type="text"
                placeholder="URL / Section (e.g. #courses or https://...)"
                value={newNavHref}
                onChange={(e) => setNewNavHref(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddNavLink}
                className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Link</span>
              </button>
            </div>
          </div>

          {/* Existing Links List */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Navigation Links</h3>
            <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
              {settings.navigation?.links?.map((link, idx) => (
                <div key={link.id || idx} className="p-3.5 bg-white flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-500 font-bold text-xs flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => {
                        const updated = [...settings.navigation.links];
                        updated[idx].label = e.target.value;
                        setSettings(prev => ({
                          ...prev,
                          navigation: { ...prev.navigation, links: updated }
                        }));
                      }}
                      className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 w-36 sm:w-48"
                    />
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => {
                        const updated = [...settings.navigation.links];
                        updated[idx].href = e.target.value;
                        setSettings(prev => ({
                          ...prev,
                          navigation: { ...prev.navigation, links: updated }
                        }));
                      }}
                      className="px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-600 font-mono flex-1"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteNavLink(link.id)}
                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 3: HERO BANNER & STATS */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Hero Section & Stats Customizer</h2>
                <p className="text-xs text-slate-500">Edit headline, highlights, CTA buttons, callback box, hero media, and metric counter cards.</p>
              </div>
            </div>

            {/* Sub-tab switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setHeroSubTab('banner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  heroSubTab === 'banner'
                    ? 'bg-white text-blue-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⭐ Hero Banner
              </button>
              <button
                type="button"
                onClick={() => setHeroSubTab('stats')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  heroSubTab === 'stats'
                    ? 'bg-white text-blue-950 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                📊 Stats Counter Cards ({settings.stats?.length || 0})
              </button>
            </div>
          </div>

          {heroSubTab === 'banner' && (
            <div className="space-y-6">
              {/* Card 1: Top Pill Badge & Main Typography */}
              <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-slate-700">Top Rating Badge & Main Typography</span>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.hero?.showBadge !== false}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hero: { ...prev.hero, showBadge: e.target.checked }
                      }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span>Show Top Pill Badge</span>
                  </label>
                </div>

                {settings.hero?.showBadge !== false && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Top Pill Badge Text</label>
                    <input
                      type="text"
                      placeholder="e.g. ⭐ Rated 4.9/5 by 12,000+ Achievers • British Council Partner"
                      value={settings.hero?.badge || ''}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hero: { ...prev.hero, badge: e.target.value }
                      }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold bg-white text-amber-700"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={settings.hero?.headline || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hero: { ...prev.hero, headline: e.target.value }
                    }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-base font-black text-slate-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Sub-headline Description</label>
                  <textarea
                    rows={3}
                    value={settings.hero?.subheadline || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hero: { ...prev.hero, subheadline: e.target.value }
                    }))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700 bg-white"
                  />
                </div>
              </div>

              {/* Card 2: Feature Highlights (Checkmarks) */}
              <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Feature Highlights (Checkmarks)</span>
                    <span className="text-[11px] text-slate-500">Bullet points shown below sub-headline on hero</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.hero?.showHighlights !== false}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hero: { ...prev.hero, showHighlights: e.target.checked }
                      }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span>Show Checkmarks</span>
                  </label>
                </div>

                {settings.hero?.showHighlights !== false && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {(settings.hero?.highlights || []).map((hl, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-white p-2.5 border border-slate-200 rounded-xl shadow-xs">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          <input
                            type="text"
                            value={hl}
                            onChange={(e) => {
                              const updated = [...(settings.hero?.highlights || [])];
                              updated[idx] = e.target.value;
                              setSettings(prev => ({
                                ...prev,
                                hero: { ...prev.hero, highlights: updated }
                              }));
                            }}
                            className="flex-1 text-xs text-slate-800 bg-transparent focus:outline-none font-medium"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (settings.hero?.highlights || []).filter((_, i) => i !== idx);
                              setSettings(prev => ({
                                ...prev,
                                hero: { ...prev.hero, highlights: updated }
                              }));
                            }}
                            className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                            title="Delete this highlight"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...(settings.hero?.highlights || []), 'New Training Advantage Feature'];
                        setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, highlights: updated }
                        }));
                      }}
                      className="px-3.5 py-2 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Highlight Bullet</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Card 3: Call-To-Action (CTA) Buttons */}
              <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Hero Call-To-Action Buttons</span>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Primary CTA */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-red-600">Primary Button (Red Gradient)</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-600">
                        <input
                          type="checkbox"
                          checked={settings.hero?.showPrimaryCta !== false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, showPrimaryCta: e.target.checked }
                          }))}
                          className="w-3.5 h-3.5 text-red-600 rounded"
                        />
                        <span>Show</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={settings.hero?.primaryCtaText || 'Book Free Mock Test & Demo'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, primaryCtaText: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1.5">Action on Click</label>
                      <div className="space-y-2">
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="primaryCtaType"
                            value="modal"
                            checked={(settings.hero?.primaryCtaType || 'modal') === 'modal'}
                            onChange={() => setSettings(prev => ({
                              ...prev,
                              hero: { ...prev.hero, primaryCtaType: 'modal' }
                            }))}
                            className="text-red-600"
                          />
                          <span className="text-slate-700 font-medium">Open Free Demo & Inquiry Popup Modal</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer text-xs">
                          <input
                            type="radio"
                            name="primaryCtaType"
                            value="link"
                            checked={settings.hero?.primaryCtaType === 'link'}
                            onChange={() => setSettings(prev => ({
                              ...prev,
                              hero: { ...prev.hero, primaryCtaType: 'link' }
                            }))}
                            className="text-red-600"
                          />
                          <span className="text-slate-700 font-medium">Redirect to Custom Web URL or Section</span>
                        </label>
                      </div>
                      {settings.hero?.primaryCtaType === 'link' && (
                        <input
                          type="text"
                          placeholder="e.g. #courses or https://..."
                          value={settings.hero?.primaryCtaLink || ''}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, primaryCtaLink: e.target.value }
                          }))}
                          className="mt-2 w-full px-3 py-1.5 border rounded-lg text-xs"
                        />
                      )}
                    </div>
                  </div>

                  {/* Secondary CTA */}
                  <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">Secondary Button (Glass / Outline)</span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-slate-600">
                        <input
                          type="checkbox"
                          checked={settings.hero?.showSecondaryCta !== false}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, showSecondaryCta: e.target.checked }
                          }))}
                          className="w-3.5 h-3.5 text-red-600 rounded"
                        />
                        <span>Show</span>
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={settings.hero?.secondaryCtaText || 'Explore Band Courses'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCtaText: e.target.value }
                        }))}
                        className="w-full px-3 py-2 border rounded-xl text-xs font-bold text-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Link (Anchor or URL)</label>
                      <input
                        type="text"
                        value={settings.hero?.secondaryCtaLink || '#courses'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, secondaryCtaLink: e.target.value }
                        }))}
                        placeholder="e.g. #courses"
                        className="w-full px-3 py-2 border rounded-xl text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4: Hero Right Visual Media Card Customizer */}
              <div className="p-5 sm:p-6 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/60">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-500" />
                      <span>Hero Right Visual Media Card & Student Achiever Badge</span>
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Fully customize the hero banner image, floating score badge, and bottom trust feature pills with real-time live preview.
                    </p>
                  </div>
                </div>

                {/* 4.0: REAL-TIME INTERACTIVE LIVE PREVIEW */}
                <div className="bg-slate-950 p-4 sm:p-6 rounded-2xl border border-slate-800 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-600/30 text-red-300 border border-red-500/30">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Live Card Preview (As Seen on Homepage)</span>
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">Updates in real-time as you edit below</span>
                  </div>

                  {/* Render the actual HeroVisualCard component */}
                  <div className="max-w-md mx-auto pt-2">
                    <HeroVisualCard hero={settings.hero} isPreview={true} />
                  </div>
                </div>

                {/* 4.1: BANNER IMAGE & STYLING */}
                <div className="space-y-4 bg-white p-5 border border-slate-200 rounded-xl shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-blue-600" />
                      <span>1. Hero Banner Image & Framing</span>
                    </span>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-bold text-slate-700">
                      Banner Image Source (Upload File from Device or Paste Image URL)
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                      <input
                        type="text"
                        placeholder="Paste Image URL (https://...)"
                        value={settings.hero?.bannerImage || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, bannerImage: e.target.value }
                        }))}
                        className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-mono text-slate-800"
                      />
                      <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm flex items-center gap-1.5">
                        <UploadCloud className="w-4 h-4" />
                        <span>{uploadingHero ? 'Uploading...' : 'Upload Device Image'}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleUploadImage(
                            e.target.files?.[0],
                            (url) => setSettings(prev => ({ ...prev, hero: { ...prev.hero, bannerImage: url } })),
                            setUploadingHero
                          )}
                          className="hidden"
                          disabled={uploadingHero}
                        />
                      </label>
                    </div>

                    {/* Quick Preset Images */}
                    <div>
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        ✨ Or Choose 1-Click High-Res Education Photo Preset:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          {
                            label: '📚 Library Study',
                            url: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1600&auto=format&fit=crop'
                          },
                          {
                            label: '🎓 Achievers Group',
                            url: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1600&auto=format&fit=crop'
                          },
                          {
                            label: '💻 CD-IELTS Lab',
                            url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=1600&auto=format&fit=crop'
                          },
                          {
                            label: '👨‍🏫 Masterclass Room',
                            url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=1600&auto=format&fit=crop'
                          }
                        ].map((preset, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setSettings(prev => ({
                              ...prev,
                              hero: { ...prev.hero, bannerImage: preset.url }
                            }))}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-all text-left truncate ${
                              settings.hero?.bannerImage === preset.url
                                ? 'bg-blue-900 text-white border-blue-900 shadow-sm'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border-slate-200'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Sizing, Height, Overlay & Border Style Controls */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Card Height / Aspect</label>
                        <select
                          value={settings.hero?.bannerHeight || 'standard'}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, bannerHeight: e.target.value }
                          }))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        >
                          {Object.entries(HERO_BANNER_HEIGHTS).map(([k, item]) => (
                            <option key={k} value={k}>{item.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Bottom Dark Overlay</label>
                        <select
                          value={settings.hero?.bannerOverlay || 'dark'}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, bannerOverlay: e.target.value }
                          }))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        >
                          {Object.entries(HERO_OVERLAY_STYLES).map(([k, item]) => (
                            <option key={k} value={k}>{item.label}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Frame Border Glow</label>
                        <select
                          value={settings.hero?.bannerBorder || 'glass'}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, bannerBorder: e.target.value }
                          }))}
                          className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                        >
                          {Object.entries(HERO_BANNER_BORDERS).map(([k, item]) => (
                            <option key={k} value={k}>{item.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Image Alt Text (SEO)</label>
                      <input
                        type="text"
                        placeholder="e.g. IELTS Coaching Institute Class & High Scorers"
                        value={settings.hero?.bannerAlt || ''}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, bannerAlt: e.target.value }
                        }))}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl"
                      />
                    </div>
                  </div>
                </div>

                {/* 4.2: FLOATING STUDENT ACHIEVER BADGE */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span>2. Floating Student Achiever Badge</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Overlay pill showing top band result, category, and sub-score breakdown
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={settings.hero?.showFloatingBadge !== false}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, showFloatingBadge: e.target.checked }
                        }))}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span>Show Badge</span>
                    </label>
                  </div>

                  {settings.hero?.showFloatingBadge !== false && (
                    <div className="space-y-4 pt-1">
                      {/* Position & Color Theme & Surface Style */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Position</label>
                          <select
                            value={settings.hero?.floatingBadge?.position || 'top-right'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, position: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                          >
                            {Object.entries(HERO_BADGE_POSITIONS).map(([k, item]) => (
                              <option key={k} value={k}>{item.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Score Box Theme</label>
                          <select
                            value={settings.hero?.floatingBadge?.theme || 'amber'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, theme: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                          >
                            {Object.entries(HERO_BADGE_THEMES).map(([k, item]) => (
                              <option key={k} value={k}>{item.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Surface Style</label>
                          <select
                            value={settings.hero?.floatingBadge?.style || 'glass-light'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, style: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="glass-light">Light Glass (White / Translucent)</option>
                            <option value="glass-dark">Dark Glass (Midnight / Translucent)</option>
                          </select>
                        </div>
                      </div>

                      {/* Score Number & Quick Preset Chips */}
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-[11px] font-bold text-slate-600">Band Score / Result Number</label>
                          <div className="flex items-center gap-1">
                            {['8.5', '9.0', '8.0', '7.5+', '100%'].map((chip) => (
                              <button
                                key={chip}
                                type="button"
                                onClick={() => setSettings(prev => ({
                                  ...prev,
                                  hero: {
                                    ...prev.hero,
                                    floatingBadge: { ...prev.hero?.floatingBadge, score: chip }
                                  }
                                }))}
                                className="px-1.5 py-0.5 text-[10px] font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition-colors"
                              >
                                {chip}
                              </button>
                            ))}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={settings.hero?.floatingBadge?.score || '8.5'}
                          onChange={(e) => setSettings(prev => ({
                            ...prev,
                            hero: {
                              ...prev.hero,
                              floatingBadge: { ...prev.hero?.floatingBadge, score: e.target.value }
                            }
                          }))}
                          className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 bg-white font-black text-amber-600"
                        />
                      </div>

                      {/* Tag, Title, Subtitle Scores & SubColor */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Tag / Category</label>
                          <input
                            type="text"
                            placeholder="e.g. TOP ACHIEVER"
                            value={settings.hero?.floatingBadge?.label || 'Top Achiever'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, label: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Title</label>
                          <input
                            type="text"
                            placeholder="e.g. Overall IELTS Band"
                            value={settings.hero?.floatingBadge?.title || 'Overall IELTS Band'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, title: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Sectional Breakdown</label>
                          <input
                            type="text"
                            placeholder="e.g. L: 9.0 • R: 9.0 • S: 8.5"
                            value={settings.hero?.floatingBadge?.sub || 'L: 9.0 • R: 9.0 • S: 8.5'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, sub: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-600 mb-1">Sectional Text Color</label>
                          <select
                            value={settings.hero?.floatingBadge?.subColor || 'emerald'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                floatingBadge: { ...prev.hero?.floatingBadge, subColor: e.target.value }
                              }
                            }))}
                            className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl font-medium"
                          >
                            <option value="emerald">Emerald Green (Recommended)</option>
                            <option value="amber">Amber / Gold</option>
                            <option value="blue">Sky Blue</option>
                            <option value="rose">Rose Red</option>
                            <option value="slate">Subtle Grey</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* 4.3: BOTTOM TRUST FEATURE PILLS */}
                <div className="bg-white p-5 border border-slate-200 rounded-xl space-y-4 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>3. Bottom Trust Feature Pills (Inside Hero Image)</span>
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Horizontal pill bar across the bottom of the hero banner image
                      </span>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={settings.hero?.showBottomPills !== false}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, showBottomPills: e.target.checked }
                        }))}
                        className="w-4 h-4 text-red-600 rounded"
                      />
                      <span>Show Pills Bar</span>
                    </label>
                  </div>

                  {settings.hero?.showBottomPills !== false && (
                    <div className="space-y-4 pt-1">
                      {/* Bar Style & 1-Click Reset Toolbar */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                        <div className="flex-1">
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Pills Bar Background Style
                          </label>
                          <select
                            value={settings.hero?.pillsStyle || 'dark-glass'}
                            onChange={(e) => setSettings(prev => ({
                              ...prev,
                              hero: { ...prev.hero, pillsStyle: e.target.value }
                            }))}
                            className="w-full sm:w-auto px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                          >
                            {Object.entries(HERO_PILLS_STYLES).map(([k, item]) => (
                              <option key={k} value={k}>{item.label}</option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSettings(prev => ({
                              ...prev,
                              hero: {
                                ...prev.hero,
                                bottomPills: [
                                  { icon: 'Award', text: 'IDP & British Council', iconColor: 'yellow', highlight: true },
                                  { icon: 'Headphones', text: 'Real Headset Lab', iconColor: 'rose', highlight: false },
                                  { icon: 'Shield', text: '100% Guaranteed', iconColor: 'emerald', highlight: false }
                                ]
                              }
                            }));
                          }}
                          className="px-3 py-1.5 text-xs font-bold text-slate-700 hover:text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                          title="Restore original 3 feature pills"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Reset to 3 Classic Pills</span>
                        </button>
                      </div>

                      {/* Pill Cards Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {(settings.hero?.bottomPills || [
                          { icon: 'Award', text: 'IDP & British Council', iconColor: 'yellow', highlight: true },
                          { icon: 'Headphones', text: 'Real Headset Lab', iconColor: 'rose', highlight: false },
                          { icon: 'Shield', text: '100% Guaranteed', iconColor: 'emerald', highlight: false }
                        ]).map((pill, idx) => (
                          <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5 relative group hover:border-slate-300 transition-colors">
                            <div className="flex items-center justify-between pb-1.5 border-b border-slate-200/60">
                              <span className="text-[11px] font-black text-slate-700 uppercase tracking-wider flex items-center gap-1">
                                <span>Pill #{idx + 1}</span>
                                {pill.highlight && (
                                  <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 text-[9px] font-bold">Bold</span>
                                )}
                              </span>

                              <div className="flex items-center gap-1">
                                {/* Move Left / Up */}
                                {idx > 0 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const pills = [...(settings.hero?.bottomPills || [])];
                                      const temp = pills[idx - 1];
                                      pills[idx - 1] = pills[idx];
                                      pills[idx] = temp;
                                      setSettings(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, bottomPills: pills }
                                      }));
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"
                                    title="Move Left"
                                  >
                                    <ArrowUp className="w-3.5 h-3.5 rotate-[-90deg]" />
                                  </button>
                                )}

                                {/* Move Right / Down */}
                                {idx < (settings.hero?.bottomPills || []).length - 1 && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const pills = [...(settings.hero?.bottomPills || [])];
                                      const temp = pills[idx + 1];
                                      pills[idx + 1] = pills[idx];
                                      pills[idx] = temp;
                                      setSettings(prev => ({
                                        ...prev,
                                        hero: { ...prev.hero, bottomPills: pills }
                                      }));
                                    }}
                                    className="p-1 text-slate-400 hover:text-slate-800 rounded hover:bg-slate-200 transition-colors"
                                    title="Move Right"
                                  >
                                    <ArrowDown className="w-3.5 h-3.5 rotate-[-90deg]" />
                                  </button>
                                )}

                                <button
                                  type="button"
                                  onClick={() => {
                                    const updated = (settings.hero?.bottomPills || []).filter((_, i) => i !== idx);
                                    setSettings(prev => ({
                                      ...prev,
                                      hero: { ...prev.hero, bottomPills: updated }
                                    }));
                                  }}
                                  className="text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50 transition-colors"
                                  title="Delete this pill"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Icon & Color Row */}
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Icon</label>
                                <select
                                  value={pill.icon || 'Award'}
                                  onChange={(e) => {
                                    const updated = [...(settings.hero?.bottomPills || [])];
                                    updated[idx] = { ...updated[idx], icon: e.target.value };
                                    setSettings(prev => ({
                                      ...prev,
                                      hero: { ...prev.hero, bottomPills: updated }
                                    }));
                                  }}
                                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                                >
                                  {Object.entries(HERO_PILL_ICONS).map(([k, item]) => (
                                    <option key={k} value={k}>{item.label}</option>
                                  ))}
                                </select>
                              </div>

                              <div>
                                <label className="block text-[10px] font-bold text-slate-600 mb-1">Icon Color</label>
                                <select
                                  value={pill.iconColor || (idx === 0 ? 'yellow' : idx === 1 ? 'rose' : 'emerald')}
                                  onChange={(e) => {
                                    const updated = [...(settings.hero?.bottomPills || [])];
                                    updated[idx] = { ...updated[idx], iconColor: e.target.value };
                                    setSettings(prev => ({
                                      ...prev,
                                      hero: { ...prev.hero, bottomPills: updated }
                                    }));
                                  }}
                                  className="w-full px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-medium"
                                >
                                  {Object.entries(HERO_ICON_COLORS).map(([k, item]) => (
                                    <option key={k} value={k}>{item.label}</option>
                                  ))}
                                </select>
                              </div>
                            </div>

                            {/* Pill Text Input */}
                            <div>
                              <label className="block text-[10px] font-bold text-slate-600 mb-1">
                                Pill Text (e.g. IDP & British Council)
                              </label>
                              <input
                                type="text"
                                placeholder={idx === 0 ? 'IDP & British Council' : idx === 1 ? 'Real Headset Lab' : '100% Guaranteed'}
                                value={pill.text}
                                onChange={(e) => {
                                  const updated = [...(settings.hero?.bottomPills || [])];
                                  updated[idx] = { ...updated[idx], text: e.target.value };
                                  setSettings(prev => ({
                                    ...prev,
                                    hero: { ...prev.hero, bottomPills: updated }
                                  }));
                                }}
                                className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg font-bold text-slate-800"
                              />
                            </div>

                            {/* Highlight toggle */}
                            <label className="flex items-center gap-2 cursor-pointer pt-1">
                              <input
                                type="checkbox"
                                checked={pill.highlight ?? (idx === 0)}
                                onChange={(e) => {
                                  const updated = [...(settings.hero?.bottomPills || [])];
                                  updated[idx] = { ...updated[idx], highlight: e.target.checked };
                                  setSettings(prev => ({
                                    ...prev,
                                    hero: { ...prev.hero, bottomPills: updated }
                                  }));
                                }}
                                className="w-3.5 h-3.5 text-red-600 rounded"
                              />
                              <span className="text-[11px] font-semibold text-slate-700">Make Text Bold / Highlighted</span>
                            </label>
                          </div>
                        ))}
                      </div>

                      {/* Add New Pill Button */}
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [
                            ...(settings.hero?.bottomPills || []),
                            { icon: 'CheckCircle2', text: 'Verified Facility', iconColor: 'sky', highlight: false }
                          ];
                          setSettings(prev => ({
                            ...prev,
                            hero: { ...prev.hero, bottomPills: updated }
                          }));
                        }}
                        className="px-4 py-2.5 text-xs font-bold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add New Feature Pill</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Card 5: Instant Phone Callback Form Box */}
              <div className="p-5 bg-slate-50/70 border border-slate-200/80 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black uppercase tracking-wider text-slate-700 block">Instant Phone Callback Request Box</span>
                    <span className="text-[11px] text-slate-500">Quick lead capture bar inside hero</span>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={settings.hero?.showCallbackBox !== false}
                      onChange={(e) => setSettings(prev => ({
                        ...prev,
                        hero: { ...prev.hero, showCallbackBox: e.target.checked }
                      }))}
                      className="w-4 h-4 text-red-600 rounded"
                    />
                    <span>Show Callback Form</span>
                  </label>
                </div>

                {settings.hero?.showCallbackBox !== false && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Input Placeholder</label>
                      <input
                        type="text"
                        value={settings.hero?.callbackBox?.placeholder || 'Enter Mobile No for Instant Call'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            callbackBox: { ...prev.hero?.callbackBox, placeholder: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Button Text</label>
                      <input
                        type="text"
                        value={settings.hero?.callbackBox?.buttonText || 'Request Call'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            callbackBox: { ...prev.hero?.callbackBox, buttonText: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Success Message</label>
                      <input
                        type="text"
                        value={settings.hero?.callbackBox?.successText || 'Thank you! Our senior counselor will call you within 15 minutes.'}
                        onChange={(e) => setSettings(prev => ({
                          ...prev,
                          hero: {
                            ...prev.hero,
                            callbackBox: { ...prev.hero?.callbackBox, successText: e.target.value }
                          }
                        }))}
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white text-emerald-700"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Sub-tab 2: Stats Counter Bar */}
          {heroSubTab === 'stats' && (
            <div className="space-y-5">
              <div className="p-4 bg-purple-50/60 border border-purple-200 rounded-xl flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-purple-950">Homepage Stats Counter Bar (4 Metric Cards)</h3>
                  <p className="text-[11px] text-purple-800/80">These white cards display directly below the Hero Section banner on the homepage.</p>
                </div>
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-purple-950">
                  <input
                    type="checkbox"
                    checked={settings.showStats !== false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      showStats: e.target.checked
                    }))}
                    className="w-4 h-4 text-purple-600 rounded"
                  />
                  <span>Show Stats Bar</span>
                </label>
              </div>

              {settings.showStats !== false && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(settings.stats || []).map((stat, idx) => (
                      <div key={stat.id || idx} className="p-4 bg-white border border-slate-200/80 rounded-2xl shadow-sm space-y-3 relative group">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Stat Card #{idx + 1}</span>
                          {(settings.stats || []).length > 1 && (
                            <button
                              type="button"
                              onClick={() => {
                                const updated = settings.stats.filter((_, i) => i !== idx);
                                setSettings({ ...settings, stats: updated });
                              }}
                              className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                              title="Delete this Stat Card"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Metric Value (e.g. 98.4%, 12,500+)
                          </label>
                          <input
                            type="text"
                            value={stat.value}
                            onChange={(e) => {
                              const updated = [...settings.stats];
                              updated[idx] = { ...updated[idx], value: e.target.value };
                              setSettings({ ...settings, stats: updated });
                            }}
                            className="w-full px-3.5 py-2 border rounded-xl text-sm font-black text-red-600 bg-slate-50 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Metric Title / Label (e.g. Success Rate)
                          </label>
                          <input
                            type="text"
                            value={stat.label}
                            onChange={(e) => {
                              const updated = [...settings.stats];
                              updated[idx] = { ...updated[idx], label: e.target.value };
                              setSettings({ ...settings, stats: updated });
                            }}
                            className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold text-slate-800 bg-slate-50 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 mb-1">
                            Subtext Description (e.g. 7+ Bands in first attempt)
                          </label>
                          <input
                            type="text"
                            value={stat.subtext || ''}
                            onChange={(e) => {
                              const updated = [...settings.stats];
                              updated[idx] = { ...updated[idx], subtext: e.target.value };
                              setSettings({ ...settings, stats: updated });
                            }}
                            className="w-full px-3.5 py-2 border rounded-xl text-xs text-slate-600 bg-slate-50 focus:bg-white"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const newId = `stat-${Date.now()}`;
                      const updated = [...(settings.stats || []), { id: newId, value: '100%', label: 'Metric Title', subtext: 'Supporting details' }];
                      setSettings({ ...settings, stats: updated });
                    }}
                    className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Stat Counter Card</span>
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* TAB 4: FOOTER & BIO */}
      {activeTab === 'footer' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <LayoutTemplate className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">Footer Content & Contact Details</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Footer Institute Bio</label>
              <textarea
                rows={3}
                value={settings.footer?.bio || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  footer: { ...prev.footer, bio: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Accreditation Badge Text</label>
                <input
                  type="text"
                  value={settings.footer?.accreditation || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    footer: { ...prev.footer, accreditation: e.target.value }
                  }))}
                  placeholder="Certified IELTS & PTE Test Venue"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Partner Badge</label>
                <input
                  type="text"
                  value={settings.footer?.partnerText || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    footer: { ...prev.footer, partnerText: e.target.value }
                  }))}
                  placeholder="Official Training Partner IDP & Cambridge"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Phone</label>
                <input
                  type="text"
                  value={settings.footer?.phone || settings.phone || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    phone: e.target.value,
                    footer: { ...prev.footer, phone: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Email</label>
                <input
                  type="email"
                  value={settings.footer?.email || settings.email || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    email: e.target.value,
                    footer: { ...prev.footer, email: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Campus Address</label>
                <input
                  type="text"
                  value={settings.footer?.address || settings.address || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    address: e.target.value,
                    footer: { ...prev.footer, address: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Working Hours</label>
                <input
                  type="text"
                  value={settings.footer?.hours || settings.workingHours || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    workingHours: e.target.value,
                    footer: { ...prev.footer, hours: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>
            </div>

            {/* Footer Programs Column */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Footer Programs List (Column 3)</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Duolingo English Test (DET)"
                  value={newProgram}
                  onChange={(e) => setNewProgram(e.target.value)}
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddProgram}
                  className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold shrink-0"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {settings.footer?.programs?.map((p, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1 rounded-xl text-xs text-slate-800">
                    <span>{p}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteProgram(idx)}
                      className="text-slate-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Quick Links Manager (Column 2: Explore) - Fully Independent */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200/80">
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-blue-700" />
                    <span>Footer Quick Links (Column 2: Explore)</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Manage links displayed in the footer Explore column. Operates independently from top header navigation.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleCopyNavToFooter}
                  className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl text-xs font-bold shrink-0 flex items-center gap-1.5 shadow-sm"
                  title="Copy all links from header navigation to footer"
                >
                  <RefreshCw className="w-3 h-3 text-slate-500" />
                  <span>Copy from Header Menu</span>
                </button>
              </div>

              {/* Column 2 Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Column 2 Heading</label>
                <input
                  type="text"
                  value={settings.footer?.col2Title || 'Explore'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    footer: { ...prev.footer, col2Title: e.target.value }
                  }))}
                  placeholder="Explore"
                  className="w-full sm:w-64 px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold bg-white"
                />
              </div>

              {/* Add New Footer Link Form */}
              <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-600 block">Add New Footer Link</span>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Link Label (e.g. Band 8+ Courses)"
                    value={newFooterLabel}
                    onChange={(e) => setNewFooterLabel(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Target URL / Anchor (e.g. #courses)"
                    value={newFooterHref}
                    onChange={(e) => setNewFooterHref(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddFooterLink}
                    className="px-4 py-2 bg-blue-900 hover:bg-blue-800 text-white rounded-xl text-xs font-bold shrink-0 flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>
              </div>

              {/* Existing Footer Links List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Current Footer Links ({settings.footer?.links?.length || 0})
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white">
                  {(settings.footer?.links || []).map((link, idx) => (
                    <div key={link.id || idx} className="p-2.5 sm:p-3 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-500 font-bold text-[10px] flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          value={link.label}
                          onChange={(e) => {
                            const updated = [...(settings.footer.links || [])];
                            updated[idx].label = e.target.value;
                            setSettings(prev => ({
                              ...prev,
                              footer: { ...prev.footer, links: updated }
                            }));
                          }}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 w-32 sm:w-44"
                        />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => {
                            const updated = [...(settings.footer.links || [])];
                            updated[idx].href = e.target.value;
                            setSettings(prev => ({
                              ...prev,
                              footer: { ...prev.footer, links: updated }
                            }));
                          }}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-xs text-slate-600 font-mono flex-1 min-w-0"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteFooterLink(link.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                        title="Delete Footer Link"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {(!settings.footer?.links || settings.footer.links.length === 0) && (
                    <div className="p-4 text-center text-xs text-slate-400">
                      No footer links configured. Click "Copy from Header Menu" to import your navigation links.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: SECTION HEADINGS & BADGES */}
      {activeTab === 'sections' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Website Section Headers & Visibility</h2>
              <p className="text-xs text-slate-500">Show, hide, or customize titles, badges, subtitles, and button labels for every section on the homepage.</p>
            </div>
          </div>

          {/* Master Section Visibility Controller */}
          <div className="p-5 bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-2xl text-white space-y-4 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div>
                <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-red-400" />
                  <span>Homepage Section Display & Visibility Toggles</span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  Turn entire sections ON or OFF on the public homepage with 1-click. Hiding a section keeps all data intact without deleting navigation or footer links.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: 'courses', label: '1. Band 8+ Courses', anchor: '#courses', icon: BookOpen, isVisible: settings.sections?.courses?.show !== false },
                { key: 'results', label: '2. 8+ Band Results', anchor: '#results', icon: Trophy, isVisible: settings.sections?.results?.show !== false },
                { key: 'batches', label: '3. Upcoming Batches', anchor: '#batches', icon: Calendar, isVisible: settings.sections?.batches?.show !== false },
                { key: 'testimonials', label: '4. Student Reviews', anchor: '#testimonials', icon: Sparkles, isVisible: settings.sections?.testimonials?.show !== false },
                { key: 'gallery', label: '5. Campus Gallery', anchor: '#gallery', icon: ImageIcon, isVisible: settings.sections?.gallery?.show !== false },
                { key: 'faqs', label: '6. Frequently Asked Questions', anchor: '#faqs', icon: HelpCircle, isVisible: settings.sections?.faqs?.show !== false },
                { key: 'universities', label: '7. University Tie-ups', anchor: '#universities', icon: Globe, isVisible: settings.sections?.universities?.show !== false },
                { key: 'whyUs', label: '8. Why Choose Us', anchor: '#why-us', icon: ShieldCheck, isVisible: (settings.whyUs?.show !== false && settings.sections?.whyUs?.show !== false) },
                { key: 'stats', label: '9. Stats Counters Bar', anchor: 'Floating Counters', icon: Sliders, isVisible: settings.showStats !== false },
                { key: 'hero', label: '10. Hero Banner Section', anchor: 'Top Header Area', icon: Sparkles, isVisible: settings.hero?.show !== false },
              ].map(sec => {
                const Icon = sec.icon;
                return (
                  <div
                    key={sec.key}
                    className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-2.5 ${
                      sec.isVisible
                        ? 'bg-white/10 border-white/20 hover:border-emerald-400/50'
                        : 'bg-black/30 border-white/5 opacity-70 hover:opacity-90'
                    }`}
                  >
                    <div className="min-w-0 flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        sec.isVisible ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-white truncate">{sec.label}</span>
                        <span className="block text-[10px] text-slate-400 font-mono truncate">{sec.anchor}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleSectionVisibility(sec.key)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 transition-all flex items-center gap-1 ${
                        sec.isVisible
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      }`}
                      title={sec.isVisible ? 'Click to hide this section from homepage' : 'Click to display this section on homepage'}
                    >
                      {sec.isVisible ? (
                        <>
                          <Eye className="w-3 h-3" />
                          <span>Visible</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" />
                          <span>Hidden</span>
                        </>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 1. Courses Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <BookOpen className="w-4 h-4 text-red-600" />
                <span>1. Band 8+ Courses Section</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  settings.sections?.courses?.show !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.sections?.courses?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility('courses')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    settings.sections?.courses?.show !== false
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {settings.sections?.courses?.show !== false ? 'Hide Section' : 'Show Section'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.courses?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      courses: { ...prev.sections?.courses, badge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={settings.sections?.courses?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      courses: { ...prev.sections?.courses, title: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.sections?.courses?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      courses: { ...prev.sections?.courses, subtitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Course Card Button Text</label>
                <input
                  type="text"
                  value={settings.sections?.courses?.ctaText || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      courses: { ...prev.sections?.courses, ctaText: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-red-600"
                />
              </div>
            </div>
          </div>

          {/* 2. Results Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Trophy className="w-4 h-4 text-amber-600" />
                <span>2. 8+ Band Results (Hall of Fame) Section</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  settings.sections?.results?.show !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.sections?.results?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility('results')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    settings.sections?.results?.show !== false
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {settings.sections?.results?.show !== false ? 'Hide Section' : 'Show Section'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.results?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      results: { ...prev.sections?.results, badge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={settings.sections?.results?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      results: { ...prev.sections?.results, title: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.sections?.results?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      results: { ...prev.sections?.results, subtitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 3. Batches Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <span>3. Upcoming Batches Section</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  settings.sections?.batches?.show !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.sections?.batches?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility('batches')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    settings.sections?.batches?.show !== false
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {settings.sections?.batches?.show !== false ? 'Hide Section' : 'Show Section'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.batches?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      batches: { ...prev.sections?.batches, badge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={settings.sections?.batches?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      batches: { ...prev.sections?.batches, title: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.sections?.batches?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      batches: { ...prev.sections?.batches, subtitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Batch Button Text</label>
                <input
                  type="text"
                  value={settings.sections?.batches?.ctaText || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      batches: { ...prev.sections?.batches, ctaText: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
            </div>
          </div>

          {/* 4. Testimonials Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Sparkles className="w-4 h-4 text-yellow-500" />
                <span>4. Student Testimonials & Reviews Section</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  settings.sections?.testimonials?.show !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.sections?.testimonials?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility('testimonials')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    settings.sections?.testimonials?.show !== false
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {settings.sections?.testimonials?.show !== false ? 'Hide Section' : 'Show Section'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.testimonials?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      testimonials: { ...prev.sections?.testimonials, badge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={settings.sections?.testimonials?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      testimonials: { ...prev.sections?.testimonials, title: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.sections?.testimonials?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      testimonials: { ...prev.sections?.testimonials, subtitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 5. Campus Photo Gallery */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <ImageIcon className="w-4 h-4 text-purple-600" />
                <span>5. Campus & Events Gallery Section</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  settings.sections?.gallery?.show !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.sections?.gallery?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility('gallery')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    settings.sections?.gallery?.show !== false
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {settings.sections?.gallery?.show !== false ? 'Hide Section' : 'Show Section'}
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.gallery?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      gallery: { ...prev.sections?.gallery, badge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={settings.sections?.gallery?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      gallery: { ...prev.sections?.gallery, title: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.sections?.gallery?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      gallery: { ...prev.sections?.gallery, subtitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

          {/* 6. FAQs Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <HelpCircle className="w-4 h-4 text-blue-600" />
                <span>6. Frequently Asked Questions (FAQ) Section</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    settings.sections?.faqs?.show !== false
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {settings.sections?.faqs?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSectionVisibility('faqs')}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                      settings.sections?.faqs?.show !== false
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                    }`}
                  >
                    {settings.sections?.faqs?.show !== false ? 'Hide Section' : 'Show Section'}
                  </button>
                </div>
                <Link
                  href="/admin/faqs"
                  className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Open Dedicated FAQ Customizer &rarr;</span>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.faqs?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      faqs: { ...prev.sections?.faqs, badge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Title</label>
                <input
                  type="text"
                  value={settings.sections?.faqs?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      faqs: { ...prev.sections?.faqs, title: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Subtitle</label>
                <textarea
                  rows={2}
                  value={settings.sections?.faqs?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      faqs: { ...prev.sections?.faqs, subtitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sections?.faqs?.showSearch !== false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        faqs: { ...prev.sections?.faqs, showSearch: e.target.checked }
                      }
                    }))}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-600 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Show Search Bar</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sections?.faqs?.showCategories !== false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        faqs: { ...prev.sections?.faqs, showCategories: e.target.checked }
                      }
                    }))}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-600 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Category Filter Pills</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-white cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.sections?.faqs?.showSupportCard !== false}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      sections: {
                        ...prev.sections,
                        faqs: { ...prev.sections?.faqs, showSupportCard: e.target.checked }
                      }
                    }))}
                    className="rounded border-slate-300 text-red-600 focus:ring-red-600 w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-slate-700">Helpdesk Support Card</span>
                </label>
              </div>
            </div>
          </div>

          {/* 7. Universities Section Extra Customizer */}
          {/* 7. UNIVERSITY TIE-UPS */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200/80">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Globe className="w-4 h-4 text-red-600" />
                <span>7. University Tie-ups, Key Stats & Callout Banner</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="/admin/universities"
                  className="px-3 py-1 bg-white hover:bg-slate-100 text-blue-900 border border-slate-200 rounded-xl text-xs font-bold transition-all"
                >
                  Manage Universities →
                </a>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  settings.sections?.universities?.show !== false
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-200 text-slate-700'
                }`}>
                  {settings.sections?.universities?.show !== false ? '● Visible on Page' : '○ Hidden from Page'}
                </span>
                <button
                  type="button"
                  onClick={() => toggleSectionVisibility('universities')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                    settings.sections?.universities?.show !== false
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                  }`}
                >
                  {settings.sections?.universities?.show !== false ? 'Hide Section' : 'Show Section'}
                </button>
              </div>
            </div>

            {/* Top Headline & Badge */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Section Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.universities?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, badge: e.target.value }
                    }
                  }))}
                  placeholder="e.g. OFFICIAL GLOBAL STUDY ABROAD NETWORK"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={settings.sections?.universities?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, title: e.target.value }
                    }
                  }))}
                  placeholder="e.g. Direct University Tie-Ups & Global College Network"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Sub-description Paragraph</label>
                <textarea
                  rows={2}
                  value={settings.sections?.universities?.subtitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, subtitle: e.target.value }
                    }
                  }))}
                  placeholder="e.g. First Class Global Education LLP directly represents 100+ world-renowned universities..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>

            {/* Key Statistic Cards */}
            <div className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-2">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wide">
                4 Key Statistic Metric Cards (Shown directly below heading)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {(settings.sections?.universities?.stats || [
                  { label: "Direct University Tie-Ups", value: "850+" },
                  { label: "Top Destination Countries", value: "25+" },
                  { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
                  { label: "Scholarships Facilitated", value: "₹12+ Crores" }
                ]).map((st, idx) => (
                  <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-400">Card #{idx + 1}</span>
                    <input
                      type="text"
                      value={st.value}
                      onChange={(e) => {
                        const newStats = [...(settings.sections?.universities?.stats || [
                          { label: "Direct University Tie-Ups", value: "850+" },
                          { label: "Top Destination Countries", value: "25+" },
                          { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
                          { label: "Scholarships Facilitated", value: "₹12+ Crores" }
                        ])];
                        newStats[idx] = { ...newStats[idx], value: e.target.value };
                        setSettings(prev => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            universities: { ...prev.sections?.universities, stats: newStats }
                          }
                        }));
                      }}
                      placeholder="e.g. 850+"
                      className="w-full px-2 py-1 text-xs font-black rounded border border-slate-200 bg-white text-blue-950"
                    />
                    <input
                      type="text"
                      value={st.label}
                      onChange={(e) => {
                        const newStats = [...(settings.sections?.universities?.stats || [
                          { label: "Direct University Tie-Ups", value: "850+" },
                          { label: "Top Destination Countries", value: "25+" },
                          { label: "Offer Letter Turnaround", value: "48 - 72 Hrs" },
                          { label: "Scholarships Facilitated", value: "₹12+ Crores" }
                        ])];
                        newStats[idx] = { ...newStats[idx], label: e.target.value };
                        setSettings(prev => ({
                          ...prev,
                          sections: {
                            ...prev.sections,
                            universities: { ...prev.sections?.universities, stats: newStats }
                          }
                        }));
                      }}
                      placeholder="e.g. DIRECT UNIVERSITY TIE-UPS"
                      className="w-full px-2 py-1 text-[11px] font-bold rounded border border-slate-200 bg-white text-slate-600"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Marquee & Callout Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200/80">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Marquee Ticker Title</label>
                <input
                  type="text"
                  value={settings.sections?.universities?.marqueeTitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, marqueeTitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banner Pill Badge</label>
                <input
                  type="text"
                  value={settings.sections?.universities?.bannerBadge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, bannerBadge: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banner Action Button Text</label>
                <input
                  type="text"
                  value={settings.sections?.universities?.bannerCta || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, bannerCta: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold text-red-600"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banner Title</label>
                <input
                  type="text"
                  value={settings.sections?.universities?.bannerTitle || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, bannerTitle: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-bold"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banner Description</label>
                <textarea
                  rows={2}
                  value={settings.sections?.universities?.bannerDesc || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    sections: {
                      ...prev.sections,
                      universities: { ...prev.sections?.universities, bannerDesc: e.target.value }
                    }
                  }))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white"
                />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB: INQUIRY MODAL / LEAD POPUP */}
      {activeTab === 'modal' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <FileText className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Inquiry & Demo Booking Popup Modal</h2>
              <p className="text-xs text-slate-500">Customize the lead capture popup text, badges, button, and post-submission thank you message.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Top Pill Badge</label>
                <input
                  type="text"
                  value={settings.modal?.badge || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    modal: { ...prev.modal, badge: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Modal Heading</label>
                <input
                  type="text"
                  value={settings.modal?.title || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    modal: { ...prev.modal, title: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Modal Subtitle</label>
              <textarea
                rows={2}
                value={settings.modal?.subtitle || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  modal: { ...prev.modal, subtitle: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Submit Button Text</label>
                <input
                  type="text"
                  value={settings.modal?.buttonText || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    modal: { ...prev.modal, buttonText: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-red-600"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Confidentiality / Footer Note</label>
                <input
                  type="text"
                  value={settings.modal?.footerNote || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    modal: { ...prev.modal, footerNote: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-500"
                />
              </div>
            </div>

            {/* Post submission success view */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 space-y-3 mt-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                Post-Submission Success Screen
              </h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">Success Title</label>
                  <input
                    type="text"
                    value={settings.modal?.successTitle || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      modal: { ...prev.modal, successTitle: e.target.value }
                    }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-emerald-900 mb-1">Success Message Description</label>
                  <textarea
                    rows={2}
                    value={settings.modal?.successMessage || ''}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      modal: { ...prev.modal, successMessage: e.target.value }
                    }))}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-emerald-300 bg-white"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB: WHATSAPP CONFIG */}
      {activeTab === 'whatsapp' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">WhatsApp Floating Widget & Settings</h2>
                <p className="text-xs text-slate-500">Configure the bottom-right floating chat button and instant message templates.</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                checked={settings.whatsappConfig?.enabled ?? true}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  whatsappConfig: { ...prev.whatsappConfig, enabled: e.target.checked }
                }))}
                className="w-4 h-4 text-emerald-600 rounded"
              />
              <span className="text-xs font-bold text-slate-800">Enable Floating Widget</span>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp Number (with Country Code, e.g. 919876543210)
                </label>
                <input
                  type="text"
                  value={settings.whatsappConfig?.number || settings.whatsapp || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    whatsapp: e.target.value,
                    whatsappConfig: { ...prev.whatsappConfig, number: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  value={settings.whatsappConfig?.buttonText || 'Chat on WhatsApp'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    whatsappConfig: { ...prev.whatsappConfig, buttonText: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Pre-filled Chat Message (Sent when student clicks WhatsApp)
              </label>
              <textarea
                rows={3}
                value={settings.whatsappConfig?.prefilledMessage || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  whatsappConfig: { ...prev.whatsappConfig, prefilledMessage: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: SOCIAL MEDIA */}
      {activeTab === 'social' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Share2 className="w-5 h-5 text-blue-900" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Social Media Profiles</h2>
              <p className="text-xs text-slate-500">Provide direct links to your official academy social media channels.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Instagram URL</label>
              <input
                type="url"
                placeholder="https://instagram.com/your-page"
                value={settings.social?.instagram || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, instagram: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Facebook URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/your-page"
                value={settings.social?.facebook || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, facebook: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">YouTube Channel URL</label>
              <input
                type="url"
                placeholder="https://youtube.com/@your-channel"
                value={settings.social?.youtube || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, youtube: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">LinkedIn Page URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/company/your-company"
                value={settings.social?.linkedin || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, linkedin: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Telegram Community (Optional)</label>
              <input
                type="url"
                placeholder="https://t.me/your-channel"
                value={settings.social?.telegram || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  social: { ...prev.social, telegram: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB: SEO & META TAGS */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Search className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Search Engine Optimization (SEO)</h2>
              <p className="text-xs text-slate-500">Configure page titles, meta descriptions, and search rankings in Google.</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Homepage Browser Title (Meta Title)
              </label>
              <input
                type="text"
                value={settings.seo?.metaTitle || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  seo: { ...prev.seo, metaTitle: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meta Description (Summary shown in Google search results)
              </label>
              <textarea
                rows={3}
                value={settings.seo?.metaDescription || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  seo: { ...prev.seo, metaDescription: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                SEO Keywords (Comma separated)
              </label>
              <input
                type="text"
                value={settings.seo?.keywords || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  seo: { ...prev.seo, keywords: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-600"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: NOTICE BAR */}
      {activeTab === 'announcement' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900">Top Notice / Announcement Bar</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAnnouncement ?? true}
                onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-700">Display On Website</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notice Ticker Message
            </label>
            <input
              type="text"
              value={settings.announcement || ''}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              placeholder="e.g. New Fast Track Batch Starting Monday! Reserve seat now."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
            />
          </div>
        </div>
      )}

      {/* TAB 6: WHY CHOOSE US */}
      {activeTab === 'whyUs' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <h2 className="text-base font-bold text-slate-900">Why Choose Us Section</h2>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                (settings.whyUs?.show !== false && settings.sections?.whyUs?.show !== false)
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-200 text-slate-700'
              }`}>
                {(settings.whyUs?.show !== false && settings.sections?.whyUs?.show !== false) ? '● Visible on Page' : '○ Hidden from Page'}
              </span>
              <button
                type="button"
                onClick={() => toggleSectionVisibility('whyUs')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                  (settings.whyUs?.show !== false && settings.sections?.whyUs?.show !== false)
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                }`}
              >
                {(settings.whyUs?.show !== false && settings.sections?.whyUs?.show !== false) ? 'Hide Section' : 'Show Section'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Badge</label>
              <input
                type="text"
                value={settings.whyUs?.badge || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  whyUs: { ...prev.whyUs, badge: e.target.value }
                }))}
                className="w-full px-3.5 py-2 rounded-xl border text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Headline</label>
              <input
                type="text"
                value={settings.whyUs?.title || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  whyUs: { ...prev.whyUs, title: e.target.value }
                }))}
                className="w-full px-3.5 py-2 rounded-xl border text-xs font-bold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle</label>
              <input
                type="text"
                value={settings.whyUs?.subtitle || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  whyUs: { ...prev.whyUs, subtitle: e.target.value }
                }))}
                className="w-full px-3.5 py-2 rounded-xl border text-xs"
              />
            </div>
          </div>

          {/* Add Feature Form */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Add New Pillar / Feature Card</h3>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Feature Title (e.g. 1-on-1 Speaking Cabins)"
                value={newFeatureTitle}
                onChange={(e) => setNewFeatureTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <textarea
                rows={2}
                placeholder="Feature Description"
                value={newFeatureDesc}
                onChange={(e) => setNewFeatureDesc(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-2 bg-blue-900 text-white rounded-xl text-xs font-bold"
              >
                + Add Feature
              </button>
            </div>
          </div>

          {/* Features List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {settings.whyUs?.items?.map((item) => (
              <div key={item.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-1">{item.description}</p>
                </div>
                <div className="pt-2 text-right">
                  <button
                    type="button"
                    onClick={() => handleDeleteFeature(item.id)}
                    className="text-red-500 hover:text-red-700 text-xs font-bold"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: STATS COUNTERS */}
      {activeTab === 'stats' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-purple-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Homepage Stats Counter Cards</h2>
                <p className="text-xs text-slate-500">Metric cards that appear directly below the hero banner.</p>
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-purple-950">
              <input
                type="checkbox"
                checked={settings.showStats !== false}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  showStats: e.target.checked
                }))}
                className="w-4 h-4 text-purple-600 rounded"
              />
              <span>Show Stats Bar on Homepage</span>
            </label>
          </div>

          {settings.showStats !== false && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(settings.stats || []).map((stat, idx) => (
                  <div key={stat.id || idx} className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl space-y-3 relative group">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                      <span className="text-xs font-black uppercase text-slate-400">Card #{idx + 1}</span>
                      {(settings.stats || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = settings.stats.filter((_, i) => i !== idx);
                            setSettings({ ...settings, stats: updated });
                          }}
                          className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                          title="Delete this Stat Card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Metric Value (e.g. 98.4%, 12,500+)
                      </label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => {
                          const updated = [...settings.stats];
                          updated[idx] = { ...updated[idx], value: e.target.value };
                          setSettings({ ...settings, stats: updated });
                        }}
                        className="w-full px-3.5 py-2 border rounded-xl text-sm font-black text-red-600 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Label / Title (e.g. Success Rate)
                      </label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => {
                          const updated = [...settings.stats];
                          updated[idx] = { ...updated[idx], label: e.target.value };
                          setSettings({ ...settings, stats: updated });
                        }}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs font-bold text-slate-800 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Subtext Description (e.g. 7+ Bands in first attempt)
                      </label>
                      <input
                        type="text"
                        value={stat.subtext || ''}
                        onChange={(e) => {
                          const updated = [...settings.stats];
                          updated[idx] = { ...updated[idx], subtext: e.target.value };
                          setSettings({ ...settings, stats: updated });
                        }}
                        className="w-full px-3.5 py-2 border rounded-xl text-xs text-slate-600 bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => {
                  const newId = `stat-${Date.now()}`;
                  const updated = [...(settings.stats || []), { id: newId, value: '100%', label: 'Metric Title', subtext: 'Supporting details' }];
                  setSettings({ ...settings, stats: updated });
                }}
                className="px-4 py-2.5 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Stat Counter Card</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: SECURITY & LEADS EMAIL */}
      {activeTab === 'security' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900">Security & Leads Email Alert Settings</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Leads Notification Email (Where student inquiries are sent)
              </label>
              <input
                type="email"
                value={settings.leadEmail || 'Info@firstclassglobaleducation.com'}
                onChange={(e) => setSettings({ ...settings, leadEmail: e.target.value })}
                className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 font-bold text-slate-900 text-xs sm:text-sm"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Whenever a student fills the form, an instant inquiry alert will be routed to this address.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Change Admin Login Password
              </label>
              <input
                type="password"
                placeholder="Enter new password (leave blank to keep current)"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Save Bar */}
      <div className="flex justify-end pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-xl shadow-red-600/30 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{saving ? 'Saving All Changes...' : 'Save All Changes'}</span>
        </button>
      </div>

    </div>
  );
}
