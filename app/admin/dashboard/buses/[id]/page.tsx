"use client";
// app/admin/dashboard/buses/[id]/page.tsx
import { useParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import BusesNavbar from "@/components/navigation/dashboard/BusStatusCard";
import { 
    ArrowLeft, MapPin, Users, Phone, Mail, Clock, Fuel, FileText, Calendar, 
    Zap, 
    User, 
    ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import ParentDashboardMap from "../../../../../components/navigation/maps/parentDashboardMap"; 

const BusDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const busId = params.id;

  // Button handlers
  const handleLiveTracking = () => {
    router.push('/parent/dashboard');
  };

  const handleEmergencyAlert = () => {
    router.push('/admin/dashboard/emergencies');
  };

  const handleEditBusInfo = () => {
    router.push('/EditBusModal');
  };

  const handleCallDriver = () => {
    window.open(`tel:${busData.driverPhone}`);
  };
  
  // ENHANCED MOCK DATA 
  const busData = {
    id: busId,
    name: `Bus 01 - Lincoln`,
    code: `SCH-001`,
    route: `Route A: Downtown Loop`,
    driver: "Michael Johnson",
    driverPhone: "+1 (555) 987-6543",
    driverEmail: "michael.j@school.com",
    currentLocation: "5th Ave & Elm St (Stop 4)", 
    currentSpeed: 25, 
    fuelLevel: 78, 
    capacity: 42,
    maxCapacity: 50,
    active: true,
    plateNumber: `XYZ-789`,
    lastMaintenance: "2024-11-01",
    students: ["Sarah Connor", "John Smith", "Alice Jones", "Bob Brown"],
    routeHistory: [
        { date: "2024-12-02", distance: "15.2 mi", duration: "45 min" },
        { date: "2024-12-01", distance: "14.8 mi", duration: "42 min" },
        { date: "2024-11-30", distance: "15.5 mi", duration: "48 min" },
    ],
    emergencyLogs: [
        { id: 1, type: "Minor mechanical issue - tire pressure low", timestamp: "2024-12-02 at 2:45 PM", location: "5th Ave & Park St", resolution: "Driver reported and resolved on-site. No delays.", status: "Resolved" },
        { id: 2, type: "Traffic delay due to accident on main route", timestamp: "2024-11-28 at 8:15 AM", location: "3rd Ave & Main St", resolution: "Alternative route taken. Parents notified. Arrived 10 minutes late.", status: "Resolved" },
    ]
  };

  const percent = Math.round((busData.capacity / busData.maxCapacity) * 100);

  return (
    <div className="min-h-screen bg-gray-50"> 
      <BusesNavbar />
      
      <div className="p-4 sm:p-8">
        {/* Back Button */}
        <Link href="/admin/dashboard/buses" className="flex items-center gap-2 text-blue-500 mb-6 font-medium hover:text-blue-700 transition-colors">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>

        {/* Bus Info and Map */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="bg-white border rounded-2xl p-3 shadow-sm min-h-[300px]">
            <div className="bg-blue-100 p-2 rounded-xl mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🚌</span>
                <div>
                  <h1 className="text-sm font-bold text-gray-800">Bus 01</h1>
                  <p className="text-xs text-gray-600">Lincoln Elementary</p>
                </div>
              </div>
            </div>
            <div className={`w-full px-2 py-1 rounded-full text-xs font-medium text-center ${busData.active ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
              Status: {busData.active ? "Moving" : "Inactive"}
            </div>
            <div className="mt-2 space-y-1 text-xs">
              <div>
                <p className="text-gray-500">Location</p>
                <p className="font-semibold text-gray-800">5th Ave & Park St</p>
              </div>
              <div>
                <p className="text-gray-500">Last Update</p>
                <p className="font-semibold text-gray-800">11:07:54 AM</p>
              </div>
              <div className="border border-gray-300 rounded-lg p-2">
                <div className="flex items-center justify-between">
                  <p className="text-gray-500">Capacity</p>
                  <span className="font-bold text-gray-800">45/50</span>
                </div>
                <div className="bg-gray-200 h-1 rounded-full mt-1">
                  <div className="bg-blue-500 h-1 rounded-full" style={{width: '90%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Map Card - Takes remaining width */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm relative z-50">
            <div className="h-[500px] w-full relative overflow-hidden rounded-lg">
              <ParentDashboardMap />
            </div>
          </div>
        </div>

        {/* Driver Info, Students and Route History */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          
          {/* Left Column - Driver and Students */}
          <div className="space-y-6">
            {/* Driver Information Card */}
            <div className="bg-white border rounded-2xl p-3 shadow-sm min-h-[200px]">
              <h2 className="text-xs font-bold text-gray-800 mb-2 text-center flex items-center justify-center gap-1">
                <span className="text-xl">👨✈️</span>
                Driver Information
              </h2>
              <div className="text-center space-y-2">
                <div>
                  <p className="text-xs font-bold text-gray-800">Michael Johnson</p>
                  <p className="text-xs text-gray-500">Assigned Driver</p>
                </div>
                <button 
                  onClick={handleCallDriver}
                  className="w-full bg-blue-500 text-white py-1 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                >
                  <Phone size={12} /> Call
                </button>
              </div>
            </div>

            {/* Students Information Card */}
            <div className="bg-white border rounded-2xl p-3 shadow-sm min-h-[200px]">
              <h2 className="text-xs font-bold text-gray-800 mb-2 text-center flex items-center justify-center gap-1">
                <span className="text-xl">👥</span>
                {busData.students.length} Students
              </h2>
              <div className="space-y-1 max-h-20 overflow-y-auto">
                {busData.students.map((student, index) => (
                  <div key={index} className="flex items-center gap-1 text-xs">
                    <Users size={10} className="text-blue-500" />
                    <span className="text-gray-700">{student}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Route History */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Route History</h2>
            
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-2 block">Select Date</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                <option>12/02/2024</option>
                <option>2024-12-01</option>
                <option>2024-11-30</option>
              </select>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {busData.routeHistory.map((route, index) => (
                <div key={index} className="border border-gray-200 bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-semibold text-gray-800">{route.date}</span>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Completed</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Distance</p>
                      <p className="font-semibold text-gray-800">{route.distance}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Duration</p>
                      <p className="font-semibold text-gray-800">{route.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons and Emergency Log */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Action Buttons Card */}
          <div className="bg-white border rounded-2xl p-4 shadow-sm">
            <h2 className="text-sm font-bold text-gray-800 mb-3">Quick Actions</h2>
            <div className="space-y-2">
              <button 
                onClick={handleLiveTracking}
                className="w-full bg-green-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-green-600 transition-colors flex items-center justify-center gap-1"
              >
                <MapPin size={14} /> Live Tracking
              </button>
              <button 
                onClick={handleEmergencyAlert}
                className="w-full bg-red-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-red-600 transition-colors flex items-center justify-center gap-1"
              >
                <ShieldAlert size={14} /> Emergency Alert
              </button>
              <button 
                onClick={handleEditBusInfo}
                className="w-full bg-blue-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
              >
                <FileText size={14} /> Edit Bus Info
              </button>
            </div>
          </div>

          {/* Emergency Log */}
          <div className="lg:col-span-2 bg-white border rounded-2xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Emergency Log</h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4 min-h-96">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-green-800">2024-12-02 at 2:45 PM</p>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Resolved</span>
                </div>
                <p className="text-sm font-medium text-green-700 mb-2">Minor mechanical issue - tire pressure low</p>
                <p className="text-xs text-green-600 mb-1"><span className="font-bold">Location:</span> 5th Ave & Park St</p>
                <p className="text-xs text-green-600"><span className="font-bold">Resolution:</span> Driver reported and resolved on-site. No delays.</p>
              </div>
              
              <hr className="border-green-200" />
              
              <div>
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-green-800">2024-11-28 at 8:15 AM</p>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Resolved</span>
                </div>
                <p className="text-sm font-medium text-green-700 mb-2">Traffic delay due to accident on main route</p>
                <p className="text-xs text-green-600 mb-1"><span className="font-bold">Location:</span> 3rd Ave & Main St</p>
                <p className="text-xs text-green-600"><span className="font-bold">Resolution:</span> Alternative route taken. Parents notified. Arrived 10 minutes late.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default BusDetailsPage;