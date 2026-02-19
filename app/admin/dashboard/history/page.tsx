'use client';

import React, { useState, useEffect } from 'react';
import { Search, Calendar, User, Bus, Users, GraduationCap, AlertTriangle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminNavbar from '@/components/navigation/AdminNavbar';
import AdminFooter from '@/components/navigation/AdminFooter';

// Get action logs from localStorage
const getActionLogs = () => {
  try {
    return JSON.parse(localStorage.getItem('admin_action_logs') || '[]');
  } catch { return []; }
};

// Activity type definitions
type ActivityType = 'driver' | 'bus' | 'parent' | 'student' | 'emergency';
type ActivityAction = 'added' | 'removed' | 'updated' | 'assigned' | 'changed' | 'registered' | 'resolved';

interface Activity {
  id: string;
  type: ActivityType;
  action: ActivityAction;
  title: string;
  description: string;
  timestamp: string;
  performedBy: string;
  icon: React.ReactNode;
}

const ITEMS_PER_PAGE = 6;

export default function ActivityHistory() {
  const [selectedFilter, setSelectedFilter] = useState<'all' | ActivityType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
    // Refresh every 5 seconds to catch new actions
    const interval = setInterval(fetchActivities, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchActivities = () => {
    try {
      setLoading(true);
      const logs = getActionLogs();
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const formattedActivities: Activity[] = logs.map((log: any) => ({
        id: log.id,
        type: log.entityType,
        action: log.action.toLowerCase().includes('add') ? 'added' : 
               log.action.toLowerCase().includes('update') ? 'updated' :
               log.action.toLowerCase().includes('delete') ? 'removed' :
               log.action.toLowerCase().includes('assign') ? 'assigned' :
               log.action.toLowerCase().includes('resolve') ? 'resolved' : 'updated',
        title: log.action,
        description: log.description,
        timestamp: new Date(log.timestamp).toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit'
        }),
        performedBy: log.performedBy,
        icon: getIconForType(log.entityType)
      }));
      
      setActivities(formattedActivities);
      setError(null);
    } catch (err) {
      console.log('Error loading action logs:', err);
      setActivities([]);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'driver': return '👨✈️';
      case 'bus': return '🚌';
      case 'parent': return '👨👩👧';
      case 'student': return '👧';
      case 'emergency': return '🚨';
      default: return '📋';
    }
  };

  // Filter activities based on selected type and search query
  const filteredActivities = activities.filter(activity => {
    const matchesFilter = selectedFilter === 'all' || activity.type === selectedFilter;
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.performedBy.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentActivities = filteredActivities.slice(startIndex, endIndex);

  // Reset to page 1 when filter changes
  const handleFilterChange = (filter: 'all' | ActivityType) => {
    setIsTransitioning(true);
    setSelectedFilter(filter);
    setCurrentPage(1);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const handlePageChange = (page: number) => {
    setIsTransitioning(true);
    setCurrentPage(page);
    
    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  };

  const getFilterConfig = (type: ActivityType | 'all') => {
    switch (type) {
      case 'driver':
        return { label: 'Drivers', icon: User, color: 'text-blue-600 bg-blue-50 border-blue-200' };
      case 'bus':
        return { label: 'Buses', icon: Bus, color: 'text-green-600 bg-green-50 border-green-200' };
      case 'parent':
        return { label: 'Parents', icon: Users, color: 'text-purple-600 bg-purple-50 border-purple-200' };
      case 'student':
        return { label: 'Students', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-200' };
      case 'emergency':
        return { label: 'Emergencies', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' };
      default:
        return { label: 'All Activities', icon: Clock, color: 'text-white bg-blue-500 border-blue-500' };
    }
  };

  const getActivityBadgeColor = (type: ActivityType) => {
    switch (type) {
      case 'driver':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'bus':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'parent':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'student':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'emergency':
        return 'bg-red-100 text-red-700 border-red-200';
    }
  };

  return (
    <div>
    <AdminNavbar />
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-7 h-7 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Activity History & Logs</h1>
              <p className="text-gray-600 mt-1">Track all system activities and changes</p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search activities by action, user, or details..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder:text-gray-400"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-2">
              {(['all', 'driver', 'bus', 'parent', 'student', 'emergency'] as const).map((filter) => {
                const config = getFilterConfig(filter);
                const Icon = config.icon;
                const isSelected = selectedFilter === filter;

                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-xl border-2 font-medium text-sm transition-all duration-300 transform hover:scale-105 ${
                      isSelected
                        ? config.color + ' scale-105'
                        : 'text-gray-600 bg-white border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{config.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Activity List with Transitions */}
        {loading ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activities...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error loading activities</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchActivities}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : (
        <div className={`space-y-4 transition-all duration-300 ${
          isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        }`}>
          {currentActivities.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities yet</h3>
              <p className="text-gray-600">Activities will appear here when you add, edit, delete, or assign students, buses, drivers, or parents.</p>
            </div>
          ) : (
            currentActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer"
                style={{
                  animation: `fadeInUp 0.4s ease-out ${index * 0.1}s both`
                }}
              >
                <div className="flex items-start justify-between">
                  {/* Left Side - Icon and Content */}
                  <div className="flex items-start space-x-4 flex-1">
                    {/* Icon */}
                    <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 hover:scale-110 hover:rotate-6">
                      {activity.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 mb-3">{activity.description}</p>

                      {/* Metadata */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{activity.timestamp}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <User className="w-4 h-4" />
                          <span>{activity.performedBy}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Side - Badge */}
                  <div className={`px-3 py-1 rounded-lg text-xs font-semibold border capitalize transition-all duration-300 hover:scale-110 ${getActivityBadgeColor(activity.type)}`}>
                    {activity.type}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{startIndex + 1}</span> to{' '}
              <span className="font-semibold text-gray-900">{Math.min(endIndex, filteredActivities.length)}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredActivities.length}</span> activities
            </div>

            <div className="flex items-center space-x-2">
              {/* Previous Button */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentPage === 1
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-10 h-10 rounded-lg font-medium text-sm transition-all duration-300 ${
                      currentPage === page
                        ? 'bg-blue-500 text-white scale-110 shadow-lg'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:scale-105'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  currentPage === totalPages
                    ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                    : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:scale-105'
                }`}
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* keyframe animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
    <AdminFooter />
    </div>
  );
}
