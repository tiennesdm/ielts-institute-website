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
  Filter
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminUniversitiesPage() {
  const [data, setData] = useState({ header: {}, items: [] });
  const [loading, setLoading] = useState(true);
  const [activeCountry, setActiveCountry] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
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

  const [currentUni, setCurrentUni] = useState(defaultUniversity);
  const [headerForm, setHeaderForm] = useState({
    badge: '',
    title: '',
    subtitle: ''
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
      setData(resData || { header: {}, items: [] });
      if (resData?.header) {
        setHeaderForm({
          badge: resData.header.badge || '',
          title: resData.header.title || '',
          subtitle: resData.header.subtitle || ''
        });
      }
    } catch (err) {
      setError('Failed to fetch universities');
    } finally {
      setLoading(false);
    }
  }

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
        setData(resData.universities);
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
        setData(resData.universities);
        setSuccess('University removed successfully');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError('Delete error');
    }
  };

  const handleSaveHeader = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/universities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updateHeader: true, header: headerForm }),
      });
      const resData = await res.json();
      if (res.ok) {
        setData(resData.universities);
        setIsHeaderModalOpen(false);
        setSuccess('Section Header updated successfully!');
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError('Failed to update header');
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
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900">Partner Universities & Global Tie-Ups</h1>
            <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-xs font-black">
              {data.items?.length || 0} Universities
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your direct international college representations, rankings, scholarships & programs.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsHeaderModalOpen(true)}
            className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
          >
            Edit Section Banner
          </button>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Partner University</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{success}</span>
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs font-bold">
          {error}
        </div>
      )}

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

      {/* Add / Edit University Modal */}
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
                    placeholder="e.g. University of Toronto"
                    value={currentUni.name}
                    onChange={(e) => setCurrentUni({ ...currentUni, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Country *
                  </label>
                  <select
                    value={currentUni.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
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
                    City / State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Toronto, Ontario"
                    value={currentUni.city}
                    onChange={(e) => setCurrentUni({ ...currentUni, city: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Global Ranking Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. QS World Rank #21 | #1 in Canada"
                    value={currentUni.ranking}
                    onChange={(e) => setCurrentUni({ ...currentUni, ranking: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Scholarship Offer / Funding
                </label>
                <input
                  type="text"
                  placeholder="e.g. Up to $10,000 CAD Entrance Merit Awards"
                  value={currentUni.scholarship}
                  onChange={(e) => setCurrentUni({ ...currentUni, scholarship: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-amber-800"
                />
              </div>

              {/* Photo / Logo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Campus Photo / Banner (Upload or URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentUni.logo || ''}
                    onChange={(e) => setCurrentUni({ ...currentUni, logo: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border rounded-xl text-xs font-bold text-slate-700 cursor-pointer shrink-0">
                    <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>

                {currentUni.logo && (
                  <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    <img
                      src={currentUni.logo}
                      alt="University Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Popular Programs Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Popular Degree Programs
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={programInput}
                    onChange={(e) => setProgramInput(e.target.value)}
                    placeholder="e.g. Master of Computer Science"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddProgram();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddProgram}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-2">
                  {currentUni.popularPrograms?.map((prog, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium flex items-center gap-1.5"
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

              {/* Key Features Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Features / Benefits (e.g. 3-Year PGWP, Fast Track)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Direct Admissions with No Application Fee"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFeature();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFeature}
                    className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 mt-2">
                  {currentUni.features?.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-1.5 px-2 rounded bg-slate-50 text-xs text-slate-700"
                    >
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(idx)}
                        className="text-slate-400 hover:text-red-600 font-bold ml-2"
                      >
                        ×
                      </button>
                    </div>
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

      {/* Edit Section Header Modal */}
      {isHeaderModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Edit Section Headline & Subtitle</h3>
              <button
                onClick={() => setIsHeaderModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeader} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag</label>
                <input
                  type="text"
                  value={headerForm.badge}
                  onChange={(e) => setHeaderForm({ ...headerForm, badge: e.target.value })}
                  placeholder="e.g. Official Global Study Abroad Network"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Main Heading</label>
                <input
                  type="text"
                  value={headerForm.title}
                  onChange={(e) => setHeaderForm({ ...headerForm, title: e.target.value })}
                  placeholder="e.g. Direct University Tie-Ups & Global College Network"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Sub-description</label>
                <textarea
                  rows={3}
                  value={headerForm.subtitle}
                  onChange={(e) => setHeaderForm({ ...headerForm, subtitle: e.target.value })}
                  placeholder="Describe your university partnerships..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsHeaderModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Save Header
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
