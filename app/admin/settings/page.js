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
  Layers
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
            tagline: s.tagline || 'Premier IELTS, PTE & Study Abroad Academy',
            showIcon: true
          };
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
    { id: 'footer', label: '🦶 Footer & Bio' },
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
                value={settings.logo?.tagline || settings.tagline || ''}
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
