'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Trophy, Image as ImageIcon, X, Award, CheckCircle2 } from 'lucide-react';

export default function AdminResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

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
    admitted: 'Admitted & Visa Granted'
  };

  const [currentResult, setCurrentResult] = useState(defaultItem);

  useEffect(() => {
    fetchResults();
  }, []);

  async function fetchResults() {
    try {
      const res = await fetch('/api/admin/results');
      const data = await res.json();
      setResults(data || []);
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
      }
    } catch (err) {
      setError('Delete failed');
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (res.ok && data.url) {
        setCurrentResult(prev => ({ ...prev, photo: data.url }));
      } else {
        alert(data.error || 'Failed to upload photo');
      }
    } catch (err) {
      alert('Upload error');
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Hall of Fame & High Achievers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Showcase your 8+ Band and 79+ PTE achievers with photos, module breakdown, and destination flags.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New High Scorer</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
          {success}
        </div>
      )}

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((res) => (
          <div
            key={res.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={res.photo}
                    alt={res.studentName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow"
                  />
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm leading-tight">
                      {res.studentName}
                    </h3>
                    <p className="text-[11px] text-slate-500">{res.examType}</p>
                    <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1 mt-0.5">
                      <span>{res.flag}</span>
                      <span>{res.destination}</span>
                    </span>
                  </div>
                </div>

                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex flex-col items-center justify-center font-black shadow-md">
                  <span className="text-base leading-none">{res.overallBand}</span>
                  <span className="text-[8px] uppercase">Band</span>
                </div>
              </div>

              {/* Module scores */}
              {res.scores && (
                <div className="grid grid-cols-4 gap-1 mt-4 bg-slate-50 p-2 rounded-lg text-center text-[10px]">
                  <div><span className="text-slate-400 block">L</span><strong>{res.scores.listening}</strong></div>
                  <div><span className="text-slate-400 block">R</span><strong>{res.scores.reading}</strong></div>
                  <div><span className="text-slate-400 block">W</span><strong>{res.scores.writing}</strong></div>
                  <div><span className="text-slate-400 block">S</span><strong>{res.scores.speaking}</strong></div>
                </div>
              )}

              <p className="text-xs text-slate-600 italic mt-3 line-clamp-2">
                "{res.quote}"
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">{res.admitted}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(res)}
                  className="p-1.5 text-blue-900 hover:bg-blue-50 rounded-lg text-xs font-bold flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(res.id)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900">
                {currentResult.id ? 'Edit Result' : 'Add High Achiever'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentResult.studentName}
                    onChange={(e) => setCurrentResult({ ...currentResult, studentName: e.target.value })}
                    placeholder="e.g. Harpreet Singh"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Overall Band Score *
                  </label>
                  <input
                    type="text"
                    required
                    value={currentResult.overallBand}
                    onChange={(e) => setCurrentResult({ ...currentResult, overallBand: e.target.value })}
                    placeholder="8.5 or 86"
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-red-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Exam Type
                  </label>
                  <select
                    value={currentResult.examType}
                    onChange={(e) => setCurrentResult({ ...currentResult, examType: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs bg-white"
                  >
                    <option value="IELTS Academic">IELTS Academic</option>
                    <option value="IELTS General Training">IELTS General Training</option>
                    <option value="PTE Academic">PTE Academic</option>
                    <option value="CD-IELTS">CD-IELTS</option>
                  </select>
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
                      placeholder="e.g. Canada / University of Toronto"
                      className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Module scores row */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Individual Module Scores (L / R / W / S)
                </label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Listening</span>
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
                    <span className="text-[10px] text-slate-400 block">Reading</span>
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
                    <span className="text-[10px] text-slate-400 block">Writing</span>
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
                    <span className="text-[10px] text-slate-400 block">Speaking</span>
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
