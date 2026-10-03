'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Users,
  BookOpen,
  Image as ImageIcon,
  Trophy,
  ArrowRight,
  Clock,
  CheckCircle,
  Phone,
  Mail,
  AlertCircle,
  Sparkles,
  PlusCircle,
  Settings,
  GraduationCap,
  HelpCircle
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState(null);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [resPublic, resLeads] = await Promise.all([
          fetch('/api/data'),
          fetch('/api/admin/leads')
        ]);
        const publicJson = await resPublic.json();
        const leadsJson = await resLeads.json();
        setData(publicJson);
        setLeads(leadsJson || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const handleUpdateStatus = async (leadId, newStatus) => {
    try {
      const res = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: leadId, status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setLeads(updated.leads);
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

  const coursesCount = data?.courses?.length || 0;
  const galleryCount = data?.gallery?.length || 0;
  const resultsCount = data?.results?.length || 0;
  const universitiesCount = data?.universities?.items?.length || 0;
  const faqsCount = data?.faqs?.length || 0;
  const totalLeads = leads.length;
  const newLeads = leads.filter(l => l.status === 'New').length;

  return (
    <div className="space-y-8">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Welcome back, Admin. Real-time metrics and dynamic content management for {data?.settings?.instituteName}.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href="/admin/faqs"
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4 text-red-600" />
            <span>Manage FAQs ({faqsCount})</span>
          </Link>
          <Link
            href="/admin/universities"
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <GraduationCap className="w-4 h-4" />
            <span>Manage Universities</span>
          </Link>
          <Link
            href="/admin/gallery"
            className="px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Upload Photo</span>
          </Link>
          <Link
            href="/admin/courses"
            className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Course</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Grid - 5 Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Leads */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Leads</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{totalLeads}</div>
            <div className="text-xs font-semibold text-red-600 mt-0.5">{newLeads} pending callback</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Universities */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Universities</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{universitiesCount}</div>
            <div className="text-xs font-medium text-emerald-600 mt-0.5 font-semibold">Direct Tie-ups</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Courses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Courses</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{coursesCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Live on site</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Gallery */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gallery</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{galleryCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Photos & Labs</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
        </div>

        {/* Card 5: Results */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">High Scorers</span>
            <div className="text-2xl font-black text-slate-900 mt-1">{resultsCount}</div>
            <div className="text-xs font-medium text-amber-600 mt-0.5 font-semibold">8+ Band Alumni</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Trophy className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Quick Action Navigation Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Link
          href="/admin/settings"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-blue-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-900 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-900">
                Site Settings & Hero
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Customize titles, badges, WhatsApp, modal, and SEO.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/faqs"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-red-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-red-600">
                Manage FAQs ({faqsCount})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Add, edit, or remove questions & answers on the homepage.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/gallery"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-purple-600">
                Manage Photo Gallery
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload photos directly for Classrooms, Visas, and Labs.
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/leads"
          className="bg-white p-5 rounded-2xl border border-slate-200/80 hover:border-emerald-400 hover:shadow-md transition-all group flex flex-col justify-between"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm group-hover:text-emerald-700">
                Leads CRM ({totalLeads})
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                View student demo bookings, phone numbers & update status.
              </p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Leads Inquiries Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Recent Demo Bookings & Inquiries
            </h2>
            <p className="text-xs text-slate-500">
              Students who submitted inquiry forms on the website
            </p>
          </div>

          <Link
            href="/admin/leads"
            className="text-xs font-bold text-blue-900 hover:text-blue-800 flex items-center gap-1"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-6">Student Name</th>
                <th className="py-3.5 px-6">Contact Details</th>
                <th className="py-3.5 px-6">Course & Target</th>
                <th className="py-3.5 px-6">Date</th>
                <th className="py-3.5 px-6">Status</th>
                <th className="py-3.5 px-6 text-right">Quick Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {leads.slice(0, 5).map((lead) => (
                <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900">
                    {lead.name}
                    {lead.city && (
                      <span className="block text-[11px] font-normal text-slate-400">
                        {lead.city}
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                      <Phone className="w-3 h-3 text-red-600" />
                      <a href={`tel:${lead.phone}`} className="hover:underline">
                        {lead.phone}
                      </a>
                    </div>
                    {lead.email && (
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {lead.email}
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-semibold text-blue-950 block">{lead.course}</span>
                    <span className="text-[11px] text-slate-500">{lead.targetBand}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-400 text-[11px]">
                    {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      lead.status === 'New'
                        ? 'bg-red-100 text-red-700'
                        : lead.status === 'Contacted'
                        ? 'bg-blue-100 text-blue-800'
                        : lead.status === 'Demo Scheduled'
                        ? 'bg-yellow-100 text-yellow-800'
                        : lead.status === 'Enrolled'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-700'
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={lead.status}
                      onChange={(e) => handleUpdateStatus(lead.id, e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:border-red-600"
                    >
                      <option value="New">Mark New</option>
                      <option value="Contacted">Mark Contacted</option>
                      <option value="Demo Scheduled">Mark Demo Scheduled</option>
                      <option value="Enrolled">Mark Enrolled</option>
                      <option value="Closed">Mark Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
