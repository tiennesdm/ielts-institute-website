'use client';
import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Edit3,
  Trash2,
  Trophy,
  Image as ImageIcon,
  X,
  Award,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Sliders,
  Settings,
  Sparkles,
  Save,
  Check
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminResultsPage() {
  const [activeTab, setActiveTab] = useState('results'); // 'results' | 'settings'
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [config, setConfig] = useState({
    badge: 'Hall of Fame & High Achievers',
    title: 'Real Students, Real 8+ Band Results',
    subtitle: 'Hundreds of our students clear their target band scores on their first attempt every month and secure admissions in top Ivy League & Global Universities.',
    show: true
  });

  const defaultItem = {
    studentName: '',
    overallBand: '8.0',
    examType: 'IELTS Academic',
    scores: {
      listening: '8.5',
      reading: '8.5',
      writing: '7.5',
      speaking: '8.0'
    },
    destination: 'University of Toronto, Canada',
    flag: '🇨🇦',
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    quote: 'The 1-on-1 speaking cabins and daily essay feedback helped me score 8 bands in my very first attempt!',
    admitted: 'Admitted & Visa Granted',
    isActive: true
  };

  const [currentResult, setCurrentResult] = useState(defaultItem);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      const res = await fetch('/api/admin/results');
      const data = await res.json();
      if (data) {
        setResults(Array.isArray(data) ? data : (data.results || []));
        if (data.config) {
          setConfig({
            badge: data.config.badge || 'Hall of Fame & High Achievers',
            title: data.config.title || 'Real Students, Real 8+ Band Results',
            subtitle: data.config.subtitle || 'Hundreds of our students clear their target band scores on their first attempt every month and secure admissions in top Ivy League & Global Universities.',
            show: data.config.show !== false
          });
        }
      }
    } catch (e) {
      setError('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentResult(defaultItem);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
    setCurrentResult({
      ...item,
      isActive: item.isActive !== false,
      scores: item.scores || { listening: '8.0', reading: '8.0', writing: '7.0', speaking: '7.5' }
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this result?')) return;
    try {
      const res = await fetch(`/api/admin/results?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results || []);
        setSuccess('Result deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  // Toggle active visibility for individual student card
  const handleToggleActive = async (id) => {
    try {
      // Optimistic update
      setResults(prev => prev.map(r => r.id === id ? { ...r, isActive: r.isActive === false ? true : false } : r));

      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active', id })
      });
      const data = await res.json();
      if (res.ok && data.results) {
        setResults(data.results);
        setSuccess('Student card visibility updated!');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      setError('Failed to update student visibility');
    }
  };

  // Toggle whole section visibility on homepage
  const handleToggleSectionShow = async () => {
    const nextShow = !config.show;
    setConfig(prev => ({ ...prev, show: nextShow }));
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config: { ...config, show: nextShow }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`8+ Band Results section is now ${nextShow ? 'VISIBLE' : 'HIDDEN'} on homepage!`);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Failed to update section visibility');
    } finally {
      setSavingConfig(false);
    }
  };

  // Save section headers and badges
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/results', {
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await processAndUploadImage(file, 800, 800, 0.85);
      if (dataUrl) {
        setCurrentResult(prev => ({ ...prev, photo: dataUrl }));
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setCurrentResult(prev => ({ ...prev, photo: data.url }));
      }
    } catch (err) {
      console.warn('Upload fallback to client data URL:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentResult.studentName || !currentResult.overallBand) {
      alert('Student name and overall band are required');
      return;
    }

    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentResult),
      });

      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        setIsModalOpen(false);
        setSuccess('Student result saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save result');
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

  const activeCount = results.filter(r => r.isActive !== false).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Section Visibility & Status Controller Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            config.show ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">
                8+ Band Results (Hall of Fame)
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                #results
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
                ? `Active on Homepage: Displaying ${activeCount} of ${results.length} student result cards.`
                : 'Section is currently turned OFF. High scorers will not appear on your website until enabled.'}
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
            title="Toggle whether the 8+ Band Results section appears on the homepage"
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
            <span>Add High Scorer</span>
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
          onClick={() => setActiveTab('results')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'results'
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>High Scorer Cards ({results.length})</span>
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

      {/* TAB 1: RESULTS CARDS LIST */}
      {activeTab === 'results' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {results.length} total achievers ({activeCount} visible on website, {results.length - activeCount} hidden)
            </span>
            <span className="text-[11px] text-slate-400">
              💡 Click the "Visible / Hidden" button on any card to toggle its appearance on the homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {results.map((res) => {
              const isCardActive = res.isActive !== false;
              return (
                <div
                  key={res.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden ${
                    isCardActive
                      ? 'border-slate-200/90'
                      : 'border-slate-200/60 bg-slate-50/60 opacity-80'
                  }`}
                >
                  {/* Top Status Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                    isCardActive
                      ? 'bg-gradient-to-r from-red-600 via-amber-500 to-blue-900'
                      : 'bg-slate-300'
                  }`} />

                  <div>
                    {/* Top Row: Visibility Switch & Badge */}
                    <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-100">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                        isCardActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isCardActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
                        <span>{isCardActive ? 'Visible on Page' : 'Hidden from Page'}</span>
                      </span>

                      <button
                        type="button"
                        onClick={() => handleToggleActive(res.id)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          isCardActive
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-300'
                        }`}
                        title={isCardActive ? 'Click to hide this student card from homepage' : 'Click to show this student card on homepage'}
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

                    {/* Student Info & Band Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={res.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop'}
                          alt={res.studentName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                            {res.studentName}
                          </h3>
                          <p className="text-[11px] text-slate-500 truncate">{res.examType}</p>
                          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5 truncate">
                            <span>{res.flag}</span>
                            <span className="truncate">{res.destination}</span>
                          </span>
                        </div>
                      </div>

                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-red-600 to-rose-600 text-white flex flex-col items-center justify-center font-black shadow-md shrink-0">
                        <span className="text-base leading-none">{res.overallBand}</span>
                        <span className="text-[8px] uppercase tracking-wider">Band</span>
                      </div>
                    </div>

                    {/* Module Scores Grid */}
                    {res.scores && (
                      <div className="grid grid-cols-4 gap-1 mt-4 bg-slate-50 p-2 rounded-xl text-center text-[10px] border border-slate-100">
                        <div><span className="text-slate-400 block font-bold">L</span><strong>{res.scores.listening}</strong></div>
                        <div><span className="text-slate-400 block font-bold">R</span><strong>{res.scores.reading}</strong></div>
                        <div><span className="text-slate-400 block font-bold">W</span><strong>{res.scores.writing}</strong></div>
                        <div><span className="text-slate-400 block font-bold">S</span><strong>{res.scores.speaking}</strong></div>
                      </div>
                    )}

                    {/* Quote */}
                    <p className="text-xs text-slate-600 italic mt-3 line-clamp-2">
                      "{res.quote}"
                    </p>
                  </div>

                  {/* Card Footer: Admission text & Edit/Delete buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">{res.admitted}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenEdit(res)}
                        className="px-2.5 py-1 text-blue-900 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1 border border-blue-200/60 transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg border border-red-200/60 transition-colors"
                        title="Delete Result"
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

      {/* TAB 2: SECTION HEADINGS & BADGES SETTINGS */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveConfig} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">8+ Band Results Section Customizer</h2>
                <p className="text-xs text-slate-500">Edit badge, main headline, description, and homepage section visibility.</p>
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
                Show 8+ Band Results Section on Homepage
              </span>
              <span className="text-[11px] text-slate-500">
                When enabled, the Hall of Fame section is rendered on the public website. Turn off to hide it completely.
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
                placeholder="Hall of Fame & High Achievers"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Headline</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Real Students, Real 8+ Band Results"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
              <textarea
                rows={3}
                value={config.subtitle}
                onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Hundreds of our students clear their target band scores on their first attempt..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white leading-relaxed"
              />
            </div>
          </div>
        </form>
      )}

      {/* Add / Edit Result Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {currentResult.id ? 'Edit High Achiever Result' : 'Add New High Achiever'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Display on Homepage Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Display On Homepage (Visible)</span>
                  <span className="text-[11px] text-slate-500">Turn off to temporarily hide this student card without deleting</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentResult.isActive !== false}
                    onChange={(e) => setCurrentResult(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={currentResult.studentName}
                  onChange={(e) => setCurrentResult({ ...currentResult, studentName: e.target.value })}
                  placeholder="e.g. Navjot Kaur"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Overall Band *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentResult.overallBand}
                    onChange={(e) => setCurrentResult({ ...currentResult, overallBand: e.target.value })}
                    placeholder="8.5"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-red-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={currentResult.examType}
                    onChange={(e) => setCurrentResult({ ...currentResult, examType: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  >
                    <option value="IELTS Academic">IELTS Academic</option>
                    <option value="IELTS General Training">IELTS General Training</option>
                    <option value="PTE Academic">PTE Academic (79+)</option>
                    <option value="CD-IELTS">CD-IELTS</option>
                    <option value="Duolingo English">Duolingo English (130+)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Admission / Status Text
                  </label>
                  <input
                    type="text"
                    value={currentResult.admitted || ''}
                    onChange={(e) => setCurrentResult({ ...currentResult, admitted: e.target.value })}
                    placeholder="e.g. Admitted & Visa Granted"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Country Destination & Flag
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={currentResult.flag || '🇨🇦'}
                    onChange={(e) => setCurrentResult({ ...currentResult, flag: e.target.value })}
                    className="w-14 px-2 py-2 rounded-xl border border-slate-200 text-center text-sm"
                    placeholder="🇨🇦"
                  />
                  <input
                    type="text"
                    value={currentResult.destination || ''}
                    onChange={(e) => setCurrentResult({ ...currentResult, destination: e.target.value })}
                    placeholder="e.g. University of Toronto, Canada"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              {/* Module scores row */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Individual Module Scores (L / R / W / S)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Listening</span>
                    <input
                      type="text"
                      value={currentResult.scores?.listening || ''}
                      onChange={(e) => setCurrentResult({
                        ...currentResult,
                        scores: { ...currentResult.scores, listening: e.target.value }
                      })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Reading</span>
                    <input
                      type="text"
                      value={currentResult.scores?.reading || ''}
                      onChange={(e) => setCurrentResult({
                        ...currentResult,
                        scores: { ...currentResult.scores, reading: e.target.value }
                      })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Writing</span>
                    <input
                      type="text"
                      value={currentResult.scores?.writing || ''}
                      onChange={(e) => setCurrentResult({
                        ...currentResult,
                        scores: { ...currentResult.scores, writing: e.target.value }
                      })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold">Speaking</span>
                    <input
                      type="text"
                      value={currentResult.scores?.speaking || ''}
                      onChange={(e) => setCurrentResult({
                        ...currentResult,
                        scores: { ...currentResult.scores, speaking: e.target.value }
                      })}
                      className="w-full px-2 py-1.5 border rounded-lg text-xs font-bold text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Photo */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Photo (Upload or URL)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentResult.photo || ''}
                    onChange={(e) => setCurrentResult({ ...currentResult, photo: e.target.value })}
                    placeholder="Photo URL"
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 border rounded-xl text-xs font-bold text-slate-700 cursor-pointer shrink-0">
                    <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                    <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                </div>
                {currentResult.photo && (
                  <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-white">
                      <img
                        src={currentResult.photo}
                        alt="Student"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop';
                        }}
                      />
                    </div>
                    <span className="text-[11px] text-slate-500 font-medium">Selected student portrait preview</span>
                  </div>
                )}
              </div>

              {/* Quote */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Student Quote / Experience
                </label>
                <textarea
                  rows={2}
                  value={currentResult.quote || ''}
                  onChange={(e) => setCurrentResult({ ...currentResult, quote: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

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
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                >
                  Save Result
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
