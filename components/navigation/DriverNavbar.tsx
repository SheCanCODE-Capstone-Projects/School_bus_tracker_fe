'use client';

import React from 'react';
import { Bus, User, LogOut } from 'lucide-react';

export default function DriverNavbar() {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <Bus className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Driver Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900">
              <User className="w-5 h-5" />
              <span>Profile</span>
            </button>
            <button className="flex items-center gap-2 px-3 py-2 text-gray-700 hover:text-gray-900">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}