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
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Eye,
  EyeOff,
  Settings,
  Layers,
  Sparkles,
  Phone,
  MessageSquare,
  ExternalLink
} from 'lucide-react';

const PRESET_CATEGORIES = [
  'IELTS Exam',
  'PTE Academic',
  'Mock Tests & Labs',
  'Courses & Fees',
  'Admissions & Demo',
  'Teaching Methodology',
  'Study Visa',
  'General'
];

export default function AdminFaqsPage() {
  const [activeTab, setActiveTab] = useState('faqs'); // 'faqs' | 'settings'
  const [faqs, setFaqs] = useState([]);
  const [config, setConfig] = useState({
    badge: 'Got Questions?',
    title: 'Frequently Asked Questions',
    subtitle: 'Everything you need to know about our IELTS, PTE courses, mock test schedules, and guarantee methodology.',
    showSearch: true,
    searchPlaceholder: 'Search questions by topic, e.g. fees, mock test, speaking...',
    showCategories: true,
    allCategoryLabel: 'All Questions',
    showSupportCard: true,
    supportBadge: 'Still Have Questions?',
    supportTitle: 'Need Personalized Guidance for Your Target Band?',
    supportSubtitle: "Can't find the answer you are looking for? Speak directly with our master trainers or visit our Chandigarh branch for a 1-on-1 assessment.",
    supportPhoneText: 'Call Admissions Desk',
    supportPhone: '',
    supportWhatsappText: 'Chat on WhatsApp',
    supportWhatsapp: '',
    supportCtaText: 'Book Free 1-on-1 Demo',
    supportCtaAction: 'modal',
    supportCtaUrl: '#inquiry'
  });

  const [loading, setLoading] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL' | 'ACTIVE' | 'INACTIVE'
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const defaultFaq = {
    id: '',
    question: '',
    answer: '',
    category: 'General',
    isActive: true,
    order: 1
  };

  const [currentFaq, setCurrentFaq] = useState(defaultFaq);
  const [isCustomCategory, setIsCustomCategory] = useState(false);

  useEffect(() => {
    fetchFaqsAndConfig();
  }, []);

  async function fetchFaqsAndConfig() {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/faqs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFaqs(data || []);
      } else {
        setFaqs(data.faqs || []);
        if (data.config) {
          setConfig((prev) => ({ ...prev, ...data.config }));
        }
      }
    } catch (e) {
      setError('Failed to fetch FAQs');
    } finally {
      setLoading(false);
    }
  }

  const handleOpenAdd = () => {
    setCurrentFaq({
      id: '',
      question: '',
      answer: '',
      category: 'IELTS Exam',
      isActive: true,
      order: faqs.length + 1
    });
    setIsCustomCategory(false);
    setIsEditing(true);
  };

  const handleOpenEdit = (faq) => {
    setCurrentFaq({
      ...faq,
      category: faq.category || 'General',
      isActive: faq.isActive !== false,
      order: faq.order || 1
    });
    setIsCustomCategory(!PRESET_CATEGORIES.includes(faq.category || ''));
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
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

  const handleToggleStatus = async (faq) => {
    try {
      const newStatus = !faq.isActive;
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_status',
          id: faq.id,
          isActive: newStatus
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.faqs || []);
        setSuccess(`Question marked as ${newStatus ? 'Active' : 'Hidden'}`);
        setTimeout(() => setSuccess(''), 2500);
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      setError('Failed to update status');
    }
  };

  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;

    const newFaqs = [...faqs];
    const [movedItem] = newFaqs.splice(index, 1);
    newFaqs.splice(targetIndex, 0, movedItem);

    // Optimistic UI update
    setFaqs(newFaqs);

    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'reorder',
          faqs: newFaqs
        })
      });
      const data = await res.json();
      if (res.ok) {
        setFaqs(data.faqs || newFaqs);
        setSuccess('FAQ order updated');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        setError(data.error || 'Failed to update order');
        fetchFaqsAndConfig();
      }
    } catch (err) {
      setError('Failed to update order');
      fetchFaqsAndConfig();
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
        body: JSON.stringify(currentFaq)
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

  const handleSaveSectionConfig = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    setError('');
    try {
      const res = await fetch('/api/admin/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_config',
          config
        })
      });

      const data = await res.json();
      if (res.ok) {
        if (data.config) setConfig(data.config);
        setSuccess('FAQ Section settings and Support Card updated successfully!');
        setTimeout(() => setSuccess(''), 3500);
      } else {
        setError(data.error || 'Failed to save section settings');
      }
    } catch (err) {
      setError('Failed to save section settings');
    } finally {
      setSavingSettings(false);
    }
  };

  // Derive unique categories for filtering
  const allCategories = Array.from(
    new Set(faqs.map((f) => f.category?.trim() || 'General'))
  ).filter(Boolean);

  const filteredFaqs = faqs.filter((f) => {
    // Search filter
    const matchesSearch =
      !searchQuery.trim() ||
      f.question?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.answer?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.category?.toLowerCase().includes(searchQuery.toLowerCase());

    // Category filter
    const matchesCategory =
      categoryFilter === 'ALL' || (f.category?.trim() || 'General') === categoryFilter;

    // Status filter
    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && f.isActive !== false) ||
      (statusFilter === 'INACTIVE' && f.isActive === false);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const activeCount = faqs.filter((f) => f.isActive !== false).length;
  const hiddenCount = faqs.length - activeCount;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-red-50 text-red-600 rounded-xl">
              <HelpCircle className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                FAQ Section & Questions Customizer
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                Customize FAQ questions, answers, categories, order, header text, and bottom student helpdesk card.
              </p>
            </div>
          </div>
        </div>

        {/* View on Website Link */}
        <a
          href="/#faqs"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all flex items-center justify-center gap-2 self-start md:self-auto shrink-0"
        >
          <span>Preview on Website</span>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Tab Switcher */}
      <div className="flex border-b border-slate-200 bg-white px-6 rounded-2xl shadow-sm gap-2">
        <button
          onClick={() => setActiveTab('faqs')}
          className={`py-4 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'faqs'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Questions & Answers ({faqs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`py-4 px-4 text-xs font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'settings'
              ? 'border-red-600 text-red-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Section Headings & Helpdesk Card</span>
        </button>
      </div>

      {/* TAB 1: FAQS LIST & CRUD */}
      {activeTab === 'faqs' && (
        <div className="space-y-6">
          {/* Quick Stats & Controls Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Total FAQs</span>
              <p className="text-xl font-black text-slate-900 mt-1">{faqs.length}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">Active</span>
              <p className="text-xl font-black text-emerald-600 mt-1">{activeCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hidden / Draft</span>
              <p className="text-xl font-black text-slate-500 mt-1">{hiddenCount}</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600">Categories</span>
              <p className="text-xl font-black text-blue-600 mt-1">{allCategories.length}</p>
            </div>
          </div>

          {/* Search, Filter & Add Button */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search questions or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-red-600 focus:bg-white transition-all"
                />
              </div>

              {/* Category Filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-red-600"
              >
                <option value="ALL">All Categories ({faqs.length})</option>
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:border-red-600"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active Only</option>
                <option value="INACTIVE">Hidden Only</option>
              </select>
            </div>

            {/* Add Button */}
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md shadow-red-600/20 flex items-center justify-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New FAQ</span>
            </button>
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
                {searchQuery || categoryFilter !== 'ALL' || statusFilter !== 'ALL'
                  ? 'No questions matched your search and filter criteria.'
                  : 'Click "Add New FAQ" to create your first question and answer.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredFaqs.map((faq, idx) => {
                const originalIndex = faqs.findIndex((f) => f.id === faq.id);
                const isExpanded = expandedId === faq.id;
                const isActive = faq.isActive !== false;

                return (
                  <div
                    key={faq.id || idx}
                    className={`bg-white rounded-2xl border transition-all ${
                      isActive
                        ? 'border-slate-200/80 shadow-sm'
                        : 'border-slate-200/60 bg-slate-50/70 opacity-75'
                    }`}
                  >
                    <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: Reorder Controls + Q# + Content */}
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Up / Down Reorder */}
                        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
                          <button
                            onClick={() => handleMove(originalIndex, -1)}
                            disabled={originalIndex === 0}
                            className={`p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 ${
                              originalIndex === 0 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleMove(originalIndex, 1)}
                            disabled={originalIndex === faqs.length - 1}
                            className={`p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 ${
                              originalIndex === faqs.length - 1 ? 'opacity-30 cursor-not-allowed' : ''
                            }`}
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Question Details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-1.5">
                            <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 font-black text-[10px]">
                              #{faq.order || originalIndex + 1}
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-800 font-bold text-[10px]">
                              {faq.category || 'General'}
                            </span>
                            {!isActive && (
                              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] flex items-center gap-1">
                                <EyeOff className="w-2.5 h-2.5" />
                                <span>Hidden</span>
                              </span>
                            )}
                          </div>

                          <h3
                            onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                            className="font-bold text-slate-900 text-sm sm:text-base hover:text-red-600 transition-colors cursor-pointer"
                          >
                            {faq.question}
                          </h3>

                          {isExpanded ? (
                            <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 whitespace-pre-line">
                              {faq.answer}
                            </div>
                          ) : (
                            <p
                              onClick={() => setExpandedId(faq.id)}
                              className="mt-1 text-xs text-slate-400 line-clamp-1 cursor-pointer"
                            >
                              {faq.answer}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 shrink-0 self-end sm:self-center border-t sm:border-t-0 pt-2 sm:pt-0 w-full sm:w-auto justify-end">
                        {/* Toggle Active/Inactive */}
                        <button
                          onClick={() => handleToggleStatus(faq)}
                          className={`p-2 rounded-lg transition-colors ${
                            isActive
                              ? 'text-emerald-600 hover:bg-emerald-50'
                              : 'text-slate-400 hover:bg-slate-200'
                          }`}
                          title={isActive ? 'Active on website (click to hide)' : 'Hidden (click to show)'}
                        >
                          {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        </button>

                        {/* Expand / Collapse */}
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : faq.id)}
                          className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
                          title={isExpanded ? 'Collapse answer' : 'View answer'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* Edit */}
                        <button
                          onClick={() => handleOpenEdit(faq)}
                          className="p-2 text-blue-900 hover:text-blue-700 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit Question & Answer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete */}
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
        </div>
      )}

      {/* TAB 2: SECTION HEADINGS & HELPDESK SUPPORT CARD */}
      {activeTab === 'settings' && (
        <form onSubmit={handleSaveSectionConfig} className="space-y-6">
          {/* Card 1: Section Headings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="p-2 bg-red-50 text-red-600 rounded-xl">
                <Settings className="w-4 h-4" />
              </span>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Homepage FAQ Section Header
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pill Badge Text
                </label>
                <input
                  type="text"
                  placeholder="e.g. Got Questions?"
                  value={config.badge || ''}
                  onChange={(e) => setConfig({ ...config, badge: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Main Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Frequently Asked Questions"
                  value={config.title || ''}
                  onChange={(e) => setConfig({ ...config, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors font-bold"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Everything you need to know about our courses, test formats, and scores."
                  value={config.subtitle || ''}
                  onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Interactive Controls & Toggles */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <span className="p-2 bg-blue-50 text-blue-900 rounded-xl">
                <Search className="w-4 h-4" />
              </span>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                Search Bar & Category Pills Display
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Show Search Bar */}
              <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Show Instant Search Bar</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Allow students to search questions by keywords
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showSearch !== false}
                    onChange={(e) => setConfig({ ...config, showSearch: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Show Category Tabs */}
              <div className="p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Show Category Filter Pills</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Group questions by IELTS, PTE, Fees, Visa, etc.
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showCategories !== false}
                    onChange={(e) => setConfig({ ...config, showCategories: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {/* Search Placeholder */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Search Bar Placeholder Text
                </label>
                <input
                  type="text"
                  placeholder="Search questions by topic..."
                  value={config.searchPlaceholder || ''}
                  onChange={(e) => setConfig({ ...config, searchPlaceholder: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>

              {/* All Questions Label */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  &ldquo;All Questions&rdquo; Filter Tab Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. All Questions"
                  value={config.allCategoryLabel || ''}
                  onChange={(e) => setConfig({ ...config, allCategoryLabel: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Bottom "Still Have Questions?" Support Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                  <Sparkles className="w-4 h-4" />
                </span>
                <div>
                  <h2 className="font-bold text-slate-900 text-sm sm:text-base">
                    Bottom Helpdesk Support Card
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Dedicated banner at the bottom of FAQs allowing students to call, WhatsApp, or book a demo directly.
                  </p>
                </div>
              </div>

              {/* Enable / Disable Support Card Toggle */}
              <label className="relative inline-flex items-center cursor-pointer shrink-0">
                <input
                  type="checkbox"
                  checked={config.showSupportCard !== false}
                  onChange={(e) => setConfig({ ...config, showSupportCard: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
              </label>
            </div>

            {config.showSupportCard !== false && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Support Pill Badge
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Still Have Questions?"
                    value={config.supportBadge || ''}
                    onChange={(e) => setConfig({ ...config, supportBadge: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Support Headline / Title
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Need Personalized Guidance for Your Target Band?"
                    value={config.supportTitle || ''}
                    onChange={(e) => setConfig({ ...config, supportTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors font-bold"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Support Subtitle / Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Speak directly with our master trainers or visit our Chandigarh branch for a 1-on-1 assessment."
                    value={config.supportSubtitle || ''}
                    onChange={(e) => setConfig({ ...config, supportSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                {/* Call Button Settings */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Call Admissions Button</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Call Admissions Desk"
                      value={config.supportPhoneText || ''}
                      onChange={(e) => setConfig({ ...config, supportPhoneText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Custom Phone Number (Leave blank to use institute phone)
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={config.supportPhone || ''}
                      onChange={(e) => setConfig({ ...config, supportPhone: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* WhatsApp Button Settings */}
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp Chat Button</span>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Button Text
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Chat on WhatsApp"
                      value={config.supportWhatsappText || ''}
                      onChange={(e) => setConfig({ ...config, supportWhatsappText: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Custom WhatsApp Number (Leave blank to use institute WhatsApp)
                    </label>
                    <input
                      type="text"
                      placeholder="+91 98765 43210"
                      value={config.supportWhatsapp || ''}
                      onChange={(e) => setConfig({ ...config, supportWhatsapp: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                    />
                  </div>
                </div>

                {/* Primary Demo CTA Button */}
                <div className="sm:col-span-2 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Sparkles className="w-3.5 h-3.5 text-red-600" />
                    <span>Primary Demo CTA Button</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Button Label
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Book Free 1-on-1 Demo"
                        value={config.supportCtaText || ''}
                        onChange={(e) => setConfig({ ...config, supportCtaText: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Click Action
                      </label>
                      <select
                        value={config.supportCtaAction || 'modal'}
                        onChange={(e) => setConfig({ ...config, supportCtaAction: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                      >
                        <option value="modal">Open Demo Booking Modal</option>
                        <option value="url">Redirect to Custom URL</option>
                      </select>
                    </div>
                    {config.supportCtaAction === 'url' && (
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Custom URL / Anchor
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. #contact or /courses"
                          value={config.supportCtaUrl || ''}
                          onChange={(e) => setConfig({ ...config, supportCtaUrl: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Save Settings Bar */}
          <div className="flex items-center justify-end gap-3 sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl">
            <button
              type="submit"
              disabled={savingSettings}
              className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-red-600/25 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{savingSettings ? 'Saving Settings...' : 'Save Section Settings'}</span>
            </button>
          </div>
        </form>
      )}

      {/* Add / Edit FAQ Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {currentFaq.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Provide the question, answer, and category shown on the website.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveFaq} className="p-6 space-y-4">
              {/* Question */}
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
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors font-medium"
                />
              </div>

              {/* Category */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Category Tag <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomCategory(!isCustomCategory);
                      if (!isCustomCategory) {
                        setCurrentFaq({ ...currentFaq, category: '' });
                      } else {
                        setCurrentFaq({ ...currentFaq, category: PRESET_CATEGORIES[0] });
                      }
                    }}
                    className="text-[11px] text-red-600 hover:underline font-semibold"
                  >
                    {isCustomCategory ? 'Choose from presets' : '+ Type custom category'}
                  </button>
                </div>

                {isCustomCategory ? (
                  <input
                    type="text"
                    required
                    placeholder="e.g. Australia PR Visa, Weekend Batches..."
                    value={currentFaq.category}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                  />
                ) : (
                  <select
                    value={currentFaq.category}
                    onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors bg-white font-medium"
                  >
                    {PRESET_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Answer <span className="text-red-600">*</span>
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Provide a clear, detailed, and reassuring answer for prospective students..."
                  value={currentFaq.answer}
                  onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors leading-relaxed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tip: Line breaks and bullet points are preserved on the website.
                </span>
              </div>

              {/* Display Order & Active Toggle */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={currentFaq.order || 1}
                    onChange={(e) =>
                      setCurrentFaq({ ...currentFaq, order: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 transition-colors"
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors">
                    <input
                      type="checkbox"
                      checked={currentFaq.isActive !== false}
                      onChange={(e) =>
                        setCurrentFaq({ ...currentFaq, isActive: e.target.checked })
                      }
                      className="rounded border-slate-300 text-red-600 focus:ring-red-600 w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-700">Active on Website</span>
                  </label>
                </div>
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
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold flex items-center gap-2 shadow-md shadow-red-600/20 transition-all"
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
