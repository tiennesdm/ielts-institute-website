'use client';
import { useState, useEffect } from 'react';
import { Save, CheckCircle2, AlertCircle, Sparkles, Building, Phone, Mail, MapPin, Clock, Megaphone, Image as ImageIcon, Lock } from 'lucide-react';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await fetch('/api/data');
        const data = await res.json();
        setSettings(data.settings);
      } catch (err) {
        setError('Failed to load settings');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleHeroImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setSettings(prev => ({
          ...prev,
          hero: { ...prev.hero, bannerImage: data.url }
        }));
        setMessage('Hero image uploaded successfully! Click "Save All Settings" to apply.');
      } else {
        setError(data.error || 'Failed to upload image');
      }
    } catch (err) {
      setError('Error uploading image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = { settings };
      if (adminPassword.trim()) {
        payload.adminPassword = adminPassword.trim();
      }

      const res = await fetch('/api/admin/update-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Settings updated successfully! Live website has been updated.');
        setAdminPassword('');
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      setError('Network error while saving settings');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Institute Settings & Hero Banner
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Update your institute contact info, banner headlines, announcement bar, and admin credentials.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-600/20 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Save All Settings'}</span>
        </button>
      </div>

      {/* Notifications */}
      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Basic Institute Profile */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Building className="w-5 h-5 text-blue-900" />
            <h2 className="text-base font-bold text-slate-900">Institute Profile & Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Institute Name
              </label>
              <input
                type="text"
                value={settings?.instituteName || ''}
                onChange={(e) => setSettings({ ...settings, instituteName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Tagline / Subtext
              </label>
              <input
                type="text"
                value={settings?.tagline || ''}
                onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Primary Phone Number
              </label>
              <input
                type="text"
                value={settings?.phone || ''}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                WhatsApp Number (with country code, e.g. 919876543210)
              </label>
              <input
                type="text"
                value={settings?.whatsapp || ''}
                onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Email
              </label>
              <input
                type="email"
                value={settings?.email || ''}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Working Hours
              </label>
              <input
                type="text"
                value={settings?.workingHours || ''}
                onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Physical Campus Address
              </label>
              <input
                type="text"
                value={settings?.address || ''}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Top Notification / Announcement Bar */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-red-600" />
              <h2 className="text-base font-bold text-slate-900">Top Notice / Announcement Bar</h2>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings?.showAnnouncement ?? true}
                onChange={(e) => setSettings({ ...settings, showAnnouncement: e.target.checked })}
                className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="text-xs font-bold text-slate-700">Display On Website</span>
            </label>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Notice Ticker Message
            </label>
            <input
              type="text"
              value={settings?.announcement || ''}
              onChange={(e) => setSettings({ ...settings, announcement: e.target.value })}
              placeholder="e.g. New Fast Track Batch Starting Monday! Reserve seat now."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Section 3: Hero Section & Visual Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <h2 className="text-base font-bold text-slate-900">Hero Section & Banner</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Top Badge
              </label>
              <input
                type="text"
                value={settings?.hero?.badge || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, badge: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Main Headline
              </label>
              <input
                type="text"
                value={settings?.hero?.headline || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, headline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-headline Description
              </label>
              <textarea
                rows={3}
                value={settings?.hero?.subheadline || ''}
                onChange={(e) => setSettings({
                  ...settings,
                  hero: { ...settings.hero, subheadline: e.target.value }
                })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
              />
            </div>

            {/* Hero Image URL and Direct Upload */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hero Banner Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="text"
                  value={settings?.hero?.bannerImage || ''}
                  onChange={(e) => setSettings({
                    ...settings,
                    hero: { ...settings.hero, bannerImage: e.target.value }
                  })}
                  placeholder="Paste Image URL or upload below"
                  className="flex-1 w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs text-slate-800"
                />

                <label className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-xs font-bold text-slate-700 cursor-pointer flex items-center gap-1.5 shrink-0 transition-colors">
                  <ImageIcon className="w-4 h-4 text-blue-900" />
                  <span>{uploadingImage ? 'Uploading...' : 'Upload Image File'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>

              {settings?.hero?.bannerImage && (
                <div className="mt-3">
                  <span className="text-[11px] text-slate-400 font-semibold block mb-1">Image Preview:</span>
                  <img
                    src={settings.hero.bannerImage}
                    alt="Hero banner preview"
                    className="h-28 w-48 object-cover rounded-xl border border-slate-200 shadow-sm"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Section 4: Admin Password Security */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Lock className="w-5 h-5 text-red-600" />
            <h2 className="text-base font-bold text-slate-900">Change Admin Password</h2>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              New Admin Password (leave blank to keep current password)
            </label>
            <input
              type="password"
              placeholder="Enter new password if you want to change it"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full max-w-md px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-red-600 focus:ring-1 focus:ring-red-600 outline-none text-xs sm:text-sm text-slate-800"
            />
          </div>
        </div>

        {/* Bottom Save Bar */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-sm transition-all shadow-lg shadow-red-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Changes...' : 'Save All Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
