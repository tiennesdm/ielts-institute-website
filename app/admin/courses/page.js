'use client';
import { useState, useEffect } from 'react';
import {
  PlusCircle,
  Edit3,
  Trash2,
  Check,
  Clock,
  DollarSign,
  Image as ImageIcon,
  X,
  Save,
  AlertCircle,
  Eye,
  EyeOff,
  Settings,
  BookOpen,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminCoursesPage() {
  const [activeTab, setActiveTab] = useState('courses'); // 'courses' | 'settings'
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [config, setConfig] = useState({
    badge: 'Target Band 8+ Programs',
    title: 'Our Certified IELTS & English Programs',
    subtitle: 'Tailored curriculums designed by former IELTS examiners. Choose the program that fits your target band, immigration deadline, or study abroad dream.',
    ctaText: 'Book Free Demo For This Course',
    show: true
  });

  const defaultCourse = {
    title: '',
    tag: 'Popular',
    targetBand: '7.5+ Bands',
    duration: '8 Weeks',
    fee: '₹14,999',
    mode: 'Offline & Live Online',
    description: '',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    features: ['Daily 1-on-1 Speaking', 'Daily Writing Task 1 & 2 Evaluation', 'Official Cambridge Books 1-19'],
    popular: false,
    isActive: true
  };

  const [currentCourse, setCurrentCourse] = useState(defaultCourse);
  const [featureInput, setFeatureInput] = useState('');

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    try {
      const res = await fetch('/api/admin/courses');
      const data = await res.json();
      if (data) {
        setCourses(Array.isArray(data) ? data : (data.courses || []));
        if (data.config) {
          setConfig({
            badge: data.config.badge || 'Target Band 8+ Programs',
            title: data.config.title || 'Our Certified IELTS & English Programs',
            subtitle: data.config.subtitle || 'Tailored curriculums designed by former IELTS examiners...',
            ctaText: data.config.ctaText || 'Book Free Demo For This Course',
            show: data.config.show !== false
          });
        }
      }
    } catch (e) {
      setError('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentCourse(defaultCourse);
    setFeatureInput('');
    setIsEditing(true);
  };

  const handleOpenEdit = (course) => {
    setCurrentCourse({
      ...course,
      isActive: course.isActive !== false,
      features: course.features || []
    });
    setFeatureInput('');
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this course?')) return;
    try {
      const res = await fetch(`/api/admin/courses?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses || []);
        setSuccess('Course deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  // Toggle active visibility for individual course
  const handleToggleActive = async (id) => {
    try {
      // Optimistic update
      setCourses(prev => prev.map(c => c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c));

      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active', id })
      });
      const data = await res.json();
      if (res.ok && data.courses) {
        setCourses(data.courses);
        setSuccess('Course card visibility updated!');
        setTimeout(() => setSuccess(''), 2500);
      }
    } catch (err) {
      setError('Failed to update course visibility');
    }
  };

  // Toggle whole section visibility on homepage
  const handleToggleSectionShow = async () => {
    const nextShow = !config.show;
    setConfig(prev => ({ ...prev, show: nextShow }));
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config: { ...config, show: nextShow }
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(`Courses section is now ${nextShow ? 'VISIBLE' : 'HIDDEN'} on homepage!`);
        setTimeout(() => setSuccess(''), 3500);
      }
    } catch (err) {
      setError('Failed to update section visibility');
    } finally {
      setSavingConfig(false);
    }
  };

  // Save section headers and config
  const handleSaveConfig = async (e) => {
    e.preventDefault();
    setSavingConfig(true);
    try {
      const res = await fetch('/api/admin/courses', {
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await processAndUploadImage(file);
      if (dataUrl) {
        setCurrentCourse(prev => ({ ...prev, image: dataUrl }));
      }

      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setCurrentCourse(prev => ({ ...prev, image: data.url }));
      }
    } catch (err) {
      console.warn('Upload fallback to client data URL:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setCurrentCourse(prev => ({
      ...prev,
      features: [...prev.features, featureInput.trim()]
    }));
    setFeatureInput('');
  };

  const handleRemoveFeature = (idx) => {
    setCurrentCourse(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== idx)
    }));
  };

  const handleSaveCourse = async (e) => {
    e.preventDefault();
    if (!currentCourse.title) {
      alert('Course title is required');
      return;
    }

    try {
      const res = await fetch('/api/admin/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentCourse),
      });

      const data = await res.json();
      if (res.ok) {
        setCourses(data.courses);
        setIsEditing(false);
        setSuccess('Course saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save');
      }
    } catch (err) {
      setError('Error saving course');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const activeCount = courses.filter(c => c.isActive !== false).length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Section Visibility & Status Controller Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl shadow-md border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold shrink-0 ${
            config.show ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
          }`}>
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-black text-white">
                Courses & Band Programs
              </h1>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-slate-300">
                #courses
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
                ? `Active on Homepage: Displaying ${activeCount} of ${courses.length} courses.`
                : 'Section is currently turned OFF. No courses will appear on your website until enabled.'}
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
            title="Toggle whether the Courses section appears on the homepage"
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
            <span>Add New Course</span>
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
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
            activeTab === 'courses'
              ? 'bg-blue-950 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Courses Catalog ({courses.length})</span>
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

      {/* TAB 1: COURSES CATALOG */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Showing {courses.length} total courses ({activeCount} visible on website, {courses.length - activeCount} hidden)
            </span>
            <span className="text-[11px] text-slate-400">
              💡 Click the "Visible / Hidden" button on any card to toggle its appearance on the homepage.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const isCardActive = course.isActive !== false;
              return (
                <div
                  key={course.id}
                  className={`bg-white rounded-2xl border overflow-hidden shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md relative ${
                    isCardActive ? 'border-slate-200' : 'border-slate-200/60 bg-slate-50/60 opacity-80'
                  }`}
                >
                  {/* Top Status Accent Bar */}
                  <div className={`absolute top-0 left-0 right-0 h-1.5 z-10 ${
                    isCardActive ? 'bg-gradient-to-r from-red-600 via-amber-500 to-blue-900' : 'bg-slate-300'
                  }`} />

                  <div>
                    {/* Course Image Header with Status Overlays */}
                    <div className="relative h-44 w-full bg-slate-100">
                      <img
                        src={course.image || 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop'}
                        alt={course.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent"></div>

                      {/* Tag Badge */}
                      {course.tag && (
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                          {course.tag}
                        </span>
                      )}

                      {/* 1-Click Quick Toggle Eye Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleActive(course.id)}
                        className={`absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-black shadow-md flex items-center gap-1 transition-all ${
                          isCardActive
                            ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                            : 'bg-slate-800/90 hover:bg-slate-900 text-slate-200'
                        }`}
                        title={isCardActive ? 'Click to hide course from website' : 'Click to show course on website'}
                      >
                        {isCardActive ? (
                          <>
                            <Eye className="w-3.5 h-3.5" />
                            <span>Visible</span>
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3.5 h-3.5" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>

                      {/* Bottom Info inside image */}
                      <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-white text-xs">
                        <span className="font-bold text-amber-300">{course.targetBand}</span>
                        <span className="text-[11px] text-slate-200">{course.duration}</span>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="font-bold text-slate-900 text-base leading-snug">{course.title}</h3>
                      <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pb-2.5 border-b border-slate-100">
                        <span className="text-slate-500">{course.mode}</span>
                        <span className="text-base font-black text-red-600">{course.fee}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      {/* Features Preview */}
                      <ul className="mt-3 space-y-1 text-[11px] text-slate-500">
                        {course.features?.slice(0, 3).map((f, i) => (
                          <li key={i} className="flex items-center gap-1.5 truncate">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      isCardActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${isCardActive ? 'bg-emerald-600 animate-pulse' : 'bg-slate-400'}`}></span>
                      <span>{isCardActive ? 'Live on Page' : 'Hidden from Page'}</span>
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenEdit(course)}
                        className="px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-900 text-xs font-bold transition-colors flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-colors flex items-center gap-1"
                        title="Delete Course"
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
              <BookOpen className="w-5 h-5 text-red-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Courses Section Customizer</h2>
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
                Show Courses Section on Homepage
              </span>
              <span className="text-[11px] text-slate-500">
                When enabled, the courses catalog is displayed on the public website. Turn off to hide it completely.
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
                placeholder="Target Band 8+ Programs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Main Headline</label>
              <input
                type="text"
                value={config.title}
                onChange={(e) => setConfig(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Our Certified IELTS & English Programs"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold bg-white"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Section Subtitle / Description</label>
              <textarea
                rows={3}
                value={config.subtitle}
                onChange={(e) => setConfig(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Tailored curriculums designed by former IELTS examiners..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">Course Card CTA Button Text</label>
              <input
                type="text"
                value={config.ctaText || ''}
                onChange={(e) => setConfig(prev => ({ ...prev, ctaText: e.target.value }))}
                placeholder="Book Free Demo For This Course"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm bg-white"
              />
            </div>
          </div>
        </form>
      )}

      {/* Edit / Add Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {currentCourse.id ? 'Edit Course' : 'Add New Course'}
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCourse} className="space-y-4">
              {/* Display on Homepage Toggle */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-800 block">Display On Homepage (Visible)</span>
                  <span className="text-[11px] text-slate-500">Turn off to temporarily hide this course without deleting</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={currentCourse.isActive !== false}
                    onChange={(e) => setCurrentCourse(prev => ({ ...prev, isActive: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={currentCourse.title}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, title: e.target.value })}
                  placeholder="e.g. IELTS Academic Comprehensive"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Badge / Tag
                  </label>
                  <input
                    type="text"
                    value={currentCourse.tag || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, tag: e.target.value })}
                    placeholder="Most Popular"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Band
                  </label>
                  <input
                    type="text"
                    value={currentCourse.targetBand || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, targetBand: e.target.value })}
                    placeholder="Target 7.5 - 8.5 Bands"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Course Fee
                  </label>
                  <input
                    type="text"
                    value={currentCourse.fee || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, fee: e.target.value })}
                    placeholder="₹14,999"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Duration & Schedule
                  </label>
                  <input
                    type="text"
                    value={currentCourse.duration || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, duration: e.target.value })}
                    placeholder="8 Weeks (Daily 3 Hours)"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Delivery Mode
                  </label>
                  <input
                    type="text"
                    value={currentCourse.mode || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, mode: e.target.value })}
                    placeholder="Offline & Live Online"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={currentCourse.description || ''}
                  onChange={(e) => setCurrentCourse({ ...currentCourse, description: e.target.value })}
                  placeholder="Summary of what the course covers"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                />
              </div>

              {/* Course Image */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Course Image (URL or Direct Upload)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentCourse.image || ''}
                    onChange={(e) => setCurrentCourse({ ...currentCourse, image: e.target.value })}
                    placeholder="Image URL"
                    className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs"
                  />
                  <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 border rounded-xl text-xs font-bold text-slate-700 cursor-pointer shrink-0">
                    <ImageIcon className="w-3.5 h-3.5 inline mr-1" />
                    <span>{uploading ? 'Uploading...' : 'Upload File'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {currentCourse.image && (
                  <div className="mt-2 relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-slate-100 flex items-center justify-center">
                    <img
                      src={currentCourse.image}
                      alt="Course Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop';
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Bullet Features Manager */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Key Features / Curriculum Highlights
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    placeholder="e.g. Daily 1-on-1 Speaking cabin test"
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
                    className="px-3 py-1.5 bg-blue-900 text-white rounded-lg text-xs font-bold"
                  >
                    Add
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  {currentCourse.features?.map((f, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 bg-slate-100 text-slate-800 text-xs px-2.5 py-1 rounded-lg"
                    >
                      <span>{f}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(i)}
                        className="text-slate-400 hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-md"
                >
                  Save Course
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
