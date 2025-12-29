'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, MapPin, Clock, Phone, Users } from 'lucide-react';

const EmergenciesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const emergencies = [
    {
      id: 1,
      type: 'Mechanical Issue',
      description: 'Engine overheating warning light',
      status: 'active',
      bus: 'Bus 03',
      driver: 'David Brown',
      time: '15 minutes ago',
      location: '5th Avenue & Park Street',
      reportedAt: '2024-12-02 2:45 PM',
      driverContact: '+1 (555) 789-0123',
      parentsNotified: true,
      resolutionNotes: null,
      resolvedBy: null,
      resolvedAt: null
    },
    {
      id: 2,
      type: 'Traffic Delay',
      description: 'Major traffic accident on route',
      status: 'resolved',
      bus: 'Bus 01',
      driver: 'Michael Johnson',
      time: '1 day ago',
      location: '3rd Avenue & Main Street',
      reportedAt: '2024-12-01 8:15 AM',
      driverContact: '+1 (555) 987-6543',
      parentsNotified: true,
      resolutionNotes: 'Alternative route taken. All students arrived safely. 12-minute delay.',
      resolvedBy: 'Admin Sarah',
      resolvedAt: '2024-12-01 8:30 AM'
    },
    {
      id: 3,
      type: 'Medical Assistance',
      description: 'Student feeling unwell',
      status: 'resolved',
      bus: 'Bus 02',
      driver: 'Sarah Williams',
      time: '2 days ago',
      location: 'Lincoln Elementary School',
      reportedAt: '2024-11-30 3:20 PM',
      driverContact: '+1 (555) 123-4567',
      parentsNotified: true,
      resolutionNotes: 'School nurse attended. Parent picked up student. No serious issues.',
      resolvedBy: 'Admin John',
      resolvedAt: '2024-11-30 3:35 PM'
    }
  ];

  const activeCount = emergencies.filter(e => e.status === 'active').length;
  const resolvedTodayCount = emergencies.filter(e => {
    if (e.status !== 'resolved' || !e.resolvedAt) return false;
    const today = new Date().toDateString();
    const resolvedDate = new Date(e.resolvedAt).toDateString();
    return today === resolvedDate;
  }).length;
  const totalCount = emergencies.length;

  const filteredEmergencies = emergencies.filter(e => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return e.status === 'active';
    if (activeFilter === 'resolved') return e.status === 'resolved';
    return true;
  });

  const hasActiveEmergency = activeCount > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                  <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Emergency Management</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">peace</span>
                </div>
              </div>
            </div>
            <nav className="flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900">Dashboard</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Buses</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Drivers</a>
              <a href="#" className="text-gray-600 hover:text-gray-900">Parents</a>
              <a href="#" className="text-blue-500 font-medium">Emergencies</a>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <span>Logout</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Active Emergencies</p>
                <p className="text-4xl font-bold text-gray-900">{activeCount}</p>
              </div>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Resolved Today</p>
                <p className="text-4xl font-bold text-gray-900">{resolvedTodayCount}</p>
              </div>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Incidents</p>
                <p className="text-4xl font-bold text-gray-900">{totalCount}</p>
              </div>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <Info className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-4 mb-6">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-gray-700 font-medium">Filter:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'active'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'resolved'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Resolved ({emergencies.filter(e => e.status === 'resolved').length})
          </button>
        </div>

        {/* Alert Banner for Active Emergencies */}
        {hasActiveEmergency && activeFilter === 'all' && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
              <p className="text-yellow-800">
                This emergency requires immediate attention. Click Manage to take action.
              </p>
            </div>
          </div>
        )}

        {/* Emergency Cards */}
        <div className="space-y-6">
          {filteredEmergencies.map((emergency) => (
            <div
              key={emergency.id}
              className={`rounded-2xl p-6 shadow-sm border-2 ${
                emergency.status === 'active'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      emergency.status === 'active' ? 'bg-red-200' : 'bg-green-200'
                    }`}
                  >
                    {emergency.status === 'active' ? (
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{emergency.type}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          emergency.status === 'active'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {emergency.status === 'active' ? 'Active' : 'Resolved'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{emergency.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                        <span>{emergency.bus}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{emergency.driver}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{emergency.time}</span>
                      </div>
                    </div>
                  </div>
                </div>
                {emergency.status === 'active' && (
                  <button className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors">
                    Manage
                  </button>
                )}
              </div>

              <div className="bg-white rounded-xl p-4 mt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-gray-700 ml-6">{emergency.location}</p>
                    
                    <div className="mt-4">
                      <p className="font-medium text-gray-700 mb-1">Driver Contact</p>
                      <p className="text-gray-600 ml-6">{emergency.driverContact}</p>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Reported At</span>
                    </div>
                    <p className="text-gray-700 ml-6">{emergency.reportedAt}</p>
                    
                    <div className="mt-4">
                      <p className="font-medium text-gray-700 mb-1">Parents Notified</p>
                      <p className="text-green-600 ml-6 flex items-center space-x-1">
                        <CheckCircle className="w-4 h-4" />
                        <span>Yes</span>
                      </p>
                    </div>
                  </div>
                </div>

                {emergency.status === 'resolved' && emergency.resolutionNotes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="font-medium text-gray-700 mb-2">Resolution Notes</p>
                    <p className="text-gray-600 mb-2">{emergency.resolutionNotes}</p>
                    <p className="text-sm text-gray-500">
                      Resolved by {emergency.resolvedBy} at {emergency.resolvedAt}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default EmergenciesPage;