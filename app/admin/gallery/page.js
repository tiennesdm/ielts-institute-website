'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Image as ImageIcon, UploadCloud, X, CheckCircle2, Eye, Filter } from 'lucide-react';

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeCategory, setActiveCategory] = useState('ALL');
  const [showAddModal, setShowAddModal] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [newItem, setNewItem] = useState({
    title: '',
    category: 'Classrooms & Labs',
    image: '',
    description: ''
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
      setGallery(data || []);
    } catch (e) {
      setError('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setNewItem(prev => ({ ...prev, image: data.url }));
      } else {
        alert(data.error || 'Failed to upload image file');
      }
    } catch (err) {
      alert('Upload failed');
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
        setNewItem({ title: '', category: 'Classrooms & Labs', image: '', description: '' });
        setSuccess('New photo added to gallery successfully!');
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

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Photo Gallery & Campus Media
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Upload new classroom photos, visa approval celebrations, and campus lab pictures.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Upload New Photo</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
          {success}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setActiveCategory('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors ${
              activeCategory === cat
                ? 'bg-blue-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm flex flex-col justify-between group"
          >
            <div>
              <div className="relative h-48 w-full bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                  {item.category}
                </span>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-slate-900 text-sm leading-snug">{item.title}</h3>
                {item.description && (
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{item.description}</p>
                )}
              </div>
            </div>

            <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">ID: {item.id}</span>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Upload Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6">
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
                    <img
                      src={newItem.image}
                      alt="Preview"
                      className="h-32 w-full object-cover rounded-xl border border-slate-200 shadow-sm"
                    />
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
