'use client';

import { useState } from 'react';
import { LogOut, Save, Bus } from 'lucide-react';
import ToggleSwitch from './ToggleSwitch';

export default function Settings() {
  const [fullName, setFullName] = useState('Sarah Anderson');
  const [email, setEmail] = useState('sarah.anderson@email.com');
  const [phone, setPhone] = useState('+1 (555) 123-4567');
  const [childName, setChildName] = useState('Emily Anderson');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);
  const [dailySummary, setDailySummary] = useState(false);

  const handleSaveChanges = () => {
    console.log('Saving changes...');
  };

  const handleLogout = () => {
    console.log('Logging out...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center">
                <Bus className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
                <div className="flex items-center gap-2 mt-0.5">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">muhetobpeace</span>
                </div>
              </div>
            </div>
            <nav className="flex items-center gap-8">
              <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                Dashboard
              </button>
              <button className="text-blue-600 font-medium">Settings</button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Child Name
              </label>
              <input
                type="text"
                value={childName}
                onChange={(e) => setChildName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-900">Security</h2>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent text-gray-900 placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
          <div className="flex items-start gap-3 mb-8">
            <div className="w-1 h-8 bg-blue-600 rounded-full"></div>
            <h2 className="text-2xl font-semibold text-gray-900">Notification Preferences</h2>
          </div>

          <div className="space-y-8">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Email Notifications
                </h3>
                <p className="text-sm text-gray-600">Receive updates via email</p>
              </div>
              <ToggleSwitch
                checked={emailNotifications}
                onChange={setEmailNotifications}
              />
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  SMS Notifications
                </h3>
                <p className="text-sm text-gray-600">Receive text message alerts</p>
              </div>
              <ToggleSwitch
                checked={smsNotifications}
                onChange={setSmsNotifications}
              />
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Emergency Alerts
                </h3>
                <p className="text-sm text-gray-600">Critical updates only</p>
              </div>
              <ToggleSwitch
                checked={emergencyAlerts}
                onChange={setEmergencyAlerts}
              />
            </div>

            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 mb-1">
                  Daily Summary
                </h3>
                <p className="text-sm text-gray-600">End of day bus report</p>
              </div>
              <ToggleSwitch checked={dailySummary} onChange={setDailySummary} />
            </div>
          </div>
        </div>

        <div className="flex justify-end mb-12">
          <button
            onClick={handleSaveChanges}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3.5 rounded-lg transition-colors shadow-sm"
          >
            <Save className="w-5 h-5" />
            Save Changes
          </button>
        </div>

        <footer className="text-center py-8">
          <p className="text-gray-600 font-medium mb-1">
            School Bus Tracker © 2025
          </p>
          <p className="text-gray-500 text-sm">
            Keeping your children safe, one ride at a time
          </p>
        </footer>
      </main>
    </div>
  );
}