'use client';
import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Edit3,
  Trash2,
  ShieldCheck,
  X,
  Eye,
  EyeOff,
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';

export default function AdminWhyUsPage() {
  const [activeTab, setActiveTab] = useState('features'); // 'features' | 'settings'
  const [whyUs, setWhyUs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const defaultItem = {
    title: '',
    description: '',
    isActive: true
  };

  const [currentItem, setCurrentItem] = useState(defaultItem);

  useEffect(() => {
    fetchWhyUs();
  }, []);

  async function fetchWhyUs() {
    try {
      const res = await fetch('/api/admin/why-us');
      const data = await res.json();
      if (data && data.whyUs) {
        setWhyUs(data.whyUs);
      }
    } catch (e) {
      setError('Failed to fetch Why Choose Us data');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentItem(defaultItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentItem({
      ...item,
      isActive: item.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this feature?')) return;
    try {
      const res = await fetch(`/api/admin/why-us?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setWhyUs(data.whyUs);
        setSuccess('Feature deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete feature');
    }
  };

  // Toggle active visibility for individual feature
  const handleToggleActive = async (id) => {
    try {
      // Optimistic update
      setWhyUs(prev => ({
        ...prev,
        items: prev.items.map(it => it.id === id ? { ...it, isActive: it.isActive === false ? true : false } : it)
      }));

      const res = await fetch('/api/admin/why-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active', id })
      });
      const data = await res.json();
      if (res.ok && data.whyUs) {
        setWhyUs(data.whyUs);
        setSuccess('Feature visibility updated!');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      setError('Failed to update feature visibility');
    }
  };

  // Toggle whole section visibility on homepage
  const handleToggleSectionShow = async () => {
    const nextShow = !(whyUs?.show !== false);
    setWhyUs(prev => ({ ...prev, show: nextShow }));
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/why-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config: { show: nextShow }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Why Choose Us section is now ${nextShow ? 'VISIBLE' : 'HIDDEN'} on homepage!`);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Failed to update section visibility');
    } finally {
      setSavingConfig(false);
    }
  };

  // Save section settings and diagnostic banner
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/why-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config: {
            badge: whyUs.badge,
            title: whyUs.title,
            subtitle: whyUs.subtitle,
            show: whyUs.show !== false,
            diagnosticTitle: whyUs.diagnosticTitle,
            diagnosticText: whyUs.diagnosticText,
            diagnosticCta: whyUs.diagnosticCta
          }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Why Choose Us settings and diagnostic banner saved successfully!');
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

  const handleSaveItem = async (e) => {
    e.preventDefault();
    if (!currentItem.title) {
      alert('Feature title is required');
      return;
    }

    try {
      const res = await fetch('/api/admin/why-us', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentItem),
      });

      const data = await res.json();
      if (res.ok) {
        setWhyUs(data.whyUs);
        setIsModalOpen(false);
        setSuccess('Feature saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading || !whyUs) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const items = whyUs.items || [];
  const activeCount = items.filter(it => it.isActive !== false).length;
  const isSectionActive = whyUs.show !== false;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Section Visibility & Status Controller Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            isSectionActive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">
                Why Choose Us (The First Class Advantage)
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                #why-us
              </span>
              <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                isSectionActive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {isSectionActive ? '● Section Visible on Homepage' : '○ Section Hidden from Homepage'}
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {isSectionActive
                ? `Active on Homepage: Displaying ${activeCount} of ${items.length} feature cards.`
                : 'Section is currently turned OFF. Methodology & advantages will not appear on your website until enabled.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleToggleSectionShow}
            disabled={savingConfig}
            className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 shadow-md active:scale-95 ${
              isSectionActive
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
            title="Toggle whether the Why Choose Us section appears on the homepage"
          >
            {isSectionActive ? (
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
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Feature Card</span>
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
          onClick={() => setActiveTab('features')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'features'
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Feature Cards ({items.length})</span>
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
          <span>Section Headings & Diagnostic Banner</span>
        </button>
      </div>

      {/* TAB 1: FEATURE CARDS LIST */}
      {activeTab === 'features' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {items.length} total feature cards ({activeCount} visible on website, {items.length - activeCount} hidden)
            </span>
            <span className="text-[11px] text-slate-400">
              💡 Click the "Visible / Hidden" button on any card to toggle its appearance on the homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((feat, idx) => {
              const isCardActive = feat.isActive !== false;
              return (
                <div
                  key={feat.id || idx}
                  className={`bg-white rounded-2xl border p-5 sm:p-6 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                    isCardActive ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/60 opacity-80'
                  }`}
                >
                  {/* Top Status Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isCardActive ? 'bg-gradient-to-r from-red-600 via-amber-500 to-blue-900' : 'bg-slate-300'
                  }`} />

                  <div>
                    {/* Top Row: Index Badge & 1-Click Quick Toggle Eye Button */}
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 font-mono">
                        Feature #{idx + 1}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(feat.id)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          isCardActive
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                        }`}
                        title={isCardActive ? 'Click to hide feature card from website' : 'Click to show feature card on website'}
                      >
                        {isCardActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base leading-snug">{feat.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {feat.description}
                    </p>
                  </div>

                  {/* Actions Footer */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCardActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCardActive ? '● Live on Page' : '○ Hidden from Page'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(feat)}
                        className="px-2.5 py-1 text-blue-900 hover:bg-blue-50 rounded-lg text-xs font-bold border border-blue-200/60 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(feat.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200/60 transition-colors"
                        title="Delete Feature"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SECTION HEADINGS & DIAGNOSTIC BANNER */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Why Choose Us Section & Diagnostic Banner</h2>
                <p className="text-xs text-slate-500">Edit badge, main headline, description, diagnostic CTA banner, and section visibility.</p>
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
                Show Why Choose Us Section on Homepage
              </span>
              <span className="text-[11px] text-slate-500">
                When enabled, the Why Choose Us advantages and diagnostic test banner are rendered on the public website. Turn off to hide them completely.
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={whyUs.show !== false}
                onChange={(e) => setWhyUs(prev => ({ ...prev, show: e.target.checked }))}
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
                value={whyUs.badge || ''}
                onChange={(e) => setWhyUs(prev => ({ ...prev, badge: e.target.value }))}
                placeholder="The First Class Advantage"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Headline</label>
              <input
                type="text"
                value={whyUs.title || ''}
                onChange={(e) => setWhyUs(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Why 12,000+ Students Chose Us Over Others"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
              <textarea
                rows={3}
                value={whyUs.subtitle || ''}
                onChange={(e) => setWhyUs(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="We don't just lecture; we train you module-by-module until you score your target band..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white leading-relaxed"
              />
            </div>
          </div>

          {/* Diagnostic Banner Customizer */}
          <div className="pt-4 border-t border-slate-100">
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white rounded-2xl space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-400" />
                <h3 className="font-bold text-sm sm:text-base">Diagnostic Evaluation Banner (Bottom of Section)</h3>
              </div>
              <p className="text-xs text-slate-300">
                Customize the high-converting assessment banner displayed right under the feature cards.
              </p>

              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Banner Title</label>
                  <input
                    type="text"
                    value={whyUs.diagnosticTitle || ''}
                    onChange={(e) => setWhyUs(prev => ({ ...prev, diagnosticTitle: e.target.value }))}
                    placeholder="Unsure About Your Current IELTS Band Level?"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Banner Description Text</label>
                  <textarea
                    rows={2}
                    value={whyUs.diagnosticText || ''}
                    onChange={(e) => setWhyUs(prev => ({ ...prev, diagnosticText: e.target.value }))}
                    placeholder="Take our 45-minute Free Diagnostic Evaluation Test & get an accurate band score report..."
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1">Banner CTA Button Text</label>
                  <input
                    type="text"
                    value={whyUs.diagnosticCta || ''}
                    onChange={(e) => setWhyUs(prev => ({ ...prev, diagnosticCta: e.target.value }))}
                    placeholder="Take Free Diagnostic Test"
                    className="w-full px-3.5 py-2 rounded-xl bg-white/10 border border-white/20 text-yellow-300 font-bold placeholder-slate-400 text-xs sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {currentItem.id ? 'Edit Why Choose Us Feature' : 'Add New Feature Card'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-4">
              {/* Display on Homepage Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Display On Homepage (Visible)</span>
                  <span className="text-[11px] text-slate-500">Turn off to temporarily hide this feature card without deleting</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentItem.isActive !== false}
                    onChange={(e) => setCurrentItem(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feature Title *</label>
                <input
                  type="text"
                  required
                  value={currentItem.title}
                  onChange={(e) => setCurrentItem({ ...currentItem, title: e.target.value })}
                  placeholder="e.g. Daily 1-on-1 Speaking Cabins"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Feature Description *</label>
                <textarea
                  rows={4}
                  required
                  value={currentItem.description}
                  onChange={(e) => setCurrentItem({ ...currentItem, description: e.target.value })}
                  placeholder="Explain why this feature gives students an advantage..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                >
                  Save Feature
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
