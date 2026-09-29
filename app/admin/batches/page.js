'use client';
import { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Calendar, Clock, Users, X } from 'lucide-react';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');

  const defaultBatch = {
    title: '',
    target: 'Full 4-Module Preparation',
    timing: '10:00 AM - 1:00 PM',
    startDate: 'Upcoming Monday',
    mode: 'Offline Classroom',
    seatsLeft: '5 Seats Remaining',
    status: 'Open'
  };

  const [currentBatch, setCurrentBatch] = useState(defaultBatch);

  useEffect(() => {
    fetchBatches();
  }, []);

  async function fetchBatches() {
    try {
      const res = await fetch('/api/admin/batches');
      const data = await res.json();
      setBatches(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentBatch(defaultBatch);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b) => {
    setCurrentBatch(b);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this batch?')) return;
    try {
      const res = await fetch(`/api/admin/batches?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setBatches(data.batches);
        setSuccess('Batch deleted');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentBatch.title) return;

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
      }
    } catch (err) {
      console.error(err);
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
            Upcoming Batches & Timings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish morning, evening, weekend batches and seat availability statuses.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Batch</span>
        </button>
      </div>

      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-bold">
          {success}
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {batches.map((batch) => (
          <div
            key={batch.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-200">
                  {batch.status}
                </span>
                <span className="text-[11px] text-slate-400">{batch.mode}</span>
              </div>

              <h3 className="font-bold text-slate-900 text-sm">{batch.title}</h3>
              <p className="text-xs text-blue-900 font-semibold mt-1">{batch.target}</p>

              <div className="space-y-1.5 mt-4 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{batch.timing}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-bold text-slate-800">{batch.startDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-bold">{batch.seatsLeft}</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => handleOpenEdit(batch)}
                className="p-1.5 text-blue-900 hover:bg-blue-50 rounded"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDelete(batch.id)}
                className="p-1.5 text-red-600 hover:bg-red-50 rounded"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b">
              <h3 className="text-lg font-black text-slate-900">
                {currentBatch.id ? 'Edit Batch' : 'Add New Batch'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
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

              <div className="flex justify-end gap-2 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl"
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
