'use client';

import { useState } from 'react';
import { User, Phone, Mail, MapPin, Calendar, Save, Camera } from 'lucide-react';

export default function DriverProfile() {
  const [profile, setProfile] = useState({
    name: 'John Smith',
    email: 'john.smith@schoolbus.com',
    phone: '+1 (555) 987-6543',
    address: '123 Main Street, City, State 12345',
    licenseNumber: 'DL123456789',
    experience: '8 years',
    busNumber: 'Bus #42',
    route: 'Route A - Downtown',
  });

  const handleChange = (e: any) => {
    setProfile(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = () => {
    console.log('Saving profile...', profile);
    alert('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 px-8 py-12">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-green-600" />
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors">
                  <Camera className="w-4 h-4 text-white" />
                </button>
              </div>
              <div className="text-white">
                <h1 className="text-3xl font-bold">{profile.name}</h1>
                <p className="text-green-100 text-lg mt-1">School Bus Driver</p>
                <div className="flex items-center gap-4 mt-3">
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                    {profile.busNumber}
                  </span>
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">
                    {profile.route}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-8 hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="flex items-start gap-3 mb-8 group">
              <div className="w-1 h-8 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <h2 className="text-2xl font-semibold text-gray-900">Profile Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  License Number
                </label>
                <input
                  type="text"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4" />
                  Experience
                </label>
                <input
                  type="text"
                  name="experience"
                  value={profile.experience}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Work Information */}
            <div className="mt-8 pt-8 border-t border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              <div className="flex items-start gap-3 mb-6 group">
                <div className="w-1 h-6 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <h3 className="text-xl font-semibold text-gray-900">Work Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Bus
                  </label>
                  <input
                    type="text"
                    name="busNumber"
                    value={profile.busNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Route Assignment
                  </label>
                  <input
                    type="text"
                    name="route"
                    value={profile.route}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}