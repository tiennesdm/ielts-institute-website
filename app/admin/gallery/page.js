'use client';
import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Trash2,
  Image as ImageIcon,
  UploadCloud,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
  Filter,
  Settings,
  Save,
  AlertCircle
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminGalleryPage() {
  const [activeTab, setActiveTab] = useState('gallery'); // 'gallery' | 'settings'
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [config, setConfig] = useState({
    badge: 'Campus & Life At Academy',
    title: 'Our Photo & Campus Gallery',
    subtitle: 'Take a look inside our high-tech computer simulation labs, acoustic 1-on-1 speaking cabins, visa celebrations, and student felicitation ceremonies.',
    show: true
  });

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Classrooms & Labs',
    image: '',
    description: '',
    isActive: true
  });

  const categories = [
    'Classrooms & Labs',
    'Celebrations & Visas',
    'Awards & Events',
    'Seminars & Workshops',
    'Mock Tests'
  ];

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    try {
      const res = await fetch('/api/admin/gallery');
      const data = await res.json();
      if (data) {
        setGallery(Array.isArray(data) ? data : (data.gallery || []));
        if (data.config) {
          setConfig({
            badge: data.config.badge || 'Campus & Life At Academy',
            title: data.config.title || 'Our Photo & Campus Gallery',
            subtitle: data.config.subtitle || 'Take a look inside our high-tech computer simulation labs...',
            show: data.config.show !== false
          });
        }
      }
    } catch (e) {
      setError('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  }

  // Toggle active visibility for individual photo
  const handleToggleActive = async (id) => {
    try {
      // Optimistic update
      setGallery(prev => prev.map(g => g.id === id ? { ...g, isActive: g.isActive === false ? true : false } : g));

      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active', id })
      });
      const data = await res.json();
      if (res.ok && data.gallery) {
        setGallery(data.gallery);
        setSuccess('Photo visibility updated!');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      setError('Failed to update photo visibility');
    }
  };

  // Toggle whole section visibility on homepage
  const handleToggleSectionShow = async () => {
    const nextShow = !config.show;
    setConfig(prev => ({ ...prev, show: nextShow }));
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config: { ...config, show: nextShow }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Gallery section is now ${nextShow ? 'VISIBLE' : 'HIDDEN'} on homepage!`);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Failed to update section visibility');
    } finally {
      setSavingConfig(false);
    }
  };

  // Save section settings
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Section settings and visibility saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save settings');
      }
    } catch (err) {
      setError('Failed to save settings');
    } finally {
      setSavingConfig(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await processAndUploadImage(file);
      if (dataUrl) {
        setNewItem(prev => ({ ...prev, image: dataUrl }));
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setNewItem(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.warn('Upload fallback to client image:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!newItem.title || !newItem.image) {
      alert('Please provide a title and an image');
      return;
    }

    try {
      const res = await fetch('/api/admin/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newItem),
      });

      const data = await res.json();
      if (res.ok) {
        setGallery(data.gallery);
        setShowAddModal(false);
        setNewItem({ title: '', category: 'Classrooms & Labs', image: '', description: '', isActive: true });
        setSuccess('New photo added to gallery successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Save error');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setGallery(data.gallery);
        setSuccess('Photo deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Delete error');
    }
  };

  const filteredItems = gallery.filter(item => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeCount = gallery.filter(g => g.isActive !== false).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Section Visibility & Status Controller Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            config.show ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">
                Photo Gallery & Campus Media
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                #gallery
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                config.show
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {config.show ? '● Section Visible on Homepage' : '○ Section Hidden from Homepage'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {config.show
                ? `Active on Homepage: Displaying ${activeCount} of ${gallery.length} photos.`
                : 'Section is currently turned OFF. No photos will appear on your website until enabled.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleSectionShow}
            disabled={savingConfig}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
              config.show
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Toggle whether the Gallery section appears on the homepage"
          >
            {config.show ? (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Hide Section from Homepage</span>
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                <span>Show Section on Homepage</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Photo</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm rounded-xl font-bold flex items-center gap-2 shadow-sm animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm rounded-xl font-bold flex items-center gap-2 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs Switcher */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('gallery')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'gallery'
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>Photo Gallery ({gallery.length})</span>
          <span className="ml-1 text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
            {activeCount} Live
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'settings'
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Section Headings & Visibility</span>
        </button>
      </div>

      {/* TAB 1: GALLERY GRID */}
      {activeTab === 'gallery' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setActiveCategory('ALL')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                  activeCategory === 'ALL'
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                All Photos ({gallery.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    activeCategory === cat
                      ? 'bg-blue-900 text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-[11px] text-slate-400">
              💡 Click "Visible / Hidden" on any photo to toggle its appearance on the homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isCardActive = item.isActive !== false;
              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md relative ${
                    isCardActive ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/60 opacity-80'
                  }`}
                >
                  {/* Top Status Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 z-10 ${
                    isCardActive ? 'bg-gradient-to-r from-blue-600 to-indigo-600' : 'bg-slate-300'
                  }`} />

                  <div>
                    <div className="relative h-48 w-full bg-slate-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        {item.category}
                      </span>

                      {/* 1-Click Quick Toggle Eye Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(item.id)}
                        className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-black shadow-md flex items-center gap-1 transition-all ${
                          isCardActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800/90 hover:bg-slate-900 text-slate-200'
                        }`}
                        title={isCardActive ? 'Click to hide photo from website' : 'Click to show photo on website'}
                      >
                        {isCardActive ? (
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

                    <div className="p-4">
                      <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                      {item.description && (
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCardActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCardActive ? '● Live' : '○ Hidden'}
                    </span>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Photo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SECTION HEADINGS & SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Gallery Section Customizer</h2>
                <p className="text-xs text-slate-500">Edit badge, headline, subtitle, and toggle section visibility on homepage.</p>
              </div>
            </div>
            <button
              type="submit"
              disabled={savingConfig}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{savingConfig ? 'Saving...' : 'Save Section Settings'}</span>
            </button>
          </div>

          {/* Section Visibility Switch */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-4">
            <div>
              <span className="text-xs font-black text-slate-900 block">
                Show Photo Gallery Section on Homepage
              </span>
              <span className="text-[11px] text-slate-500">
                When enabled, the photo gallery is rendered on the public website. Turn off to hide it completely.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={config.show}
                onChange={(e) => setConfig(prev => ({ ...prev, show: e.target.checked }))}
                className="sr-only peer"
              />
              <div className="w-12 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Pill Badge Text</label>
              <input
                type="text"
                value={config.badge}
                onChange={(e) => setConfig(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="Campus & Life At Academy"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Headline</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Our Photo & Campus Gallery"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
              <textarea
                rows={3}
                value={config.subtitle}
                onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Take a look inside our high-tech computer simulation labs..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white leading-relaxed"
              />
            </div>
          </div>
        </form>
      )}

      {/* Add / Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">Upload Gallery Image</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Display on Homepage Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Display On Homepage (Visible)</span>
                  <span className="text-[11px] text-slate-500">Turn off to upload or keep photo hidden without deleting</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newItem.isActive !== false}
                    onChange={(e) => setNewItem(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Photo Title / Headline *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Visa Approvals & Celebration Party"
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category Filter
                </label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Image upload area */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Upload Image from Computer or Paste URL *
                </label>
                
                <div className="border-2 border-dashed border-slate-300 hover:border-red-500 rounded-2xl p-6 text-center bg-slate-50 transition-colors">
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <label className="cursor-pointer font-bold text-xs text-red-600 hover:underline">
                    <span>{uploading ? 'Uploading to Server...' : 'Click to select image file from computer'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
                </div>

                <div className="mt-2 text-center text-xs text-slate-400 font-semibold">— OR —</div>

                <input
                  type="text"
                  placeholder="Or paste external image URL"
                  value={newItem.image}
                  onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                  className="w-full mt-2 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />

                {newItem.image && (
                  <div className="mt-3">
                    <span className="text-[10px] text-slate-400 font-semibold block mb-1">Selected Preview:</span>
                    <div className="relative h-36 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                      <img
                        src={newItem.image}
                        alt="Preview"
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. 45+ students granted Canada student visas this month."
                  value={newItem.description}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading || !newItem.image}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md disabled:opacity-50"
                >
                  Add To Gallery
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
