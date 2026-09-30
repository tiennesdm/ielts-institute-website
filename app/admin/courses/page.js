'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Check, Clock, DollarSign, Image as ImageIcon, X, Save, AlertCircle } from 'lucide-react';
import { processAndUploadImage } from '@/lib/imageUtils';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
      setCourses(data || []);
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
    setCurrentCourse({ ...course, features: course.features || [] });
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
      }
    } catch (err) {
      setError('Failed to delete course');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // 1. Instant client-side compression and preview
      const dataUrl = await processAndUploadImage(file);
      if (dataUrl) {
        setCurrentCourse(prev => ({ ...prev, image: dataUrl }));
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Manage Courses & Band Programs
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, update fees, duration, syllabuses, and badges for your IELTS & PTE courses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Course</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
          {success}
        </div>
      )}

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 w-full bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                {course.tag && (
                  <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                    {course.tag}
                  </span>
                )}
              </div>

              <div className="p-5">
                <h3 className="font-bold text-slate-900 text-base">{course.title}</h3>
                <div className="flex items-center justify-between text-xs text-slate-500 mt-2 pb-3 border-b border-slate-100">
                  <span className="font-semibold text-blue-900">{course.targetBand}</span>
                  <span>{course.duration}</span>
                </div>
                <div className="text-base font-black text-red-600 mt-2">
                  {course.fee}
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2">
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

            {/* Actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
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
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

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
