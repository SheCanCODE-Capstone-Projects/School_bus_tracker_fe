'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Info, MapPin, Clock, Users } from 'lucide-react';
import AdminNavbar from '@/components/navigation/AdminNavbar';
 emergency-creation
import AdminFooter from '@/components/navigation/AdminFooter';
=======
import { getAuthToken } from '@/lib/auth';
 main

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
 emergency-creation
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      console.log('=== FETCHING EMERGENCIES (ADMIN) ===');
      console.log('Token found:', !!token);
      
      if (!token) {
        console.error('No auth token found');
        setLoading(false);
        return;
      }

      console.log('Calling API:', 'https://school-bus-tracker-be.onrender.com/api/admin/emergencies');
      console.log('Timestamp:', new Date().toISOString());
      
      const response = await fetch('https://school-bus-tracker-be.onrender.com/api/admin/emergencies', {
        method:'GET',

      const token = getAuthToken();
      console.log(token)
       if (!token) {
          console.error("No authentication token found");
          window.location.href = "/login";
          return;
        }

      const response = await fetch('https://school-bus-tracker-be.onrender.com/api/admin/emergencies', {
        method: 'GET',
main
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
      const token = localStorage.getItem('authToken') || localStorage.getItem('accessToken') || localStorage.getItem('token');
      
      if (!token) {
        setIsResolving(false);
        return;
      }

      const response = await fetch(`https://school-bus-tracker-be.onrender.com/api/admin/emergencies/${selectedEmergency.id}/resolve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          resolutionNotes: resolutionNotes.trim(),
          notifyParents: notifyParents
        })
      });

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

  const filteredEmergencies = emergencies.filter(e => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') return e.status === 'ACTIVE';
    if (activeFilter === 'resolved') return e.status === 'RESOLVED';
    return true;
  });

  const hasActiveEmergency = activeCount > 0;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading emergencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AdminNavbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
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

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
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

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
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
            Resolved ({emergencies.filter(e => e.status === 'RESOLVED').length})
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
                emergency.status === 'ACTIVE'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-green-50 border-green-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      emergency.status === 'ACTIVE' ? 'bg-red-200' : 'bg-green-200'
                    }`}
                  >
                    {emergency.status === 'ACTIVE' ? (
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
                          emergency.status === 'ACTIVE'
                            ? 'bg-red-200 text-red-800'
                            : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {emergency.status === 'ACTIVE' ? 'Active' : 'Resolved'}
                      </span>
                    </div>
                    <p className="text-gray-700 mb-3">{emergency.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"/>
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z"/>
                        </svg>
                        <span>Bus {emergency.busNumber}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{emergency.driverName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{getTimeAgo(emergency.reportedAt)}</span>
                      </div>
                    </div>
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
              </div>

              <div className="bg-white rounded-xl p-4 mt-4">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">Location</span>
                    </div>
                    <p className="text-gray-700 ml-6">
                      Lat: {emergency.latitude.toFixed(4)}, Lng: {emergency.longitude.toFixed(4)}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 text-blue-600 mb-2">
                      <Clock className="w-4 h-4" />
                      <span className="font-medium">Reported At</span>
                    </div>
                    <p className="text-gray-700 ml-6">{new Date(emergency.reportedAt).toLocaleString()}</p>
                    
                    <div className="mt-4">
                      <p className="font-medium text-gray-700 mb-1">Parents Notified</p>
                      <p className={`ml-6 flex items-center space-x-1 ${emergency.parentsNotified ? 'text-green-600' : 'text-gray-500'}`}>
                        <CheckCircle className="w-4 h-4" />
                        <span>{emergency.parentsNotified ? 'Yes' : 'No'}</span>
                      </p>
                    </div>
                  </div>
                </div>

                {emergency.status === 'RESOLVED' && emergency.resolutionNotes && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="font-medium text-gray-700 mb-2">Resolution Notes</p>
                    <p className="text-gray-600 mb-2">{emergency.resolutionNotes}</p>
                    {emergency.resolvedByAdminName && emergency.resolvedAt && (
                      <p className="text-sm text-gray-500">
                        Resolved by {emergency.resolvedByAdminName} at {new Date(emergency.resolvedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

     {/* Resolve Emergency Modal */}
      {showResolveModal && selectedEmergency && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-white/30 backdrop-blur-md">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Manage Emergency</h2>
              </div>
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

            {/* Emergency Details Card - Simplified */}
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedEmergency.type}</h3>
              <p className="text-gray-700">{selectedEmergency.description}</p>
            </div>
            
            {/* Bus and Driver Info Boxes */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Bus</p>
                <p className="text-lg font-bold text-gray-900">Bus {selectedEmergency.busNumber}</p>
              </div>
              
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Driver</p>
                <p className="text-lg font-bold text-gray-900">{selectedEmergency.driverName}</p>
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
              <div className="mb-4 bg-green-50 border-2 border-green-200 rounded-lg p-4 flex items-center space-x-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-green-800 font-medium">{successMessage}</span>
              </div>
            )}

            {/* Resolution Notes */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resolution Notes *
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
      )}
      
      <AdminFooter />
    </div>
  );
};

export default EmergenciesPage;
