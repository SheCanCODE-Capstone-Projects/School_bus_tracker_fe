"use client";
import AdminFooter from "@/components/navigation/AdminFooter";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bus,
  Activity,
  TrendingUp,
  AlertTriangle,
  Users,
  UserCircle,
  ArrowRight,
  Navigation,
} from "lucide-react";
import Link from "next/link";
import { isAuthenticated, getUserRole } from "@/lib/auth";

interface BusData {
  id: string;
  number: string;
  driver: string;
  status: "moving" | "stopped" | "emergency" | "offline";
  position: { x: number; y: number };
}

interface ActivityItem {
  id: string;
  type: "emergency" | "completed" | "assigned";
  title: string;
  description: string;
  time: string;
  icon: React.ReactNode;
  bgColor: string;
}

export default function AdminDashboardContent() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  
  // Role-based protection - only allow admin access
  useEffect(() => {
    const checkAuth = async () => {
      // Add small delay to ensure auth data is set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      if (!isAuthenticated()) {
        console.log('Not authenticated, redirecting to login');
        window.location.href = '/login';
        return;
      }
      
      const role = getUserRole();
      console.log('User role:', role);
      
      if (role !== 'admin') {
        if (role === 'parent') {
          window.location.href = '/parent/dashboard';
        } else if (role === 'driver') {
          window.location.href = '/driver/tracker';
        } else {
          window.location.href = '/login';
        }
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  const stats = [
    {
      label: "Total Buses",
      value: "12",
      icon: Bus,
      bgColor: "bg-blue-100",
      iconColor: "text-blue-500",
    },
    {
      label: "Active Buses",
      value: "10",
      icon: Activity,
      bgColor: "bg-green-100",
      iconColor: "text-green-500",
    },
    {
      label: "Offline Buses",
      value: "2",
      icon: TrendingUp,
      bgColor: "bg-gray-100",
      iconColor: "text-gray-500",
    },
    {
      label: "Emergencies",
      value: "1",
      icon: AlertTriangle,
      bgColor: "bg-red-100",
      iconColor: "text-red-500",
    },
  ];

  const buses: BusData[] = [
    {
      id: "1",
      number: "Bus 01",
      driver: "Michael Johnson",
      status: "moving",
      position: { x: 25, y: 35 },
    },
    {
      id: "2",
      number: "Bus 02",
      driver: "Sarah Williams",
      status: "stopped",
      position: { x: 65, y: 55 },
    },
    {
      id: "3",
      number: "Bus 03",
      driver: "David Brown",
      status: "emergency",
      position: { x: 50, y: 45 },
      
    },
    {
      id: "4",
      number: "Bus 04",
      driver: "Emily Davis",
      status: "moving",
      position: { x: 35, y: 65 },
    },
    {
      id: "5",
      number: "Bus 05",
      driver: "",
      status: "offline",
      position: { x: 0, y: 0 },
    },
  ];

  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "emergency",
      title: "Emergency reported on Bus 03",
      description: "Driver: David Brown • 10 minutes ago",
      time: "10 min",
      icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
      bgColor: "bg-white",
    },
    {
      id: "2",
      type: "completed",
      title: "Bus 01 completed morning route",
      description: "Driver: Michael Johnson • 25 minutes ago",
      time: "25 min",
      icon: <Activity className="w-5 h-5 text-green-500" />,
      bgColor: "bg-white",
    },
    {
      id: "3",
      type: "assigned",
      title: "New driver Sarah Williams assigned to Bus 02",
      description: "Admin Action • 1 hour ago",
      time: "1 hour",
      icon: <Users className="w-5 h-5 text-blue-500" />,
      bgColor: "bg-white",
    },
  ];

  const getBusStatusColor = (status: string) => {
    switch (status) {
      case "moving":
        return "bg-green-500";
      case "stopped":
        return "bg-amber-500";
      case "emergency":
        return "bg-red-500";
      case "offline":
        return "bg-gray-400";
      default:
        return "bg-gray-400";
    }
  };

   const getBusCardColor = (status: string) => {
    switch (status) {
      case 'moving': return 'bg-green-50 border-green-200';
      case 'stopped': return 'bg-yellow-50 border-yellow-200';
      case 'emergency': return 'bg-red-50 border-red-200';
      case 'offline': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "moving":
        return "Moving";
      case "stopped":
        return "Stopped";
      case "emergency":
        return "Emergency";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  return (
    <div>
      <AdminNavbar />
      <main className="flex-1 min-h-screen bg-white">
        <div className="bg-gray-50 min-h-screen">
          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">
                          {stat.label}
                        </p>
                        <p className="text-3xl font-bold text-gray-900">
                          {stat.value}
                        </p>
                      </div>
                      <div
                        className={`w-14 h-14 ${stat.bgColor} rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-110`}
                      >
                        <Icon className={`w-7 h-7 ${stat.iconColor}`} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Live Bus Tracking */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-gray-900 border-l-4 border-blue-500 pl-3">
                    Live Bus Tracking
                  </h2>
                  <span className="flex items-center text-sm text-blue-600 font-medium">
                    <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                    Real-time
                  </span>
                </div>

                {/* Map */}
                <div className="relative bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl h-96 overflow-hidden">
                  {/* School Marker */}
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
                    {/* Single large transparent animated circle */}
                    <div className="relative flex items-center justify-center mb-2">
                      <span className="absolute inline-flex h-20 w-20 rounded-full bg-blue-500/20 animate-ping"></span>
                    </div>

                    {/* School label */}
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg relative z-10">
                      <span className="text-sm font-semibold">
                        Lincoln Elementary School
                      </span>
                    </div>
                  </div>

                  {/* Bus Markers */}
                  {buses
                    .filter((bus) => bus.status !== "offline")
                    .map((bus) => (
                      <div
                        key={bus.id}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                        style={{
                          left: `${bus.position.x}%`,
                          top: `${bus.position.y}%`,
                        }}
                      >
                        <div
                          className={`${getBusStatusColor(
                            bus.status
                          )} text-gray-600 px-5 py-4 rounded-2xl shadow-2xl`}
                        >
                          <div className="flex items-center space-x-3 mb-2">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <Navigation className="w-5 h-5 text-white" />
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold">{bus.number}</p>
                              <p className="text-xs opacity-90">
                                {getStatusText(bus.status)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Zoom Controls */}
                  <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
                    <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <span className="text-xl font-bold text-gray-700">+</span>
                    </button>
                    <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                      <span className="text-xl font-bold text-gray-700">−</span>
                    </button>
                  </div>

                  {/* Status Legend */}
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-md p-3">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Status Legend
                    </p>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">On Route</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Stopped</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-600">Emergency</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bus Status */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
                  Bus Status
                </h2>

                <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                  {buses.map((bus) => (
                    <Link
                      key={bus.id}
                      href={`/admin/dashboard/buses/${bus.id}`}
                      className={`group ${getBusCardColor(
                        bus.status
                      )} border-2 rounded-xl p-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex items-start justify-between`}
                    >
                      {/* Left content */}
                      <div>
                        <div className="flex items-center space-x-2 mb-2">
                          <div
                            className={`w-2 h-2 ${
                              bus.status === "moving"
                                ? "bg-green-500"
                                : bus.status === "stopped"
                                ? "bg-yellow-500"
                                : bus.status === "emergency"
                                ? "bg-red-500"
                                : "bg-gray-400"
                            } rounded-full`}
                          ></div>
                          <span className="font-semibold text-gray-900 text-sm">
                            {bus.number}
                          </span>
                        </div>

                        {bus.driver && (
                          <div className="flex items-center space-x-2 text-xs text-gray-600 mb-1">
                            <UserCircle className="w-4 h-4" />
                            <span>{bus.driver}</span>
                          </div>
                        )}

                        <span
                          className={`text-xs font-medium ${
                            bus.status === "moving"
                              ? "text-green-700"
                              : bus.status === "stopped"
                              ? "text-yellow-700"
                              : bus.status === "emergency"
                              ? "text-red-700"
                              : "text-gray-600"
                          }`}
                        >
                          {getStatusText(bus.status)}
                        </span>
                      </div>

                      {/* Hover arrow */}
                      <ArrowRight className="w-5 h-5 text-gray-400 opacity-0 translate-x-[-6px] group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                    </Link>
                  ))}
                </div>

                <Link
                  href="/admin/dashboard/buses"
                  className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50 hover:-translate-y-1 text-center"
                >
                  Manage All Buses
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="mt-6 bg-white rounded-2xl shadow-sm p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <h2 className="text-lg font-bold text-gray-900 mb-4 border-l-4 border-blue-500 pl-3">
                Recent Activity
              </h2>

              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className={`${
                      activity.bgColor
                    } border ${activity.bgColor.replace(
                      "50",
                      "200"
                    )} rounded-xl p-4 flex items-start space-x-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm transition-transform duration-300 hover:scale-110">
                      {activity.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 text-sm mb-1">
                        {activity.title}
                      </h3>
                      <p className="text-xs text-gray-600">
                        {activity.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </main>

      <AdminFooter />
    </div>
  );
}
