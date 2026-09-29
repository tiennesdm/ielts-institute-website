'use client';
import { useState, useEffect } from 'react';
import { Users, Phone, Mail, MapPin, Calendar, Trash2, Edit3, CheckCircle2, Download, Search, MessageSquare, AlertCircle } from 'lucide-react';

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [editingNotesId, setEditingNotesId] = useState(null);
  const [notesText, setNotesText] = useState('');

  useEffect(() => {
    fetchLeads();
  }, []);

  async function fetchLeads() {
    try {
      const res = await fetch('/api/admin/leads');
      const data = await res.json();
      setLeads(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveNotes = async (leadId) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, notes: notesText }),
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data.leads);
        setEditingNotesId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    try {
      const res = await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setLeads(data.leads);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (leads.length === 0) return alert('No leads to export');

    const headers = ['ID', 'Name', 'Phone', 'Email', 'Course', 'Target Band', 'City', 'Status', 'Date', 'Notes'];
    const rows = leads.map(l => [
      l.id,
      `"${l.name || ''}"`,
      `"${l.phone || ''}"`,
      `"${l.email || ''}"`,
      `"${l.course || ''}"`,
      `"${l.targetBand || ''}"`,
      `"${l.city || ''}"`,
      l.status,
      l.createdAt,
      `"${(l.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `apex_ielts_leads_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredLeads = leads.filter((l) => {
    const matchesFilter = filter === 'ALL' || l.status === filter;
    const matchesSearch =
      (l.name?.toLowerCase().includes(search.toLowerCase())) ||
      (l.phone?.includes(search)) ||
      (l.course?.toLowerCase().includes(search.toLowerCase())) ||
      (l.city?.toLowerCase().includes(search.toLowerCase()));
    return matchesFilter && matchesSearch;
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
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Student Leads & Inquiries CRM
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track inquiries, demo bookings, counseling follow-ups, and student enrollments.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          <Download className="w-4 h-4 text-emerald-400" />
          <span>Export All Leads (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {[
            { id: 'ALL', label: `All (${leads.length})` },
            { id: 'New', label: `New (${leads.filter(l => l.status === 'New').length})` },
            { id: 'Contacted', label: 'Contacted' },
            { id: 'Demo Scheduled', label: 'Demo Scheduled' },
            { id: 'Enrolled', label: 'Enrolled' },
            { id: 'Closed', label: 'Closed' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                filter === tab.id
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by student name or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-red-600"
          />
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Student Info</th>
                <th className="py-3.5 px-6">Phone / Contact</th>
                <th className="py-3.5 px-6">Course & Target</th>
                <th className="py-3.5 px-6">Counselor Notes</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    No student inquiries found matching this filter.
                  </td>
                </tr>
              ) : (
                filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                    
                    {/* Student Name */}
                    <td className="py-4 px-6 font-bold text-slate-900">
                      <div>{lead.name}</div>
                      <div className="text-[11px] font-normal text-slate-400 mt-0.5 flex items-center gap-1">
                        {lead.city && <span>{lead.city} • </span>}
                        <span>
                          {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Phone & Email */}
                    <td className="py-4 px-6">
                      <a
                        href={`tel:${lead.phone}`}
                        className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:underline"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        <span>{lead.phone}</span>
                      </a>
                      {lead.email && (
                        <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                          {lead.email}
                        </div>
                      )}
                    </td>

                    {/* Course */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-blue-950 block">{lead.course}</span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Target: {lead.targetBand}
                      </span>
                      {lead.message && (
                        <p className="text-[10px] text-slate-500 italic mt-1 max-w-xs line-clamp-1">
                          "{lead.message}"
                        </p>
                      )}
                    </td>

                    {/* Counselor Notes */}
                    <td className="py-4 px-6 max-w-xs">
                      {editingNotesId === lead.id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="text"
                            value={notesText}
                            onChange={(e) => setNotesText(e.target.value)}
                            placeholder="Add remark..."
                            className="w-full px-2 py-1 text-xs border rounded-lg"
                          />
                          <button
                            onClick={() => handleSaveNotes(lead.id)}
                            className="bg-emerald-600 text-white p-1 rounded hover:bg-emerald-700"
                          >
                            ✓
                          </button>
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            setEditingNotesId(lead.id);
                            setNotesText(lead.notes || '');
                          }}
                          className="cursor-pointer hover:bg-slate-100 p-1 rounded text-slate-600 text-[11px] italic"
                          title="Click to edit notes"
                        >
                          {lead.notes || '+ Click to add notes'}
                        </div>
                      )}
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6">
                      <select
                        value={lead.status}
                        onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                        className={`px-2.5 py-1 rounded-xl text-xs font-bold border outline-none ${
                          lead.status === 'New'
                            ? 'bg-red-50 text-red-700 border-red-200'
                            : lead.status === 'Contacted'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : lead.status === 'Demo Scheduled'
                            ? 'bg-yellow-50 text-yellow-800 border-yellow-200'
                            : lead.status === 'Enrolled'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Demo Scheduled">Demo Scheduled</option>
                        <option value="Enrolled">Enrolled</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>

                    {/* Delete */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleDelete(lead.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
