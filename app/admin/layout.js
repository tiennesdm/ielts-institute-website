'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from '@/components/BrandLogo';
import {
  LayoutDashboard,
  Settings,
  BookOpen,
  Image as ImageIcon,
  Trophy,
  MessageSquare,
  Calendar,
  Users,
  LogOut,
  ExternalLink,
  GraduationCap,
  HelpCircle,
  ShieldCheck,
  Menu,
  X
} from 'lucide-react';

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [settings, setSettings] = useState(null);

  // If on login page, render children without sidebar
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    fetch('/api/data')
      .then(r => r.json())
      .then(d => { if (d?.settings) setSettings(d.settings); })
      .catch(() => {});
  }, [pathname]);

  useEffect(() => {
    if (isLoginPage) {
      setCheckingAuth(false);
      return;
    }

    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          setCheckingAuth(false);
        }
      } catch (err) {
        router.push('/admin/login');
      }
    }

    checkAuth();
  }, [pathname, isLoginPage, router]);

  const handleLogout = async () => {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="font-semibold text-sm">Loading Admin Portal...</span>
        </div>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { label: 'Site Settings & Hero', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
    { label: 'University Tie-ups', href: '/admin/universities', icon: <GraduationCap className="w-5 h-5" /> },
    { label: 'Manage Courses', href: '/admin/courses', icon: <BookOpen className="w-5 h-5" /> },
    { label: 'Why Choose Us', href: '/admin/why-us', icon: <ShieldCheck className="w-5 h-5" /> },
    { label: 'Photo Gallery', href: '/admin/gallery', icon: <ImageIcon className="w-5 h-5" /> },
    { label: '8+ Band Results', href: '/admin/results', icon: <Trophy className="w-5 h-5" /> },
    { label: 'Testimonials', href: '/admin/testimonials', icon: <MessageSquare className="w-5 h-5" /> },
    { label: 'Upcoming Batches', href: '/admin/batches', icon: <Calendar className="w-5 h-5" /> },
    { label: 'Manage FAQs', href: '/admin/faqs', icon: <HelpCircle className="w-5 h-5" /> },
    { label: 'Leads & Inquiries CRM', href: '/admin/leads', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row">
      
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-sm">First Class Admin Portal</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-slate-800"
          aria-label="Toggle Admin Sidebar"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:static lg:z-auto lg:w-64 bg-slate-900 text-slate-300 flex-shrink-0 min-h-screen flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center">
              <BrandLogo placement="admin" settings={settings} />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Nav List */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[calc(100vh-180px)]">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-emerald-400" />
              <span>Visit Live Website</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-3.5 sm:p-6 lg:p-8 max-w-7xl w-full min-w-0 overflow-y-auto">
        {children}
      </main>

    </div>
  );
}
