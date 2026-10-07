'use client';
import { useState, useEffect } from 'react';
import {
  GraduationCap,
  PlusCircle,
  Edit3,
  Trash2,
  Image as ImageIcon,
  X,
  CheckCircle2,
  Sparkles,
  MapPin,
  Globe2,
  Save,
  Search,
  Filter,
  Eye,
  EyeOff,
  Sliders,
  Zap,
  Building2,
  ArrowRight,
  Plus,
  RotateCcw
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminUniversitiesPage() {
  const [data, setData] = useState({ header: {}, items: [] });
  const [config, setConfig] = useState({
    show: true,
    marqueeTitle: 'Representing 850+ Direct Global Partner Universities & Colleges',
    bannerBadge: 'Fast-Track Admission & Spot Assessment',
    bannerTitle: 'Confused About Which University & Country Fits Your Profile?',
    bannerDesc: 'Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities.',
    bannerCta: 'Book Free 1-on-1 Profile Assessment'
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('header'); // 'header' | 'universities' | 'banner'
  const [activeCountry, setActiveCountry] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingHeader, setSavingHeader] = useState(false);
  const [savingBanner, setSavingBanner] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const defaultUniversity = {
    name: '',
    country: 'Canada',
    flag: '🇨🇦',
    city: '',
    ranking: 'Top Ranked Global University',
    scholarship: 'Up to $10,000 Merit Scholarship Available',
    popularPrograms: ['Computer Science', 'Business & MBA', 'Engineering'],
    features: ['Direct Admissions Partner', '3-Year Post-Study Work Rights', 'High Visa Success Rate'],
    logo: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'
  };

  const defaultHeader = {
    badge: 'Official Global Study Abroad Network',
    title: 'Direct University Tie-Ups & Global College Network',
    subtitle: 'First Class Global Education LLP directly represents 100+ world-renowned universities and colleges across 30+ countries. Fast-track offer letters, scholarship evaluations, and end-to-end visa filing.',
    stats: [
      { label: 'Direct University Tie-Ups', value: '850+' },
      { label: 'Top Destination Countries', value: '25+' },
      { label: 'Offer Letter Turnaround', value: '48 - 72 Hrs' },
      { label: 'Scholarships Facilitated', value: '₹12+ Crores' }
    ]
  };

  const [currentUni, setCurrentUni] = useState(defaultUniversity);
  const [headerForm, setHeaderForm] = useState(defaultHeader);
  const [bannerForm, setBannerForm] = useState({
    marqueeTitle: '',
    bannerBadge: '',
    bannerTitle: '',
    bannerDesc: '',
    bannerCta: ''
  });
  const [programInput, setProgramInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');

  const countryFlags = {
    'Canada': '🇨🇦',
    'Australia': '🇦🇺',
    'United Kingdom': '🇬🇧',
    'USA': '🇺🇸',
    'Germany': '🇩🇪',
    'Ireland': '🇮🇪',
    'New Zealand': '🇳🇿',
    'France': '🇫🇷',
    'Italy': '🇮🇹',
    'Singapore': '🇸🇬'
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  async function fetchUniversities() {
    try {
      const res = await fetch('/api/admin/universities');
      const resData = await res.json();
      
      const uniData = resData.universities || resData;
      setData(uniData || { header: {}, items: [] });

      const headerObj = resData.header || uniData.header || {};
      const cfgObj = resData.config || {};

      setHeaderForm({
        badge: headerObj.badge || cfgObj.badge || defaultHeader.badge,
        title: headerObj.title || cfgObj.title || defaultHeader.title,
        subtitle: headerObj.subtitle || cfgObj.subtitle || defaultHeader.subtitle,
        stats: Array.isArray(headerObj.stats) && headerObj.stats.length > 0
          ? headerObj.stats
          : Array.isArray(cfgObj.stats) && cfgObj.stats.length > 0
            ? cfgObj.stats
            : defaultHeader.stats
      });

      setConfig(cfgObj);
      setBannerForm({
        marqueeTitle: cfgObj.marqueeTitle || 'Representing 850+ Direct Global Partner Universities & Colleges',
        bannerBadge: cfgObj.bannerBadge || 'Fast-Track Admission & Spot Assessment',
        bannerTitle: cfgObj.bannerTitle || 'Confused About Which University & Country Fits Your Profile?',
        bannerDesc: cfgObj.bannerDesc || 'Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors. We evaluate your academics, IELTS band score, and budget to provide a tailored list of top admitting universities.',
        bannerCta: cfgObj.bannerCta || 'Book Free 1-on-1 Profile Assessment'
      });
    } catch (err) {
      setError('Failed to fetch universities data');
    } finally {
      setLoading(false);
    }
  }

  const handleToggleSection = async () => {
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_section' }),
      });
      const resData = await res.json();
      if (res.ok && resData.config) {
        setConfig(resData.config);
        setSuccess(resData.config.show !== false ? 'Section is now visible on homepage!' : 'Section hidden from homepage!');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError('Failed to toggle section visibility');
    }
  };

  const handleSaveHeader = async (e) => {
    if (e) e.preventDefault();
    setSavingHeader(true);
    setError('');
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateHeader: true, header: headerForm }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(resData.universities || resData);
        if (resData.config) setConfig(resData.config);
        setSuccess('Section Headline, Subtitle & Key Metric Cards saved successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(resData.error || 'Failed to update header');
      }
    } catch (err) {
      setError('Failed to update header');
    } finally {
      setSavingHeader(false);
    }
  };

  const handleStatChange = (index, field, value) => {
    setHeaderForm(prev => {
      const newStats = [...(prev.stats || [])];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, stats: newStats };
    });
  };

  const handleAddStat = () => {
    setHeaderForm(prev => ({
      ...prev,
      stats: [...(prev.stats || []), { label: 'New Metric', value: '100+' }]
    }));
  };

  const handleRemoveStat = (index) => {
    if ((headerForm.stats || []).length <= 1) {
      alert('You must have at least one metric card');
      return;
    }
    setHeaderForm(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleResetDefaultStats = () => {
    setHeaderForm(prev => ({
      ...prev,
      stats: defaultHeader.stats
    }));
  };

  const handleSaveBanner = async (e) => {
    if (e) e.preventDefault();
    setSavingBanner(true);
    setError('');
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateConfig: true, config: bannerForm }),
      });
      const resData = await res.json();
      if (res.ok) {
        if (resData.config) setConfig(resData.config);
        setSuccess('Ticker Marquee & Callout Banner settings saved successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(resData.error || 'Failed to update banner settings');
      }
    } catch (err) {
      setError('Failed to update banner settings');
    } finally {
      setSavingBanner(false);
    }
  };

  const handleOpenAdd = () => {
    setCurrentUni(defaultUniversity);
    setIsModalOpen(true);
    setError('');
  };

  const handleOpenEdit = (uni) => {
    setCurrentUni({
      ...uni,
      popularPrograms: uni.popularPrograms || [],
      features: uni.features || []
    });
    setIsModalOpen(true);
    setError('');
  };

  const handleCountryChange = (country) => {
    setCurrentUni(prev => ({
      ...prev,
      country,
      flag: countryFlags[country] || '🏛️'
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await processAndUploadImage(file, 1000, 800, 0.85);
      if (dataUrl) {
        setCurrentUni(prev => ({ ...prev, logo: dataUrl }));
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const upData = await res.json();
      if (res.ok && upData.url) {
        setCurrentUni(prev => ({ ...prev, logo: upData.url }));
      }
    } catch (err) {
      console.warn('Fallback to client image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddProgram = () => {
    if (!programInput.trim()) return;
    setCurrentUni(prev => ({
      ...prev,
      popularPrograms: [...(prev.popularPrograms || []), programInput.trim()]
    }));
    setProgramInput('');
  };

  const handleRemoveProgram = (idx) => {
    setCurrentUni(prev => ({
      ...prev,
      popularPrograms: prev.popularPrograms.filter((_, i) => i !== idx)
    }));
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setCurrentUni(prev => ({
      ...prev,
      features: [...(prev.features || []), featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setCurrentUni(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveUni = async (e) => {
    e.preventDefault();
    if (!currentUni.name || !currentUni.country) {
      alert('University name and country are required');
      return;
    }

    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUni),
      });

      const resData = await res.json();
      if (res.ok) {
        setData(resData.universities || resData);
        setIsModalOpen(false);
        setSuccess('Partner University saved successfully!');
        setTimeout(() => setSuccess(''), 4000);
      } else {
        setError(resData.error || 'Failed to save');
      }
    } catch (err) {
      setError('Save error');
    }
  };

  const handleDeleteUni = async (id) => {
    if (!confirm('Are you sure you want to remove this partner university?')) return;
    try {
      const res = await fetch(`/api/admin/universities?id=${id}`, { method: 'DELETE' });
      const resData = await res.json();
      if (res.ok) {
        setData(resData.universities || resData);
        setSuccess('University removed successfully');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError('Delete error');
    }
  };

  const countries = ['ALL', 'Canada', 'Australia', 'United Kingdom', 'USA', 'Germany', 'Ireland', 'New Zealand'];

  const filteredItems = (data.items || []).filter((uni) => {
    const matchesCountry = activeCountry === 'ALL' || uni.country?.toLowerCase() === activeCountry.toLowerCase();
    const matchesSearch = !searchQuery.trim() ||
      uni.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.ranking?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-600">
          <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-sm">Loading Partner Universities...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* SECTION VISIBILITY & STATUS BANNER */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-900 shrink-0">
            <Globe2 className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-400">#universities</span>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-black tracking-wide ${
                config.show !== false ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {config.show !== false ? '● Section Visible on Homepage' : '○ Section Hidden from Homepage'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Controls whether the entire University Tie-ups & Study Abroad section appears on the public website.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="/#universities"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            View on Homepage ↗
          </a>
          <button
            type="button"
            onClick={handleToggleSection}
            className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 shadow-sm ${
              config.show !== false
                ? 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'
            }`}
          >
            {config.show !== false ? 'Hide Section from Homepage' : 'Show Section on Homepage'}
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold animate-fadeIn">
          {error}
        </div>
      )}

      {/* TABS SWITCHER */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab('header')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'header'
              ? 'bg-blue-950 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sliders className="w-4 h-4 text-red-500" />
          <span>⚙️ Header & Key Stats (Top Section)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-red-600 text-white">
            Customizable
          </span>
        </button>

        <button
          onClick={() => setActiveTab('universities')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'universities'
              ? 'bg-blue-950 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>🏛️ Partner Universities</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-900">
            {data.items?.length || 0}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('banner')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
            activeTab === 'banner'
              ? 'bg-blue-950 text-white shadow-md'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Zap className="w-4 h-4 text-amber-500" />
          <span>📢 Ticker & Callout Banner</span>
        </button>
      </div>

      {/* TAB 1: HEADER & KEY STATS (TOP SECTION) */}
      {activeTab === 'header' && (
        <div className="space-y-6">
          
          {/* LIVE PREVIEW BOX */}
          <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200">
              <span className="text-xs font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Homepage Preview (As Displayed To Visitors)
              </span>
              <span className="text-[11px] font-bold text-slate-400">Updates in real-time</span>
            </div>

            <div className="text-center max-w-3xl mx-auto my-4">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/60 text-blue-900 text-xs font-black tracking-wide uppercase mb-3 shadow-sm">
                <Globe2 className="w-4 h-4 text-red-600 shrink-0" />
                <span>{headerForm.badge || 'Official Global Study Abroad Network'}</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {headerForm.title || 'Direct University Tie-Ups & Global College Network'}
              </h2>

              <p className="text-xs sm:text-sm text-slate-600 font-medium mt-3 leading-relaxed">
                {headerForm.subtitle || 'First Class Global Education directly represents 100+ world-renowned universities and colleges across 30+ countries.'}
              </p>
            </div>

            {/* Preview of Key Metric Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mt-6">
              {(headerForm.stats || []).map((st, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm"
                >
                  <div className="text-xl sm:text-2xl font-black text-blue-950">
                    {st.value || '0+'}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-wider">
                    {st.label || 'Metric Label'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* EDIT FORM */}
          <form onSubmit={handleSaveHeader} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-red-600" />
                <span>Customize Section Headline, Badge & 4 Metric Cards</span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Edit the text, numbers, and stats exactly as shown at the top of the University Tie-ups section.
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-slate-100">
              
              {/* Badge Tag */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pill Badge Tag (Top of Section)
                </label>
                <input
                  type="text"
                  value={headerForm.badge}
                  onChange={(e) => setHeaderForm({ ...headerForm, badge: e.target.value })}
                  placeholder="e.g. OFFICIAL GLOBAL STUDY ABROAD NETWORK"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Main Heading */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Main Section Heading
                </label>
                <input
                  type="text"
                  value={headerForm.title}
                  onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
                  placeholder="e.g. Direct University Tie-Ups & Global College Network"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-black focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* Sub-description Paragraph */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sub-description Paragraph
                </label>
                <textarea
                  rows={3}
                  value={headerForm.subtitle}
                  onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
                  placeholder="Describe your global tie-ups, offer letter speed, scholarships, etc."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>

              {/* 4 STATS / KEY METRIC CARDS */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <label className="block text-xs font-black text-slate-800 uppercase tracking-wide">
                      Key Metric Statistic Cards ({headerForm.stats?.length || 0})
                    </label>
                    <span className="text-[11px] text-slate-500">
                      These 4 cards appear directly underneath the headline.
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleResetDefaultStats}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                      title="Reset to original 4 statistics"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Defaults</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleAddStat}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-black transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Metric Card</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  {(headerForm.stats || []).map((st, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200 rounded-2xl p-4 relative group space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                          Metric Box #{idx + 1}
                        </span>
                        {headerForm.stats.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStat(idx)}
                            className="p-1 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Remove this metric card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Metric Value / Number
                        </label>
                        <input
                          type="text"
                          value={st.value}
                          onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                          placeholder="e.g. 850+, 25+, 48 - 72 Hrs"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm font-black text-blue-950 focus:outline-none focus:border-red-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                          Metric Label / Title
                        </label>
                        <input
                          type="text"
                          value={st.label}
                          onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                          placeholder="e.g. DIRECT UNIVERSITY TIE-UPS"
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-red-500"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                type="submit"
                disabled={savingHeader}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                <span>{savingHeader ? 'Saving Changes...' : 'Save Header & Stats Changes'}</span>
              </button>
            </div>
          </form>

        </div>
      )}

      {/* TAB 2: PARTNER UNIVERSITIES LIST */}
      {activeTab === 'universities' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
            <div>
              <h2 className="text-lg font-black text-slate-900">Partner University Cards</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Manage your individual direct representations, scholarships, rankings, and program lists.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/30 transition-all hover:scale-105 active:scale-95 self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Partner University</span>
            </button>
          </div>

          {/* Search & Country Filter Bar */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
            {/* Country Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
              {countries.map((c) => (
                <button
                  key={c}
                  onClick={() => setActiveCountry(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
                    activeCountry === c
                      ? 'bg-blue-950 text-white shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {c === 'ALL' ? 'All Countries' : `${countryFlags[c] || ''} ${c}`}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative shrink-0 w-full md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search university or city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          {/* Universities Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredItems.map((uni) => (
              <div
                key={uni.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Header Image */}
                  <div className="relative h-36 w-full bg-slate-900 overflow-hidden">
                    <img
                      src={uni.logo || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80'}
                      alt={uni.name}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-white/95 text-slate-900 text-xs font-black shadow-sm flex items-center gap-1">
                      <span>{uni.flag}</span>
                      <span>{uni.country}</span>
                    </div>

                    {uni.ranking && (
                      <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-black uppercase">
                        {uni.ranking.split('|')[0].trim()}
                      </div>
                    )}

                    <div className="absolute bottom-2 left-3 right-3">
                      <span className="text-[11px] text-slate-300 font-semibold flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        <span>{uni.city}</span>
                      </span>
                      <h3 className="text-base font-black text-white truncate drop-shadow-sm">{uni.name}</h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-4 space-y-3">
                    {uni.scholarship && (
                      <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-950 text-xs font-bold truncate">
                        💰 {uni.scholarship}
                      </div>
                    )}

                    {uni.popularPrograms && uni.popularPrograms.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Programs:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {uni.popularPrograms.slice(0, 3).map((p, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                              {p}
                            </span>
                          ))}
                          {uni.popularPrograms.length > 3 && (
                            <span className="px-1.5 py-0.5 text-[10px] font-bold text-slate-400">
                              +{uni.popularPrograms.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-400">ID: {uni.id}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(uni)}
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit University"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteUni(uni.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete University"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: TICKER & CALLOUT BANNER */}
      {activeTab === 'banner' && (
        <form onSubmit={handleSaveBanner} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm">
          <div>
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Marquee Ticker & Global Counseling Callout Banner</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Customize the moving marquee banner text and the prominent counseling CTA box at the bottom of the section.
            </p>
          </div>

          <div className="space-y-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Marquee Ticker Title
              </label>
              <input
                type="text"
                value={bannerForm.marqueeTitle}
                onChange={(e) => setBannerForm({ ...bannerForm, marqueeTitle: e.target.value })}
                placeholder="e.g. Representing 850+ Direct Global Partner Universities & Colleges"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Counseling Banner Pill Badge
                </label>
                <input
                  type="text"
                  value={bannerForm.bannerBadge}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerBadge: e.target.value })}
                  placeholder="e.g. Fast-Track Admission & Spot Assessment"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Counseling Banner CTA Button Text
                </label>
                <input
                  type="text"
                  value={bannerForm.bannerCta}
                  onChange={(e) => setBannerForm({ ...bannerForm, bannerCta: e.target.value })}
                  placeholder="e.g. Book Free 1-on-1 Profile Assessment"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-black text-red-600 focus:outline-none focus:border-red-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Counseling Banner Main Title
              </label>
              <input
                type="text"
                value={bannerForm.bannerTitle}
                onChange={(e) => setBannerForm({ ...bannerForm, bannerTitle: e.target.value })}
                placeholder="e.g. Confused About Which University & Country Fits Your Profile?"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Counseling Banner Description
              </label>
              <textarea
                rows={3}
                value={bannerForm.bannerDesc}
                onChange={(e) => setBannerForm({ ...bannerForm, bannerDesc: e.target.value })}
                placeholder="Get an unbiased profile assessment from our Senior Study Abroad Visa Advisors..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-100">
            <button
              type="submit"
              disabled={savingBanner}
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              <span>{savingBanner ? 'Saving...' : 'Save Ticker & Banner Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* ADD / EDIT UNIVERSITY MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {currentUni.id ? 'Edit Partner University' : 'Add New Partner University'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUni} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    University Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentUni.name}
                    onChange={(e) => setCurrentUni({ ...currentUni, name: e.target.value })}
                    placeholder="e.g. University of Toronto"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country Destination *
                  </label>
                  <select
                    value={currentUni.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                  >
                    {Object.keys(countryFlags).map((c) => (
                      <option key={c} value={c}>
                        {countryFlags[c]} {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    City / Campus Location
                  </label>
                  <input
                    type="text"
                    value={currentUni.city}
                    onChange={(e) => setCurrentUni({ ...currentUni, city: e.target.value })}
                    placeholder="e.g. Toronto, Ontario"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Global Ranking Badge
                  </label>
                  <input
                    type="text"
                    value={currentUni.ranking}
                    onChange={(e) => setCurrentUni({ ...currentUni, ranking: e.target.value })}
                    placeholder="e.g. QS World Rank #21 | #1 in Canada"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scholarship Offer Tag
                </label>
                <input
                  type="text"
                  value={currentUni.scholarship}
                  onChange={(e) => setCurrentUni({ ...currentUni, scholarship: e.target.value })}
                  placeholder="e.g. Up to $10,000 CAD Entrance Awards"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium text-amber-900 bg-amber-50/50"
                />
              </div>

              {/* Banner Image / Logo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus Photo / Logo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentUni.logo}
                    onChange={(e) => setCurrentUni({ ...currentUni, logo: e.target.value })}
                    placeholder="Image URL or upload below"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer flex items-center gap-1.5 transition-colors shrink-0">
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Popular Study Programs */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Popular Study Programs
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={programInput}
                    onChange={(e) => setProgramInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProgram();
                      }
                    }}
                    placeholder="e.g. Master of Data Science (Press Enter)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(currentUni.popularPrograms || []).map((prog, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs"
                    >
                      <span>{prog}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProgram(idx)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Exclusive Features / Highlights */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Benefits / Features
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                    placeholder="e.g. 3-Year Post-Study Work Visa (Press Enter)"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {(currentUni.features || []).map((feat, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs"
                    >
                      <span>{feat}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-emerald-500 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Save University
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
