'use client';
import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Edit3,
  Trash2,
  Calendar,
  Clock,
  Users,
  X,
  Eye,
  EyeOff,
  Flame,
  Settings,
  Save,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function AdminBatchesPage() {
  const [activeTab, setActiveTab] = useState('batches'); // 'batches' | 'settings'
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [config, setConfig] = useState({
    badge: 'Admissions Open',
    title: 'Upcoming IELTS & PTE Batches',
    subtitle: 'Small batch size (max 15 students per batch) to ensure individualized attention. Secure your preferred timing before seats fill out.',
    ctaText: 'Reserve Seat Now',
    show: true
  });

  const defaultBatch = {
    title: '',
    target: 'Full 4-Module Preparation',
    timing: '10:00 AM - 1:00 PM',
    startDate: 'Upcoming Monday',
    mode: 'Offline Classroom',
    seatsLeft: '5 Seats Remaining',
    status: 'Open',
    isActive: true
  };

  const [currentBatch, setCurrentBatch] = useState(defaultBatch);

  useEffect(() => {
    fetchBatches();
  }, []);

  async function fetchBatches() {
    try {
      const res = await fetch('/api/admin/batches');
      const data = await res.json();
      if (data) {
        setBatches(Array.isArray(data) ? data : (data.batches || []));
        if (data.config) {
          setConfig({
            badge: data.config.badge || 'Admissions Open',
            title: data.config.title || 'Upcoming IELTS & PTE Batches',
            subtitle: data.config.subtitle || 'Small batch size (max 15 students per batch)...',
            ctaText: data.config.ctaText || 'Reserve Seat Now',
            show: data.config.show !== false
          });
        }
      }
    } catch (e) {
      setError('Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentBatch(defaultBatch);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setCurrentBatch({
      ...b,
      isActive: b.isActive !== false
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this batch?')) return;
    try {
      const res = await fetch(`/api/admin/batches?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setBatches(data.batches || []);
        setSuccess('Batch deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete batch');
    }
  };

  // Toggle active visibility for individual batch
  const handleToggleActive = async (id) => {
    try {
      // Optimistic update
      setBatches(prev => prev.map(b => b.id === id ? { ...b, isActive: b.isActive === false ? true : false } : b));

      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active', id })
      });
      const data = await res.json();
      if (res.ok && data.batches) {
        setBatches(data.batches);
        setSuccess('Batch visibility updated!');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      setError('Failed to update batch visibility');
    }
  };

  // Toggle whole section visibility on homepage
  const handleToggleSectionShow = async () => {
    const nextShow = !config.show;
    setConfig(prev => ({ ...prev, show: nextShow }));
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config: { ...config, show: nextShow }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Batches section is now ${nextShow ? 'VISIBLE' : 'HIDDEN'} on homepage!`);
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
      const res = await fetch('/api/admin/batches', {
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

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentBatch.title) {
      alert('Batch title is required');
      return;
    }

    try {
      const res = await fetch('/api/admin/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentBatch),
      });

      const data = await res.json();
      if (res.ok) {
        setBatches(data.batches);
        setIsModalOpen(false);
        setSuccess('Batch saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Network error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeCount = batches.filter(b => b.isActive !== false).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Section Visibility & Status Controller Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            config.show ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">
                Upcoming Batches & Timings
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                #batches
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
                ? `Active on Homepage: Displaying ${activeCount} of ${batches.length} batches.`
                : 'Section is currently turned OFF. No batches will appear on your website until enabled.'}
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
            title="Toggle whether the Batches section appears on the homepage"
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
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Batch</span>
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
          onClick={() => setActiveTab('batches')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'batches'
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Batches Schedule ({batches.length})</span>
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

      {/* TAB 1: BATCHES SCHEDULE LIST */}
      {activeTab === 'batches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {batches.length} total batches ({activeCount} visible on website, {batches.length - activeCount} hidden)
            </span>
            <span className="text-[11px] text-slate-400">
              💡 Click the "Visible / Hidden" button on any card to toggle its appearance on the homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {batches.map((batch) => {
              const isCardActive = batch.isActive !== false;
              return (
                <div
                  key={batch.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                    isCardActive ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/60 opacity-80'
                  }`}
                >
                  {/* Top Status Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isCardActive ? 'bg-gradient-to-r from-emerald-500 to-teal-600' : 'bg-slate-300'
                  }`} />

                  <div>
                    {/* Top Row: Status badge & 1-Click Quick Eye Toggle */}
                    <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
                      <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                        {batch.status}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(batch.id)}
                        className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          isCardActive
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                        }`}
                        title={isCardActive ? 'Click to hide this batch from website' : 'Click to show this batch on website'}
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

                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{batch.title}</h3>
                    <p className="text-xs text-blue-900 font-semibold mt-1">{batch.target}</p>

                    <div className="space-y-1.5 mt-4 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{batch.timing}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="font-bold text-slate-800">{batch.startDate}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="text-emerald-700 font-bold">{batch.seatsLeft}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-200/50">
                        Mode: {batch.mode}
                      </div>
                    </div>
                  </div>

                  {/* Actions footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isCardActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      {isCardActive ? '● Live' : '○ Hidden'}
                    </span>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(batch)}
                        className="px-2.5 py-1 text-blue-900 hover:bg-blue-50 rounded-lg text-xs font-bold border border-blue-200/60 flex items-center gap-1 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(batch.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200/60 transition-colors"
                        title="Delete Batch"
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

      {/* TAB 2: SECTION HEADINGS & SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-emerald-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Batches Section Customizer</h2>
                <p className="text-xs text-slate-500">Edit badge, headline, subtitle, CTA text, and toggle section visibility on homepage.</p>
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
                Show Upcoming Batches Section on Homepage
              </span>
              <span className="text-[11px] text-slate-500">
                When enabled, the batches table is rendered on the public website. Turn off to hide it completely.
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
                placeholder="Admissions Open"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Headline</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Upcoming IELTS & PTE Batches"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
              <textarea
                rows={3}
                value={config.subtitle}
                onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Small batch size (max 15 students per batch)..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Batch Reserve CTA Button Text</label>
              <input
                type="text"
                value={config.ctaText || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, ctaText: e.target.value }))}
                placeholder="Reserve Seat Now"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>
          </div>
        </form>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-900">
                {currentBatch.id ? 'Edit Batch' : 'Add New Batch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              {/* Display on Homepage Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Display On Homepage (Visible)</span>
                  <span className="text-[11px] text-slate-500">Turn off to temporarily hide this batch without deleting</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentBatch.isActive !== false}
                    onChange={(e) => setCurrentBatch(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Batch Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Early Morning Master Batch"
                  value={currentBatch.title}
                  onChange={(e) => setCurrentBatch({ ...currentBatch, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Module / Candidate</label>
                <input
                  type="text"
                  placeholder="e.g. Working Professionals & PR"
                  value={currentBatch.target}
                  onChange={(e) => setCurrentBatch({ ...currentBatch, target: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Timing</label>
                  <input
                    type="text"
                    placeholder="7:00 AM - 9:30 AM"
                    value={currentBatch.timing}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, timing: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="text"
                    placeholder="Upcoming Monday"
                    value={currentBatch.startDate}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, startDate: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mode</label>
                  <input
                    type="text"
                    placeholder="Offline / Online"
                    value={currentBatch.mode}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, mode: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Seats Status</label>
                  <input
                    type="text"
                    placeholder="4 Seats Remaining"
                    value={currentBatch.seatsLeft}
                    onChange={(e) => setCurrentBatch({ ...currentBatch, seatsLeft: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Status Badge</label>
                <select
                  value={currentBatch.status}
                  onChange={(e) => setCurrentBatch({ ...currentBatch, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                >
                  <option value="Open">Open</option>
                  <option value="Filling Fast">Filling Fast</option>
                  <option value="Almost Full">Almost Full</option>
                  <option value="Weekend Special">Weekend Special</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
