'use client';

import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';
import ParentNavbar from '@/components/navigation/ParentNavbar';
import Footer from '@/components/Footer';
import { getUserData } from '@/lib/auth';
import { getParentStudents, getParentProfile, updateParentProfile } from '@/lib/tracking-api';

export default function Settings() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [childName, setChildName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [parentId, setParentId] = useState<number | null>(null);
  const [address, setAddress] = useState('');
  const [schoolId, setSchoolId] = useState<number | null>(null);

  // Load real parent data on mount
  useEffect(() => {
    const load = async () => {
      const userData = getUserData();
      const id = (userData?.parentId ?? userData?.id) != null ? Number(userData?.parentId ?? userData?.id) : null;
      setParentId(id);

      const name = (userData?.name ?? userData?.fullName ?? userData?.parentName) as string | undefined;
      const userEmail = (userData?.email as string | undefined) ?? '';
      const userPhone = (userData?.phone ?? userData?.phoneNumber) as string | undefined;

      if (name) setFullName(String(name));
      if (userEmail) setEmail(String(userEmail));
      if (userPhone) setPhone(String(userPhone ?? ''));

      if (id != null) {
        try {
          const profile = await getParentProfile(id);
          if (profile) {
            if (profile.name) setFullName(profile.name);
            if (profile.email) setEmail(profile.email);
            if (profile.phone) setPhone(profile.phone ?? '');
            if (profile.address) setAddress(profile.address);
            if (typeof profile.schoolId === 'number') setSchoolId(profile.schoolId);
          }
          const students = await getParentStudents(id);
          const names = students.map((s) => s.studentName ?? (s as { student_name?: string }).student_name ?? '').filter(Boolean);
          if (names.length) setChildName(names.join(', '));
          const first = students[0];
          if (first?.parentName && !name) setFullName(first.parentName);
          if (first?.parentPhone && userPhone === undefined) setPhone(first.parentPhone ?? '');
        } catch {
          // Keep userData values
        }
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveChanges = async () => {
    if (parentId == null) {
      setSaveStatus('error');
      setSaveMessage('Cannot save: parent ID not found. Please log in again.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setSaveStatus('error');
      setSaveMessage('New password and confirmation do not match.');
      return;
    }

    setSaveStatus('saving');
    setSaveMessage('');
    try {
      const passwordToSend = newPassword || currentPassword || undefined;

      await updateParentProfile({
        name: fullName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        homeAddress: address || undefined,
        schoolId: schoolId ?? undefined,
        password: passwordToSend,
      });

      setSaveStatus('success');
      setSaveMessage('Profile updated successfully.');
    } catch (e) {
      setSaveStatus('error');
      setSaveMessage(e instanceof Error ? e.message : 'Failed to save.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ParentNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ParentNavbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">

        {/* ---------------- PROFILE ---------------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 group transition-transform hover:translate-y-[-7px]">
          <div className="flex items-start gap-3 mb-8 hover:bg-gray-50 p-2 rounded-lg transition-all hover:translate-x-1">
            <div className="w-1 h-8 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Profile Information</h2>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Child Name(s)</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="text"
                  value={childName}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-700 cursor-not-allowed"
                  title="Child names come from your registered students"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">From your registered students (read-only)</p>
            </div>
          </div>
        </div>

        {/* ---------------- SECURITY ---------------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 group transition-transform hover:translate-y-[-7px]">
          <div className="flex items-start gap-3 mb-8 hover:bg-gray-50 p-2 rounded-lg transition-all hover:translate-x-1">
            <div className="w-1 h-8 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Security</h2>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full opacity-0 focus-within:opacity-100 transition-opacity"></div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none text-gray-900 focus:border-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------------- NOTIFICATION PREFS ---------------- */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-8 mb-6 group transition-transform hover:translate-y-[-7px]">
          <div className="flex items-start gap-3 mb-8 hover:bg-gray-50 p-2 rounded-lg transition-all hover:translate-x-1">
            <div className="w-1 h-8 rounded-full bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Email Notifications</h3>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <ToggleSwitch checked={emailNotifications} onChange={setEmailNotifications} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">SMS Notifications</h3>
                <p className="text-sm text-gray-600">Receive text message alerts</p>
              </div>
              <ToggleSwitch checked={smsNotifications} onChange={setSmsNotifications} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Emergency Alerts</h3>
                <p className="text-sm text-gray-600">Critical updates only</p>
              </div>
              <ToggleSwitch checked={emergencyAlerts} onChange={setEmergencyAlerts} />
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">Daily Summary</h3>
                <p className="text-sm text-gray-600">End of day bus report</p>
              </div>
              <ToggleSwitch checked={dailySummary} onChange={setDailySummary} />
            </div>
          </div>
        </div>

        {/* SAVE BUTTON + STATUS */}
        {saveMessage && (
          <div className={`mb-4 px-4 py-2 rounded-lg text-sm ${saveStatus === 'success' ? 'bg-green-100 text-green-800' : saveStatus === 'error' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-700'}`}>
            {saveMessage}
          </div>
        )}
        <div className="flex justify-center sm:justify-end mb-8 sm:mb-12">
          <button
            onClick={handleSaveChanges}
            disabled={saveStatus === 'saving'}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium px-6 sm:px-8 py-3.5 rounded-lg transition-colors shadow-sm w-full sm:w-auto justify-center"
          >
            <Save className="w-5 h-5" />
            {saveStatus === 'saving' ? 'Saving...' : 'Save Changes'}
          </button>
        </div>

      </main>

      <Footer />
    </div>
  );
}
