"use client";
// app/admin/dashboard/buses/[id]/page.tsx
import { useParams } from "next/navigation";
import { useState } from "react";
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
import EditBusModal from "@/components/EditBusModal"; 

const BusDetailsPage = () => {
  const params = useParams();
  const busId = params.id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [showEmergencyAlert, setShowEmergencyAlert] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [buses, setBuses] = useState([
    { id: 1, name: "Bus 01", code: "SCH-101", route: "Route A - North District", driver: "Michael Johnson", capacity: 42, maxCapacity: 50, active: true },
    { id: 2, name: "Bus 02", code: "SCH-102", route: "Route B - East District", driver: "Sarah Williams", capacity: 42, maxCapacity: 50, active: true },
    { id: 3, name: "Bus 03", code: "SCH-103", route: "Route C - South District", driver: "John Doe", capacity: 38, maxCapacity: 50, active: true },
    { id: 4, name: "Bus 04", code: "SCH-104", route: "Route D - West District", driver: "Alice Brown", capacity: 47, maxCapacity: 50, active: true },
    { id: 5, name: "Bus 05", code: "SCH-105", route: "Not Assigned", driver: "Not Assigned", capacity: 0, maxCapacity: 50, active: false },
  ]);
  
  // Driver data mapping
  const driverData = {
    "Michael Johnson": { phone: "+1 (555) 987-6543", email: "michael.j@school.com" },
    "Sarah Williams": { phone: "+1 (555) 123-4567", email: "sarah.w@school.com" },
    "John Doe": { phone: "+1 (555) 234-5678", email: "john.d@school.com" },
    "Alice Brown": { phone: "+1 (555) 345-6789", email: "alice.b@school.com" },
    "Not Assigned": { phone: "N/A", email: "N/A" }
  };

  // Get bus data from the buses list based on ID
  const getBusById = (id: string) => {
    return buses.find(bus => bus.id === parseInt(id)) || buses[0];
  };

  const openEditModal = (bus: any) => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateBus = (updatedBusData: any) => {
    setBuses(prev => prev.map(b => b.id === updatedBusData.id ? updatedBusData : b));
    closeEditModal();
  };

  const handleLiveTracking = () => {
    window.location.href = '/admin/dashboard';
  };

  const handleEmergencyAlert = () => {
    window.location.href = '/admin/dashboard/emergencies';
  };

  const currentBus = getBusById(busId as string);
  const currentDriverInfo = driverData[currentBus.driver as keyof typeof driverData];

  // ENHANCED MOCK DATA 
  const busData = {
    id: busId,
    name: currentBus.name,
    code: currentBus.code,
    route: currentBus.route,
    driver: currentBus.driver,
    driverPhone: currentDriverInfo.phone,
    driverEmail: currentDriverInfo.email,
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
      
      <div className="p-12 sm:p-16">
        {/* Back Button */}
        <Link href="/admin/dashboard/buses" className="flex items-center gap-2 text-blue-500 mb-6 font-medium hover:text-blue-700 transition-colors">
          <ArrowLeft size={20} /> Back to Buses 
        </Link>

        {/* Main Layout: Top Section and Bottom Emergency */}
        <div className="flex flex-col space-y-6">
          
          {/* Top Section: Left and Right Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            
            {/* Left Column */}
            <div className="space-y-6 max-w-sm">
              {/* Bus Info Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <div className="bg-blue-100 p-3 rounded-xl mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚌</span>
                    <div>
                      <h1 className="text-2xl font-bold text-gray-800">{busData.name}</h1>
                      <p className="text-xs text-gray-600">Lincoln Elementary School</p>
                    </div>
                  </div>
                </div>
                <div className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-center border ${currentBus.active ? "bg-green-100 text-green-800 border-green-500" : "bg-red-500 text-white border-red-500"}`}>
                  Status: {currentBus.active ? "Moving" : "Inactive"}
                </div>
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-blue-500" />
                      <p className="text-gray-500">Location</p>
                    </div>
                    <p className="font-semibold text-gray-800">5th Ave & Park St</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-blue-500" />
                      <p className="text-gray-500">Last Update</p>
                    </div>
                    <p className="font-semibold text-gray-800">11:07:54 AM</p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">Capacity</p>
                      <span className="font-bold text-gray-800 text-xs">{currentBus.capacity}/{currentBus.maxCapacity}</span>
                    </div>
                    <div className="bg-gray-300 h-2 rounded-full mt-1">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(currentBus.capacity / currentBus.maxCapacity) * 100}%`}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Driver Information Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-gray-800 mb-4">Driver Information</h2>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">👨‍✈️</span>
                    <div>
                      <p className="text-sm text-gray-500">{busData.driver}</p>
                      <p className="text-xs text-gray-500">{busData.driver === "Not Assigned" ? "No Driver Assigned" : "Assigned Driver"}</p>
                    </div>
                  </div>
                  <div className="p-3 border border-gray-200 rounded-lg bg-gray-50">
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-blue-500" />
                      <p className="text-xs text-gray-600">{busData.driverPhone}</p>
                    </div>
                  </div>
                  <button 
                    className={`w-full py-2 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                      busData.driver === "Not Assigned" 
                        ? "bg-gray-400 text-white cursor-not-allowed" 
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={busData.driver === "Not Assigned"}
                  >
                    <Phone size={12} /> {busData.driver === "Not Assigned" ? "No Driver" : "Contact Driver"}
                  </button>
                </div>
              </div>

              {/* Students Information Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xs font-bold text-gray-800 mb-4">Students On Board</h2>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xl">👥</span>
                  <p className="text-xs font-bold text-gray-800">{busData.students.length} Students</p>
                </div>
                <div className="space-y-2 max-h-20 overflow-y-auto">
                  {busData.students.map((student, index) => (
                    <div key={index} className="flex items-center gap-1 text-xs">
                      <Users size={10} className="text-blue-500" />
                      <span className="text-gray-700">{student}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-sm font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="space-y-3">
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
                    onClick={() => openEditModal(currentBus)}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText size={14} /> Edit Bus Info
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
              {/* Map Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <div className="h-[500px] w-full relative overflow-hidden rounded-lg">
                  <ParentDashboardMap />
                </div>
              </div>

              {/* Route History Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
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
          </div>

          {/* Bottom Section: Emergency Log Full Width */}
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-800">Emergency Log</h2>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-6 min-h-96">
              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-green-800">2024-12-02 at 2:45 PM</p>
                  <span className="bg-green-200 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">Resolved</span>
                </div>
                <p className="text-sm font-medium text-green-700 mb-2">Minor mechanical issue - tire pressure low</p>
                <p className="text-xs text-green-600 mb-1"><span className="font-bold">Location:</span> 5th Ave & Park St</p>
                <p className="text-xs text-green-600"><span className="font-bold">Resolution:</span> Driver reported and resolved on-site. No delays.</p>
              </div>
              
              <div className="border border-green-200 bg-green-50 p-4 rounded-lg">
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
      
      {/* Edit Bus Modal */}
      {showEditModal && (
        <EditBusModal
          bus={currentBus}
          onClose={closeEditModal}
          onUpdate={handleUpdateBus}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default BusDetailsPage;