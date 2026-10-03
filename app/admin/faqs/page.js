'use client';
import { useState, useEffect } from 'react';
import {
  HelpCircle,
  PlusCircle,
  Edit3,
  Trash2,
  Save,
  X,
  Search,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const defaultFaq = {
    id: '',
    question: '',
    answer: ''
  };

  const [currentFaq, setCurrentFaq] = useState(defaultFaq);

  useEffect(() => {
    fetchFaqs();
  }, []);

  async function fetchFaqs() {
    try {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      setFaqs(data || []);
      if (data && data.length > 0) {
        setExpandedId(data[0].id);
      }
    } catch (e) {
      setError('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentFaq({ id: '', question: '', answer: '' });
    setIsEditing(true);
  };

  const handleOpenEdit = (faq) => {
    setCurrentFaq({ ...faq });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this FAQ item?')) return;
    try {
      const res = await fetch(`/api/admin/faqs?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.faqs || []);
        setSuccess('FAQ deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete FAQ');
      }
    } catch (err) {
      setError('Failed to delete FAQ');
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!currentFaq.question.trim() || !currentFaq.answer.trim()) {
      setError('Both Question and Answer are required');
      return;
    }

    try {
      setError('');
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentFaq),
      });

      const data = await res.json();
      if (res.ok) {
        setFaqs(data.faqs || []);
        setIsEditing(false);
        setSuccess('FAQ saved successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save FAQ');
      }
    } catch (err) {
      setError('Failed to save FAQ');
    }
  };

  const filteredFaqs = faqs.filter(
    (f) =>
      f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-red-600 rounded-xl">
              <HelpCircle className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Manage Frequently Asked Questions (FAQ)
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add, update, or remove student inquiries and official institute answers displayed on the homepage.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Search & Counter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search FAQs by question or answer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
          />
        </div>
        <div className="text-xs font-bold text-slate-500">
          Total Questions: <span className="text-slate-900 font-black">{faqs.length}</span>
        </div>
      </div>

      {/* FAQs List */}
      {loading ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredFaqs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-slate-700 text-sm">No FAQs Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {searchQuery ? 'No questions matched your search criteria.' : 'Click "Add New FAQ" to create your first question and answer.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id || idx}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
              >
                <div className="p-4 sm:p-5 flex items-start justify-between gap-4">
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                    className="flex-1 flex items-start gap-3 text-left group"
                  >
                    <span className="w-6 h-6 rounded-lg bg-red-50 text-red-600 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-red-600 group-hover:text-white transition-colors">
                      Q{idx + 1}
                    </span>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-red-600 transition-colors">
                        {faq.question}
                      </h3>
                      {isExpanded ? (
                        <p className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                          {faq.answer}
                        </p>
                      ) : (
                        <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </button>

                  <div className="flex items-center gap-1 shrink-0 pt-0.5">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                      className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                      title={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(faq)}
                      className="p-2 text-blue-900 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                      title="Edit FAQ"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(faq.id)}
                      className="p-2 text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 transition-colors"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">
                  {currentFaq.id ? 'Edit FAQ' : 'Add New FAQ'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Question <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. What is the fee structure for IELTS Academic?"
                  value={currentFaq.question}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide a clear, detailed answer for prospective students..."
                  value={currentFaq.answer}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/20"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Question</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
