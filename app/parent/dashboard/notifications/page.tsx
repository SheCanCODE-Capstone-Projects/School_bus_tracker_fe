"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  AlertTriangle,
  Bus,
  Check,
  X,
  Clock,
  MapPin,
  CheckCircle,
} from "lucide-react";
import ParentNavbar from "@/components/navigation/ParentNavbar";
import Footer from "@/components/Footer";

type NotificationType =
  | "emergency"
  | "bus_approaching"
  | "bus_departed"
  | "bus_arrived"
  | "general";

type NotificationStatus = "unread" | "read";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  status: NotificationStatus;
  busNumber?: string;
  location?: string;
  estimatedArrival?: string;
  busId?: number;
  stopLatitude?: number;
  stopLongitude?: number;
  stopName?: string;
}

interface BusLocation {
  latitude: number;
  longitude: number;
  speed: number;
  status: string;
}

interface ApiNotification {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
}

export default function ParentNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [busLocations, setBusLocations] = useState<Map<number, BusLocation>>(new Map());
  const [loading, setLoading] = useState<Map<number, boolean>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.status === "unread");

  // Haversine formula to calculate distance between two coordinates in kilometers
  const calculateDistanceInKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance;
  };

  // Calculate estimated arrival time based on distance and speed
  const calculateETA = (distanceKm: number, speedKmph: number): string => {
    if (speedKmph <= 0) return "Calculating...";
    
    const hours = distanceKm / speedKmph;
    const minutes = Math.round(hours * 60);
    
    if (minutes < 1) return "Less than 1 minute";
    if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''}`;
    
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs} hour${hrs > 1 ? 's' : ''} ${mins > 0 ? `${mins} min` : ''}`;
  };

  // Determine notification type based on distance
  const getNotificationTypeFromDistance = (distanceKm: number): NotificationType => {
    if (distanceKm < 0.1) return "bus_arrived"; // Less than 100 meters
    if (distanceKm < 1) return "bus_approaching"; // Less than 1 km
    if (distanceKm > 5) return "bus_departed"; // More than 5 km away
    return "general";
  };

  // Generate message based on distance and status
  const generateNotificationMessage = (
    busNumber: string,
    stopName: string,
    distanceKm: number,
    status: string,
    eta: string
  ): string => {
    const distanceInMeters = distanceKm * 1000;
    
    if (distanceKm < 0.1) {
      return `${busNumber} has arrived at ${stopName}. Your child has been dropped off safely.`;
    } else if (distanceKm < 0.5) {
      return `${busNumber} is ${Math.round(distanceInMeters)} meters away from ${stopName}. Please get ready!`;
    } else if (distanceKm < 1) {
      return `${busNumber} is ${distanceKm.toFixed(1)} km away from ${stopName}. ETA: ${eta}`;
    } else if (status === "DEPARTED") {
      return `${busNumber} has departed and is on its way to ${stopName}. Current distance: ${distanceKm.toFixed(1)} km`;
    } else {
      return `${busNumber} is ${distanceKm.toFixed(1)} km away from ${stopName}. ETA: ${eta}`;
    }
  };

  // Get token from localStorage with correct key
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  const READ_IDS_KEY = 'parent_notifications_read_ids';

  const getReadIdsFromStorage = (): Set<string> => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(READ_IDS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr : []);
    } catch {
      return new Set();
    }
  };

  const persistReadId = (id: string) => {
    const set = getReadIdsFromStorage();
    set.add(id);
    localStorage.setItem(READ_IDS_KEY, JSON.stringify([...set]));
  };

  const persistAllReadIds = (ids: string[]) => {
    const set = getReadIdsFromStorage();
    ids.forEach((id) => set.add(id));
    localStorage.setItem(READ_IDS_KEY, JSON.stringify([...set]));
  };

  // Fetch real notifications from the backend
  const fetchNotifications = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = getToken();
      console.log('Token found:', !!token);
      
      if (!token) {
        setError('No authentication token found. Please log in.');
        setIsLoading(false);
        return;
      }

      const response = await fetch(`https://school-bus-tracker-be.onrender.com/api/parent/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Session expired. Please log in again.');
          localStorage.removeItem('authToken');
        } else {
          throw new Error(`Failed to fetch notifications: ${response.status}`);
        }
        return;
      }

      const apiNotifications: ApiNotification[] = await response.json();
      console.log('Notifications received:', apiNotifications);

      const readIdsFromStorage = getReadIdsFromStorage();

      // Transform API notifications; treat as read if API says read OR we have it in local read set (survives refresh)
      const transformedNotifications: Notification[] = apiNotifications.map(apiNotif => {
        const id = apiNotif.id.toString();
        const busId = extractBusIdFromMessage(apiNotif.message);
        const isRead = apiNotif.read || readIdsFromStorage.has(id);
        return {
          id,
          type: mapNotificationType(apiNotif.type),
          title: apiNotif.title,
          message: apiNotif.message,
          timestamp: new Date().toLocaleString(),
          status: isRead ? "read" : "unread",
          busId: busId,
          busNumber: busId ? `Bus ${busId.toString().padStart(2, '0')}` : undefined,
        };
      });

      setNotifications(transformedNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to map API notification types to our NotificationType
  const mapNotificationType = (apiType: string): NotificationType => {
    switch (apiType.toLowerCase()) {
      case 'emergency':
        return 'emergency';
      case 'approaching':
        return 'bus_approaching';
      case 'departed':
        return 'bus_departed';
      case 'arrived':
        return 'bus_arrived';
      default:
        return 'general';
    }
  };

  // Helper function to extract bus ID from message
  const extractBusIdFromMessage = (message: string): number | undefined => {
    const match = message.match(/bus[:\s]*(\d+)/i);
    if (match && match[1]) {
      return parseInt(match[1]);
    }
    return undefined;
  };

  const fetchBusLocation = async (busId: number) => {
    setLoading(prev => new Map(prev).set(busId, true));
    
    try {
      const token = getToken();
      
      if (!token) {
        console.log('No token found');
        return;
      }

      console.log(` Fetching location for bus ${busId}...`);
      const response = await fetch(`https://school-bus-tracker-be.onrender.com/parent/bus/${busId}/location`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bus location: ${response.status}`);
      }

      const data: BusLocation = await response.json();
      console.log(`📍 Bus ${busId} location received:`, data);
      setBusLocations(prev => new Map(prev).set(busId, data));

      // Update notifications with location data
      setNotifications(prev => 
        prev.map(notification => {
          if (notification.busId === busId) {
            // Create location string
            const locationStr = `${data.latitude.toFixed(6)}, ${data.longitude.toFixed(6)}`;
            console.log(` Updating notification ${notification.id} with location:`, locationStr);
            
            return {
              ...notification,
              location: locationStr,
              busNumber: notification.busNumber || `Bus ${busId.toString().padStart(2, '0')}`,
            };
          }
          return notification;
        })
      );
    } catch (error) {
      console.error(`Error fetching location for bus ${busId}:`, error);
    } finally {
      setLoading(prev => new Map(prev).set(busId, false));
    }
  };

  // Fetch locations for all buses in notifications
  const fetchAllBusLocations = async () => {
    const busIds = [...new Set(notifications.map(n => n.busId).filter(Boolean))];
    console.log(' Fetching locations for buses:', busIds);
    
    for (const busId of busIds) {
      if (busId) {
        await fetchBusLocation(busId);
      }
    }
  };

  // Mark notification as read on backend
  const markAsReadOnBackend = async (id: string) => {
    try {
      const token = getToken();
      await fetch(`https://school-bus-tracker-be.onrender.com/api/parent/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Delete notification on backend
  const deleteNotificationOnBackend = async (id: string) => {
    try {
      const token = getToken();
      await fetch(`https://school-bus-tracker-be.onrender.com/api/parent/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Check token on mount and fetch notifications
  useEffect(() => {
    const token = getToken();
    console.log('Token on load:', token ? 'exists' : 'not found');
    
    if (token) {
      fetchNotifications();
    } else {
      setError('No authentication token found. Please log in.');
      setIsLoading(false);
    }
  }, []);

  // Fetch bus locations whenever notifications change
  useEffect(() => {
    if (notifications.length > 0) {
      console.log('📋 Notifications loaded, fetching bus locations...');
      fetchAllBusLocations();
      
      // Set up polling every 15 seconds for real-time updates
      const interval = setInterval(() => {
        console.log('🔄 Polling: Fetching all locations again...');
        fetchAllBusLocations();
      }, 15000);
      
      return () => clearInterval(interval);
    }
  }, [notifications]);

  const markAsRead = (id: string) => {
    persistReadId(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
    markAsReadOnBackend(id);
  };

  const markAllAsRead = () => {
    const ids = notifications.map((n) => n.id);
    persistAllReadIds(ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
    ids.forEach((id) => markAsReadOnBackend(id));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    deleteNotificationOnBackend(id);
  };

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "emergency":
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case "bus_approaching":
        return <Bus className="w-6 h-6 text-amber-500" />;
      case "bus_departed":
        return <MapPin className="w-6 h-6 text-blue-500" />;
      case "bus_arrived":
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "emergency":
        return "bg-red-50 border-red-200";
      case "bus_approaching":
        return "bg-amber-50 border-amber-200";
      case "bus_departed":
        return "bg-blue-50 border-blue-200";
      case "bus_arrived":
        return "bg-green-50 border-green-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Redirect to login page
  const goToLogin = () => {
    window.location.href = '/parent/login';
  };

  if (isLoading) {
    return (
      <div>
        <ParentNavbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Bell className="w-12 h-12 text-blue-500 animate-pulse mx-auto mb-4" />
            <p className="text-gray-600">Loading notifications...</p>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <ParentNavbar/>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            
            <div className="space-y-3">
              <button
                onClick={goToLogin}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-medium"
              >
                Go to Login Page
              </button>
              
              <button
                onClick={fetchNotifications}
                className="w-full px-4 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer/>
      </div>
    );
  }

  return (
    <div>
      <ParentNavbar/>
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center relative">
                <Bell className="w-7 h-7 text-blue-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Notifications
                </h1>
                <p className="text-gray-600 mt-1">
                  Stay updated on your child&apos;s bus status
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
              >
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm font-medium">Mark All Read</span>
              </button>
            )}
          </div>

          <div className="flex space-x-2 bg-white rounded-xl p-1 border border-gray-200 w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === "all"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                filter === "unread"
                  ? "bg-blue-500 text-white shadow-lg"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Unread ({unreadCount})
            </button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700">No notifications</h3>
            <p className="text-gray-500">You re all caught up!</p>
          </div>
        ) : (
          <div className="space-y-4 notifications-list">
            {filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${getNotificationColor(
                  notification.type
                )} ${
                  notification.status === "unread"
                    ? "border-l-4 border-l-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="flex-shrink-0 w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3
                          className={`text-lg font-semibold ${
                            notification.status === "unread"
                              ? "text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {notification.title}
                          {notification.busId && loading.get(notification.busId) && (
                            <span className="ml-2 text-xs text-blue-500 animate-pulse">(Updating...)</span>
                          )}
                        </h3>
                        {notification.status === "unread" && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" />
                        )}
                      </div>

                      <p
                        className={`mb-3 ${
                          notification.status === "unread"
                            ? "text-gray-700"
                            : "text-gray-500"
                        }`}
                      >
                        {notification.message}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{notification.timestamp}</span>
                        </div>

                        {notification.busNumber && (
                          <div className="flex items-center space-x-1">
                            <Bus className="w-4 h-4" />
                            <span>{notification.busNumber}</span>
                          </div>
                        )}

                        {notification.location && (
                          <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span className="font-mono text-xs">{notification.location}</span>
                          </div>
                        )}

                        {notification.estimatedArrival && notification.estimatedArrival !== "Calculating..." && (
                          <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-medium">
                            ETA: {notification.estimatedArrival}
                          </div>
                        )}

                        {notification.busId && busLocations.get(notification.busId) && (
                          <div className="px-2 py-1 bg-green-100 text-green-700 rounded-lg font-medium text-xs">
                            Live: {busLocations.get(notification.busId)?.status}
                            {busLocations.get(notification.busId)?.speed > 0 && 
                              ` • ${busLocations.get(notification.busId)?.speed} km/h`
                            }
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    {notification.status === "unread" && (
                      <button
                        onClick={() => markAsRead(notification.id)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300 hover:scale-110"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteNotification(notification.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-300 hover:scale-110"
                      title="Delete"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .notification-card {
          animation: fadeInUp 0.4s ease-out both;
        }

        .notifications-list > .notification-card:nth-child(1) {
          animation-delay: 0s;
        }
        .notifications-list > .notification-card:nth-child(2) {
          animation-delay: 0.1s;
        }
        .notifications-list > .notification-card:nth-child(3) {
          animation-delay: 0.2s;
        }
        .notifications-list > .notification-card:nth-child(4) {
          animation-delay: 0.3s;
        }

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
    <Footer/>
    </div>
  );
}