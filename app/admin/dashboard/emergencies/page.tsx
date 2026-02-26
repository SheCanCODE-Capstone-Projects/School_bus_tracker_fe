'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, MapPin, Clock, Users } from 'lucide-react';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminFooter from '@/components/navigation/AdminFooter';
import { getAuthToken } from '@/lib/auth';

interface Emergency {
  id: number;
  type: string;
  description: string;
  voiceRecordingUrl?: string;
  status: string;
  busNumber: string;
  driverName: string;
  latitude: number;
  longitude: number;
  parentsNotified: boolean;
  reportedAt: string;
  resolvedAt?: string;
  resolvedByAdminName?: string;
  resolutionNotes?: string;
}

const EmergenciesPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [selectedEmergency, setSelectedEmergency] = useState<Emergency | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [notifyParents, setNotifyParents] = useState(true);
  const [isResolving, setIsResolving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmergencies();    
  }, []);

  const fetchEmergencies = async () => {
    try {
      const token = getAuthToken();
      console.log('=== FETCHING EMERGENCIES (ADMIN) ===');
      console.log('Token found:', !!token);
      
      if (!token) {
        console.error('No authentication token found');
        window.location.href = '/login';
        return;
      }

      console.log('Calling API:', 'https://school-bus-tracker-be.onrender.com/api/admin/emergencies');
      console.log('Timestamp:', new Date().toISOString());
      
      const response = await fetch('https://school-bus-tracker-be.onrender.com/api/admin/emergencies', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const data = await response.json();
        console.log('Emergencies received:', data);
        console.log('Number of emergencies:', Array.isArray(data) ? data.length : 'Not an array');
        setEmergencies(Array.isArray(data) ? data : []);
      } else {
        const errorText = await response.text();
        console.error('API Error:', response.status, errorText);
        if (response.status === 403) {
          console.error('403 FORBIDDEN: Admin token cannot access driver endpoint. Backend needs to create /api/admin/emergencies endpoint.');
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching emergencies:', err);
      setLoading(false);
    }
  };

  const handleManageClick = (emergency: Emergency) => {
    setSelectedEmergency(emergency);
    setResolutionNotes('');
    setNotifyParents(true);
    setShowResolveModal(true);
  };

  const handleResolveEmergency = async () => {
    if (!selectedEmergency || !resolutionNotes.trim()) {
      return;
    }

    setIsResolving(true);
    setSuccessMessage('');

    try {
      const token = getAuthToken();
      
      if (!token) {
        console.error('No authentication token found');
        setIsResolving(false);
        return;
      }

      const response = await fetch(
        `https://school-bus-tracker-be.onrender.com/api/admin/emergencies/${selectedEmergency.id}/resolve`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            resolutionNotes: resolutionNotes.trim(),
            notifyParents: notifyParents
          })
        }
      );

      if (response.ok) {
        setSuccessMessage('Emergency resolved successfully!');
        setTimeout(() => {
          setShowResolveModal(false);
          setSelectedEmergency(null);
          setResolutionNotes('');
          setSuccessMessage('');
          fetchEmergencies();
        }, 2000);
      }
    } catch (err) {
      console.error('Error resolving emergency:', err);
    } finally {
      setIsResolving(false);
    }
  };

  const activeCount = emergencies.filter(e => e.status === 'ACTIVE').length;
  const resolvedTodayCount = emergencies.filter(e => {
    if (e.status !== 'RESOLVED' || !e.resolvedAt) return false;
    const today = new Date().toDateString();
    const resolvedDate = new Date(e.resolvedAt).toDateString();
    return today === resolvedDate;
  }).length;
  const totalCount = emergencies.length;

  const filteredEmergencies = emergencies
    .filter(e => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'active') return e.status === 'ACTIVE';
      if (activeFilter === 'resolved') return e.status === 'RESOLVED';
      return true;
    })
    .sort((a, b) => {
      if (a.status === 'ACTIVE' && b.status !== 'ACTIVE') return -1;
      if (a.status !== 'ACTIVE' && b.status === 'ACTIVE') return 1;
      return new Date(b.reportedAt).getTime() - new Date(a.reportedAt).getTime();
    });

  const hasActiveEmergency = activeCount > 0;

  const getTimeAgo = (dateString: string) => {
    if (!dateString) return 'Just now';
    // Backend often sends ISO without Z (UTC); parse as UTC so "just created" shows "Just now"
    const s = dateString.trim();
    const hasTz = s.endsWith('Z') || /[+-]\d{2}:?\d{2}$/.test(s);
    const toParse = hasTz ? s : s.replace(/\.\d+$/, '') + 'Z';
    const date = new Date(toParse);
    const now = new Date();
    let seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 0) return 'Just now';
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 200px)' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading emergencies...</p>
          </div>
        </div>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Emergency Management</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Active Emergencies</p>
                <p className="text-3xl font-bold text-red-600">{activeCount}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Resolved Today</p>
                <p className="text-3xl font-bold text-green-600">{resolvedTodayCount}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Incidents</p>
                <p className="text-3xl font-bold text-blue-600">{totalCount}</p>
              </div>
              <Info className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>

        
        <div className="mb-6 flex space-x-4">
          <span className="text-gray-700 font-medium self-center">Filter:</span>
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
            Resolved ({emergencies.filter(e => e.status === 'RESOLVED').length})
          </button>
        </div>

        {/* Emergency Cards */}
        <div className="space-y-6">
          {filteredEmergencies.map((emergency) => (
            <div
              key={emergency.id}
              className={`bg-white rounded-lg shadow-md overflow-hidden ${
                emergency.status === 'ACTIVE' ? 'border-l-4 border-red-500' : ''
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {emergency.status === 'ACTIVE' ? (
                      <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{emergency.type}</h3>
                      <span      
                        className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                          emergency.status === 'ACTIVE'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {emergency.status === 'ACTIVE' ? 'Active' : 'Resolved'}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{emergency.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">Bus {emergency.busNumber}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Users className="w-5 h-5" />
                    <span className="text-sm">{emergency.driverName}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">{getTimeAgo(emergency.reportedAt)}</span>
                  </div>
                </div>

                {emergency.status === 'ACTIVE' && (
                  <button
                    onClick={() => handleManageClick(emergency)}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    Manage
                  </button>
                )}

                <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Location</p>
                    <p className="text-gray-700">
                      Lat: {emergency.latitude.toFixed(4)}, Lng: {emergency.longitude.toFixed(4)}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Reported At</p>
                    <p className="text-gray-700">{new Date(emergency.reportedAt).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">Parents Notified</p>
                    <p className="text-gray-700">{emergency.parentsNotified ? 'Yes' : 'No'}</p>
                  </div>
                </div>

                {emergency.status === 'ACTIVE' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg">
                    <div className="flex items-center">
                      <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                      <p className="text-sm font-medium text-red-900">
                        This emergency requires immediate attention. Click Manage to take action.
                      </p>
                    </div>
                  </div>
                )}

                {emergency.status === 'RESOLVED' && emergency.resolutionNotes && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-2">Resolution Notes</p>
                    <p className="text-sm text-green-800">{emergency.resolutionNotes}</p>
                    {emergency.resolvedByAdminName && emergency.resolvedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        Resolved by {emergency.resolvedByAdminName} at{' '}
                        {new Date(emergency.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Resolve Emergency Modal */}
      {showResolveModal && selectedEmergency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Manage Emergency</h2>
              <button
                onClick={() => {
                  setShowResolveModal(false);
                  setSelectedEmergency(null);
                  setResolutionNotes('');
                }}
                disabled={isResolving}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Emergency Details Card - Simplified */}
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-6 h-6 text-red-500 flex-shrink-0 mt-1" />
                  <div className="flex-1">
                    <h3 className="font-bold text-red-900 text-lg mb-1">{selectedEmergency.type}</h3>
                    <p className="text-red-800 text-sm">{selectedEmergency.description}</p>
                  </div>
                </div>
              </div>

              {/* Bus and Driver Info Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Bus</p>
                  <p className="font-semibold text-gray-900">Bus {selectedEmergency.busNumber}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Driver</p>
                  <p className="font-semibold text-gray-900">{selectedEmergency.driverName}</p>
                </div>
              </div>
                                          
              {/* View Location Button */}
              <button
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${selectedEmergency.latitude},${selectedEmergency.longitude}`;
                  window.open(url, '_blank');
                }}
                className="w-full mb-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <MapPin className="w-5 h-5" />
                <span>View Bus Location On Map</span>
              </button>

              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <p className="text-green-700 font-medium">{successMessage}</p>
                </div>
              )}

              {/* Resolution Notes */}
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resolution Notes <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="Describe how the emergency was resolved..."
                  className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none text-gray-800 placeholder-gray-400"
                  rows={3}
                  disabled={isResolving}
                />
              </div>

              {/* Notify Parents Checkbox */}
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyParents}
                    onChange={(e) => setNotifyParents(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    disabled={isResolving}
                  />
                  <span className="text-sm text-gray-700">Notify parents about this resolution</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleResolveEmergency}
                  disabled={isResolving || !resolutionNotes.trim()}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isResolving ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      <span>Resolving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      <span>Mark as Resolved</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowResolveModal(false);
                    setSelectedEmergency(null);
                    setResolutionNotes('');
                  }}
                  disabled={isResolving}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3 rounded-lg disabled:opacity-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <AdminFooter />
    </div>
  );
};

export default EmergenciesPage;  








                                            