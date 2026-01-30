'use client';

import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Info, MapPin, Clock, Phone, Users } from 'lucide-react';
import { notificationService } from '@/lib/notification-service';

const EmergenciesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedEmergency, setSelectedEmergency] = useState<typeof emergencies[0] | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [sendNotification, setSendNotification] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
      bus: 'Bus 03',
      driver: 'David Brown',
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
      bus: 'Bus 03',
      driver: 'David Brown',
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
    if (e.status !== 'resolved') return false;
    const today = new Date().toDateString();
    const resolvedDate = new Date(e.resolvedAt || '').toDateString();
    return today === resolvedDate;
  }).length;
  const totalCount = emergencies.length;

  const filteredEmergencies = emergencies.filter(e => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return e.status === 'active';
    if (activeFilter === 'resolved') return e.status === 'resolved';
    return true;
  });

  const handleManageClick = (emergency: typeof emergencies[0]) => {
    setSelectedEmergency(emergency);
    setResolutionNotes('');
    setSendNotification(true);
  };

  const handleCloseModal = () => {
    setSelectedEmergency(null);
    setResolutionNotes('');
    setSendNotification(true);
  };

  const handleMarkAsResolved = () => {
    if (!selectedEmergency) return;
    
    // Send notification to admin about status change
    notificationService.reportStatusChange(
      selectedEmergency.id,
      selectedEmergency.status,
      'resolved',
      selectedEmergency.driver,
      selectedEmergency.bus
    );
    
    console.log('Marking emergency as resolved:', {
      emergencyId: selectedEmergency.id,
      resolutionNotes,
      sendNotification
    });
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
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
            <div className="flex items-center">
              <nav className="hidden md:flex items-center space-x-8">
                <a href="#" className="text-gray-600 hover:text-gray-900">Tracker</a>
                <a href="#" className="text-gray-600 hover:text-gray-900">Profile</a>
                <a href="#" className="text-blue-500 font-medium">Emergencies</a>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                  <span>Logout</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </nav>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-6 py-4 space-y-2">
              <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">Tracker</a>
              <a href="#" className="block text-gray-600 hover:text-gray-900 py-2">Profile</a>
              <a href="#" className="block text-blue-500 font-medium py-2">Emergencies</a>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 py-2">
                <span>Logout</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-200 hover:shadow-xl transition-shadow duration-300">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-shadow duration-300">
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

          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-2">Total Incidents</p>
                <p className="text-4xl font-bold text-gray-900">{totalCount}</p>
              </div>
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-blue-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-gray-700 font-medium">Filter:</span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-blue-500 text-gray-900'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-white'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'active'
                ? 'bg-red-500 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-white'
            }`}
          >
            Active ({activeCount})
          </button>
          <button
            onClick={() => setActiveFilter('resolved')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeFilter === 'resolved'
                ? 'bg-green-500 text-white'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-500 hover:text-white'
            }`}
          >
            Resolved ({emergencies.filter(e => e.status === 'resolved').length})
          </button>
        </div>

        {/* Emergency Cards */}
        <div className="space-y-6">
          {filteredEmergencies.map((emergency) => (
            <div
              key={emergency.id}
              className={`rounded-2xl p-6 shadow-sm border-2 hover:shadow-lg transition-shadow duration-300 ${
                emergency.status === 'active'
                  ? 'bg-red-100 border-red-200'
                  : 'bg-green-100 border-green-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start justify-between mb-4 gap-4">
                <div className="flex flex-col sm:flex-row items-start space-y-3 sm:space-y-0 sm:space-x-4">
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
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900">{emergency.type}</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                          emergency.status === 'active'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {emergency.status === 'active' ? 'Active' : 'Resolved'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{emergency.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
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
              </div>

              <div className="bg-white rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-gray-700 ml-6 mb-4">{emergency.location}</p>
                    <p className="font-medium text-gray-700 mb-1">Driver Contact</p>
                    <p className="text-gray-600 ml-6">{emergency.driverContact}</p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Reported At</span>
                    </div>
                    <p className="text-gray-700 ml-6 mb-4">{emergency.reportedAt}</p>
                    <p className="font-medium text-gray-700 mb-1">Parents Notified</p>
                    <p className="text-green-600 ml-6 flex items-center space-x-1">
                      <CheckCircle className="w-4 h-4" />
                      <span>Yes</span>
                    </p>
                  </div>
                </div>
              </div>

              {emergency.status === 'resolved' && emergency.resolutionNotes && (
                <div className="bg-white rounded-xl p-4 mt-4 hover:shadow-md transition-shadow duration-300">
                  <p className="font-medium text-gray-700 mb-2">Resolution Notes</p>
                  <p className="text-gray-600 mb-2">{emergency.resolutionNotes}</p>
                  <p className="text-sm text-gray-500">
                    Resolved by {emergency.resolvedBy} at {emergency.resolvedAt}
                  </p>
                </div>
              )}

              {emergency.status === 'active' && (
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4 rounded-lg hover:shadow-md transition-shadow duration-300">
                  <div className="flex items-center">
                    <AlertTriangle className="w-5 h-5 text-yellow-600 mr-3" />
                    <p className="text-yellow-800">
                      This emergency requires immediate attention. Click Manage to take action.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <footer className="text-center py-8 mt-12">
          <p className="text-gray-600 font-medium mb-1">
            School Bus Tracker © 2025
          </p>
          <p className="text-gray-500 text-sm">
            Keeping your children safe, one ride at a time
          </p>
        </footer>

        {/* Manage Emergency Modal */}
        {selectedEmergency && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Manage Emergency</h2>
                </div>

                {/* Emergency Details Card */}
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedEmergency.type}</h3>
                  <p className="text-gray-700">{selectedEmergency.description}</p>
                </div>

                {/* Bus and Driver Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Bus</label>
                    <p className="text-gray-900 font-medium">{selectedEmergency.bus}</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Driver</label>
                    <p className="text-gray-900 font-medium">{selectedEmergency.driver}</p>
                  </div>
                </div>

                {/* View Location Button */}
                <button className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors mb-6">
                  View Bus Location on Map
                </button>

                {/* Resolution Notes */}
                <div className="mb-6">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Resolution Notes</label>
                  <textarea
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Describe how the emergency was resolved..."
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                  />
                </div>

                {/* Send Notification Checkbox */}
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sendNotification}
                      onChange={(e) => setSendNotification(e.target.checked)}
                      className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-gray-900 font-medium">Send safety notification to all parents</span>
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleMarkAsResolved}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Mark as Resolved</span>
                  </button>
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default EmergenciesPage;