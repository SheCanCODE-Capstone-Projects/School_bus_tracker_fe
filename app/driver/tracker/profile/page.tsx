
'use client';

import React from 'react';
import { Bus, Shield, Star, Calendar, AlertTriangle, Users, Phone, Mail, User, TrendingUp, Award } from 'lucide-react';

export default function DriverProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bus className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Driver Profile</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">muhetobpeace</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900 font-medium">Tracker</button>
            <button className="text-blue-600 hover:text-blue-700 font-medium">Profile</button>
            <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <span>Logout</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 mb-6 text-white shadow-lg">
            <div className="flex items-center gap-6">
              <div className="w-28 h-28 bg-white rounded-2xl flex items-center justify-center text-6xl shadow-lg">
                👨‍✈️
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">Michael Johnson</h1>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  <span className="text-blue-50">Professional Bus Driver</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-lg text-gray-900 font-medium">Michael Johnson</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-lg text-gray-900 font-medium">+1 (555) 987-6543</p>
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4 md:col-span-2">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-lg text-gray-900 font-medium">michael.johnson@school.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Assignment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-900">Bus Assignment</h2>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 flex items-center gap-5">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-3xl shadow-md">
                🚌
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500 mb-1">Assigned Bus</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">Bus 01</h3>
                <p className="text-gray-600">Lincoln Elementary School</p>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-semibold text-gray-900">Professional Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* License Number */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">License Number</label>
                  <p className="text-lg text-gray-900 font-semibold">CDL-123456</p>
                </div>
              </div>

              {/* Years of Service */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Years of Service</label>
                  <p className="text-lg text-gray-900 font-semibold">8 years</p>
                </div>
              </div>

              {/* Total Trips */}
              <div className="bg-gray-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Trips Completed</label>
                  <p className="text-lg text-gray-900 font-semibold">2,450</p>
                </div>
              </div>

              {/* Safety Rating */}
              <div className="bg-green-50 rounded-xl p-5 flex items-start gap-4">
                <div className="w-10 h-10 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-5 h-5 text-green-700" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-700 mb-1">Safety Rating</label>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-lg text-gray-900 font-semibold">4.9/5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* On-time Rate */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600 font-medium">On-Time Rate</p>
            </div>
            
            {/* Incidents */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">0</h3>
              <p className="text-gray-600 font-medium">Incidents</p>
            </div>
            
            {/* Students */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-2">45</h3>
              <p className="text-gray-600 font-medium">Students</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-gray-600 mb-1">School Bus Tracker © 2025</p>
          <p className="text-gray-500 text-sm">Drive safely, arrive safely</p>
        </div>
      </footer>

      {/* Help Button */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <span className="text-xl">?</span>
      </button>
    </div>
  );
}