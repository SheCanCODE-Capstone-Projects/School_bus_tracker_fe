
'use client';

import React from 'react';
import { Bus, Shield, Star, Calendar, AlertTriangle, Users, Phone, Mail, User, TrendingUp, Award } from 'lucide-react';

export default function DriverProfile() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Bus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Driver Profile</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">peace</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 sm:gap-6">
            <button className="hidden sm:block text-gray-600 hover:text-gray-900 font-medium">Tracker</button>
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm sm:text-base">Profile</button>
            <button className="flex items-center gap-1 sm:gap-2 text-gray-600 hover:text-gray-900">
              <span>→</span>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 text-black shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-4xl sm:text-6xl shadow-lg">
                👨‍✈️
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Michael Johnson</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-gray-300 text-sm sm:text-base">Professional Bus Driver</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-1 h-6 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-2"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Full Name */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-base sm:text-lg text-gray-900 font-medium">Michael Johnson</p>
                </div>
              </div>

              {/* Phone Number */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-base sm:text-lg text-gray-900 font-medium">+1 (555) 987-6543</p>
                </div>
              </div>

              {/* Email Address */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 lg:col-span-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-base sm:text-lg text-gray-900 font-medium break-all sm:break-normal">michael.johnson@school.com</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Assignment */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-1 h-6 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-2"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Bus Assignment</h2>
            </div>
            
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-md">
                🚌
              </div>
              <div className="text-center sm:text-left">
                <div className="text-sm font-medium text-gray-500 mb-1">Assigned Bus</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">Bus 01</h3>
                <p className="text-gray-600 text-sm sm:text-base">Lincoln Elementary School</p>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-1 h-6 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-2"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Professional Details</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* License Number */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">License Number</label>
                  <p className="text-base sm:text-lg text-gray-900 font-semibold">CDL-123456</p>
                </div>
              </div>

              {/* Years of Service */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Years of Service</label>
                  <p className="text-base sm:text-lg text-gray-900 font-semibold">8 years</p>
                </div>
              </div>

              {/* Total Trips */}
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Trips Completed</label>
                  <p className="text-base sm:text-lg text-gray-900 font-semibold">2,450</p>
                </div>
              </div>

              {/* Safety Rating */}
              <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-green-700 mb-1">Safety Rating</label>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-base sm:text-lg text-gray-900 font-semibold">4.9/5.0</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            {/* On-time Rate */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">100%</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">On-Time Rate</p>
            </div>
            
            {/* Incidents */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">0</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Incidents</p>
            </div>
            
            {/* Students */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">45</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Students</p>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 mb-1 text-sm sm:text-base">School Bus Tracker © 2025</p>
          <p className="text-gray-500 text-xs sm:text-sm">Drive safely, arrive safely</p>
        </div>
      </footer>

      {/* Help Button */}
      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <span className="text-lg sm:text-xl">?</span>
      </button>
    </div>
  );
}