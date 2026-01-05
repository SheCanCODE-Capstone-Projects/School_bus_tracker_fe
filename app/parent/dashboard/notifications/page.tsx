"use client";

import React, { useState } from "react";
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
}

const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "emergency",
    title: "Emergency Alert - Bus 01",
    message:
      "Emergency reported on Bus 01. All students are safe. Admin is handling the situation.",
    timestamp: "2024-12-03 14:30",
    status: "unread",
    busNumber: "Bus 01",
    location: "5th Ave & Park St",
  },
  {
    id: "2",
    type: "bus_approaching",
    title: "Bus Approaching Your Stop!",
    message: "Bus 01 is 0.8 km away from Oak Street Stop. Please get ready!",
    timestamp: "2024-12-03 14:15",
    status: "unread",
    busNumber: "Bus 01",
    location: "Oak Street Stop",
    estimatedArrival: "3:45 PM",
  },
  {
    id: "3",
    type: "bus_departed",
    title: "Bus Departed from School",
    message: "Bus 01 has departed from Lincoln Elementary School.",
    timestamp: "2024-12-03 13:45",
    status: "read",
    busNumber: "Bus 01",
    location: "Lincoln Elementary School",
  },
  {
    id: "4",
    type: "bus_arrived",
    title: "Bus Arrived at Stop",
    message:
      "Bus 01 has arrived at Oak Street Stop. Your child has been dropped off safely.",
    timestamp: "2024-12-03 13:20",
    status: "read",
    busNumber: "Bus 01",
    location: "Oak Street Stop",
  },
];

export default function ParentNotifications() {
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const unreadCount = notifications.filter((n) => n.status === "unread").length;

  const filteredNotifications =
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.status === "unread");

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
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
                          <span>{notification.location}</span>
                        </div>
                      )}

                      {notification.estimatedArrival && (
                        <div className="px-2 py-1 bg-amber-100 text-amber-700 rounded-lg font-medium">
                          ETA: {notification.estimatedArrival}
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
