'use client';
import { useState, useEffect } from 'react';
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
  Globe
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [activeTab, setActiveTab] = useState('logo');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
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
            textPart1: 'First Class',
            textPart2: 'Global Education',
            tagline: s.tagline !== undefined ? s.tagline : 'Premier IELTS, PTE & Study Abroad Academy',
            showIcon: true
          };
        } else if (s.logo.tagline === undefined && s.tagline !== undefined) {
          s.logo.tagline = s.tagline;
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
              bannerBadge: "Fast-Track Admission & Spot Assessment",
              bannerTitle: "Confused About Which University & Country Fits Your Profile?",
              bannerDesc: "Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities.",
              bannerCta: "Book Free 1-on-1 Profile Assessment",
              marqueeTitle: "Representing 850+ Direct Global Partner Universities & Colleges"
            }
          };
        }

        // Hero sub-elements
        if (!s.hero) s.hero = {};
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
    { id: 'hero', label: '⭐ Hero Banner' },
    { id: 'sections', label: '📑 Section Headings' },
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
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">Logo & Brand Identity</h2>
          </div>

          {/* Logo Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Logo Display Type</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border p-3 rounded-xl hover:bg-slate-100 flex-1">
                <input
                  type="radio"
                  name="logoType"
                  value="text"
                  checked={settings.logo?.type === 'text'}
                  onChange={() => setSettings(prev => ({
                    ...prev,
                    logo: { ...prev.logo, type: 'text' }
                  }))}
                  className="w-4 h-4 text-red-600"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 block">Stylized Text Logo</span>
                  <span className="text-[11px] text-slate-400">Customizable 2-part brand text + graduation icon</span>
                </div>
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border p-3 rounded-xl hover:bg-slate-100 flex-1">
                <input
                  type="radio"
                  name="logoType"
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
                  <span className="text-[11px] text-slate-400">Upload your institute's official PNG/JPG logo file</span>
                </div>
              </label>
            </div>
          </div>

          {/* Custom Logo Image Upload */}
          {settings.logo?.type === 'image' && (
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Upload Custom Logo File (PNG / JPG / WEBP)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Paste Image URL or upload from computer"
                  value={settings.logo?.imageUrl || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    logo: { ...prev.logo, imageUrl: e.target.value }
                  }))}
                  className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800"
                />
                <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm">
                  <UploadCloud className="w-4 h-4 inline mr-1.5" />
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

              {settings.logo?.imageUrl && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">Live Logo Preview:</span>
                  <div className="p-3 bg-white border rounded-xl inline-block shadow-sm">
                    <img
                      src={settings.logo.imageUrl}
                      alt="Logo preview"
                      className="h-12 w-auto object-contain max-w-xs"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Text Logo Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name (Part 1 - Dark Text)</label>
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
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Brand Name (Part 2 - Red Text)</label>
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
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Tagline / Subtext under Logo</label>
              <input
                type="text"
                value={settings.logo?.tagline !== undefined ? settings.logo.tagline : (settings.tagline !== undefined ? settings.tagline : '')}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  tagline: e.target.value,
                  logo: { ...prev.logo, tagline: e.target.value }
                }))}
                placeholder="Premier IELTS, PTE & Study Abroad Academy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={settings.logo?.showIcon !== false}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    logo: { ...prev.logo, showIcon: e.target.checked }
                  }))}
                  className="w-4 h-4 text-red-600 rounded"
                />
                <span className="text-xs font-bold text-slate-800">Show Graduation Cap Icon Badge</span>
              </label>
            </div>
          </div>
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

      {/* TAB 3: HERO BANNER */}
      {activeTab === 'hero' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-bold text-slate-900">Hero Section & Banner</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Top Pill Badge</label>
              <input
                type="text"
                value={settings.hero?.badge || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  hero: { ...prev.hero, badge: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Main Headline</label>
              <input
                type="text"
                value={settings.hero?.headline || ''}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  hero: { ...prev.hero, headline: e.target.value }
                }))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-black text-slate-900"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary CTA Button</label>
                <input
                  type="text"
                  value={settings.hero?.primaryCtaText || 'Book Free Mock Test & Demo'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hero: { ...prev.hero, primaryCtaText: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Secondary Button</label>
                <input
                  type="text"
                  value={settings.hero?.secondaryCtaText || 'Explore Band Courses'}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hero: { ...prev.hero, secondaryCtaText: e.target.value }
                  }))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700"
                />
              </div>
            </div>

            {/* Banner Image Upload */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Hero Banner Image (Upload File from Device or Paste URL)
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  placeholder="Paste Image URL"
                  value={settings.hero?.bannerImage || ''}
                  onChange={(e) => setSettings(prev => ({
                    ...prev,
                    hero: { ...prev.hero, bannerImage: e.target.value }
                  }))}
                  className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs"
                />
                <label className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold cursor-pointer shrink-0 transition-colors shadow-sm">
                  <UploadCloud className="w-4 h-4 inline mr-1.5" />
                  <span>{uploadingHero ? 'Uploading...' : 'Upload Image File'}</span>
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

              {settings.hero?.bannerImage && (
                <div className="pt-2">
                  <span className="text-[11px] text-slate-400 font-bold block mb-1">Preview:</span>
                  <img
                    src={settings.hero.bannerImage}
                    alt="Hero banner preview"
                    className="h-32 w-56 object-cover rounded-xl border shadow-sm"
                  />
                </div>
              )}
            </div>

            {/* 4 Feature Highlights Checkmarks */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hero Feature Checkmarks (4 Highlights)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(settings.hero?.highlights || [
                  "Daily 1-on-1 Speaking with Certified Examiners",
                  "Daily Writing Task 1 & 2 Line Corrections",
                  "Official CD-IELTS Computer Simulation Lab",
                  "Cambridge Official Books (1-19) Study Kits"
                ]).map((hl, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Highlight #{idx + 1}</label>
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
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floating Achiever Badge */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Floating Student Achiever Badge (On Hero Image)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Band Score</label>
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
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-black text-amber-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Badge Tag</label>
                  <input
                    type="text"
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
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">Sectional Scores</label>
                  <input
                    type="text"
                    value={settings.hero?.floatingBadge?.sub || 'L: 9.0 • R: 9.0 • S: 8.5'}
                    onChange={(e) => setSettings(prev => ({
                      ...prev,
                      hero: {
                        ...prev.hero,
                        floatingBadge: { ...prev.hero?.floatingBadge, sub: e.target.value }
                      }
                    }))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-emerald-600"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Trust Pills */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bottom Trust Pills (Inside Hero Image Banner)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(settings.hero?.bottomPills || [
                  { icon: 'Award', text: 'IDP & British Council' },
                  { icon: 'Headphones', text: 'Real Headset Lab' },
                  { icon: 'Shield', text: '100% Guaranteed' }
                ]).map((pill, idx) => (
                  <div key={idx}>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Pill #{idx + 1}</label>
                    <input
                      type="text"
                      value={pill.text}
                      onChange={(e) => {
                        const updated = [...(settings.hero?.bottomPills || [])];
                        updated[idx] = { ...updated[idx], text: e.target.value };
                        setSettings(prev => ({
                          ...prev,
                          hero: { ...prev.hero, bottomPills: updated }
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Instant Callback Form Box */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
                Hero Instant Callback Box
              </label>
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
            </div>

          </div>
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
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Footer Programs List</h3>
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
          </div>
        </div>
      )}

      {/* TAB: SECTION HEADINGS & BADGES */}
      {activeTab === 'sections' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-8">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-red-600" />
            <div>
              <h2 className="text-base font-bold text-slate-900">Website Section Headers & Badges</h2>
              <p className="text-xs text-slate-500">Edit titles, badges, subtitles, and button labels for every section on the homepage.</p>
            </div>
          </div>

          {/* 1. Courses Section */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <BookOpen className="w-4 h-4 text-red-600" />
              <span>1. Band 8+ Courses Section</span>
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
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span>2. 8+ Band Results (Hall of Fame) Section</span>
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
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Calendar className="w-4 h-4 text-emerald-600" />
              <span>3. Upcoming Batches Section</span>
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
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Sparkles className="w-4 h-4 text-yellow-500" />
              <span>4. Student Testimonials & Reviews Section</span>
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
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <ImageIcon className="w-4 h-4 text-purple-600" />
              <span>5. Campus & Events Gallery Section</span>
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
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <HelpCircle className="w-4 h-4 text-blue-600" />
              <span>6. Frequently Asked Questions (FAQ) Section</span>
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
            </div>
          </div>

          {/* 7. Universities Section Extra Customizer */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
              <Globe className="w-4 h-4 text-red-600" />
              <span>7. University Tie-ups Marquee & Callout Banner</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">Why Choose Us Section</h2>
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
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-5 h-5 text-purple-600" />
            <h2 className="text-base font-bold text-slate-900">Homepage Stats Counter Cards</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settings.stats?.map((stat, idx) => (
              <div key={stat.id || idx} className="p-4 bg-slate-50 border rounded-xl space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-400">Card #{idx + 1}</span>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">Metric Value (e.g. 98.4%)</label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => {
                      const updated = [...settings.stats];
                      updated[idx].value = e.target.value;
                      setSettings({ ...settings, stats: updated });
                    }}
                    className="w-full px-3 py-1.5 border rounded-lg text-sm font-black text-red-600"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">Label (e.g. Success Rate)</label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => {
                      const updated = [...settings.stats];
                      updated[idx].label = e.target.value;
                      setSettings({ ...settings, stats: updated });
                    }}
                    className="w-full px-3 py-1.5 border rounded-lg text-xs font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-600">Subtext</label>
                  <input
                    type="text"
                    value={stat.subtext}
                    onChange={(e) => {
                      const updated = [...settings.stats];
                      updated[idx].subtext = e.target.value;
                      setSettings({ ...settings, stats: updated });
                    }}
                    className="w-full px-3 py-1.5 border rounded-lg text-xs text-slate-500"
                  />
                </div>
              </div>
            ))}
          </div>
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
