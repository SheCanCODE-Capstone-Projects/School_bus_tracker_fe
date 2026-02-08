"use client";
// app/admin/dashboard/buses/[id]/page.tsx
import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Footer from "@/components/Footer";
import BusesNavbar from "@/components/navigation/dashboard/BusStatusCard";
import { 
    ArrowLeft, MapPin, Users, Phone, FileText, Calendar, 
    ShieldAlert 
} from "lucide-react";
import Link from "next/link";
import AdminBusTrackingMap from "../../../../../components/navigation/maps/AdminBusTrackingMap";
import EditBusModal from "@/components/EditBusModal";
import { getAuthToken, getUserRole, redirectByRole } from "@/lib/auth";

interface Bus {
  id: number;
  name: string;
  code: string;
  route: string;
  driver: string;
  capacity: number;
  maxCapacity: number;
  active: boolean;
}

interface Student {
  fullName?: string;
  full_name?: string;
  name?: string;
  studentName?: string;
}

interface RouteHistoryAPI {
  date?: string;
  routeDate?: string;
  distance?: string;
  totalDistance?: string;
  duration?: string;
  totalDuration?: string;
}

interface EmergencyLogAPI {
  id: number;
  type?: string;
  emergencyType?: string;
  timestamp?: string;
  createdAt?: string;
  location?: string;
  resolution?: string;
  resolutionDetails?: string;
  status?: string;
}

interface RouteHistory {
  date: string;
  distance: string;
  duration: string;
}

interface BusData {
  id: number;
  name: string;
  code: string;
  route: string;
  driver: string;
  driverPhone: string;
  driverEmail: string;
  currentLocation: string;
  currentSpeed: number;
  fuelLevel: number;
  capacity: number;
  maxCapacity: number;
  active: boolean;
  plateNumber: string;
  lastMaintenance: string;
  students: string[];
  routeHistory: RouteHistory[];
  emergencyLogs: EmergencyLog[];
  latitude?: number;
  longitude?: number;
}

interface EmergencyLog {
  id: number;
  type: string;
  timestamp: string;
  location: string;
  resolution: string;
  status: string;
}

const BusDetailsPage = () => {
  const params = useParams();
  const busId = params.id;
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busData, setBusData] = useState<BusData | null>(null);

  const API_BASE_URL = 'https://school-bus-tracker-be.onrender.com/api';

  // Authentication and role check
  useEffect(() => {
    const token = getAuthToken();
    const role = getUserRole();
    
    if (!token) {
      window.location.href = '/login';
      return;
    }
    
    if (role && role !== 'admin') {
      redirectByRole();
      return;
    }
    
    if (!role) {
      window.location.href = '/login';
      return;
    }
  }, []);

  useEffect(() => {
    const fetchBusDetails = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        console.log('=== Fetching Bus Details ===');
        console.log('Bus ID:', busId);
        console.log('Token:', token ? 'Present' : 'Missing');
        
        if (!token) {
          console.error('No authentication token found');
          window.location.href = '/login';
          return;
        }
        
        const [busResponse, studentsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/buses/${busId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }),
          fetch(`${API_BASE_URL}/students`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })
        ]);
        
        console.log('Bus Response Status:', busResponse.status);
        console.log('Students Response Status:', studentsResponse.status);
        
        if (!busResponse.ok) {
          const errorText = await busResponse.text();
          console.error('API Error Response:', errorText);
          throw new Error(`API returned ${busResponse.status}`);
        }
        
        const apiResponse = await busResponse.json();
        const studentsData = studentsResponse.ok ? await studentsResponse.json() : { data: [] };
        
        console.log('=== Full API Response ===');
        console.log(JSON.stringify(apiResponse, null, 2));
        console.log('=== Students API Response ===');
        console.log(JSON.stringify(studentsData, null, 2));
        
        const busDetails = apiResponse.data || apiResponse;
        const allStudents = studentsData.data || [];
        const busStudents = allStudents.filter((s: any) => s.busId === parseInt(busId as string) || s.bus_id === parseInt(busId as string));
        
        console.log('=== Bus Details ===');
        console.log('Bus Name:', busDetails.busName);
        console.log('Bus Number:', busDetails.busNumber);
        console.log('Route:', busDetails.route);
        console.log('Status:', busDetails.status);
        console.log('Capacity:', busDetails.capacity);
        console.log('Assigned Driver:', busDetails.assignedDriver);
        console.log('Filtered Students for this bus:', busStudents);
        console.log('Students count:', busStudents.length);
        if (busStudents.length > 0) {
          console.log('First student sample:', busStudents[0]);
        }
        
        const transformedData: BusData = {
          id: busDetails.id,
          name: busDetails.busName || 'Unknown Bus',
          code: busDetails.busNumber || 'N/A',
          route: busDetails.route || 'Not Assigned',
          driver: busDetails.assignedDriver?.fullName || busDetails.assignedDriver?.full_name || 'Not Assigned',
          driverPhone: busDetails.assignedDriver?.phoneNumber || busDetails.assignedDriver?.phone_number || 'N/A',
          driverEmail: busDetails.assignedDriver?.email || 'N/A',
          currentLocation: busDetails.currentLocation || 'Location not available',
          currentSpeed: busDetails.currentSpeed || 0,
          fuelLevel: busDetails.fuelLevel || 0,
          capacity: busDetails.capacity || 0,
          maxCapacity: busDetails.maxCapacity || busDetails.capacity || 50,
          active: busDetails.status === 'ACTIVE',
          plateNumber: busDetails.plateNumber || 'N/A',
          lastMaintenance: busDetails.lastMaintenance || 'N/A',
          students: busStudents.map((s: any) => {
            const name = s.studentName || s.fullName || s.full_name || s.name || 'Unknown';
            console.log('Mapping student:', s, '-> Name:', name);
            return name;
          }),
          routeHistory: Array.isArray(busDetails.routeHistory)
            ? busDetails.routeHistory.map((r: RouteHistoryAPI) => ({
                date: r.date || r.routeDate || 'N/A',
                distance: r.distance || r.totalDistance || 'N/A',
                duration: r.duration || r.totalDuration || 'N/A'
              }))
            : [],
          emergencyLogs: Array.isArray(busDetails.emergencyLogs)
            ? busDetails.emergencyLogs.map((e: EmergencyLogAPI) => ({
                id: e.id,
                type: e.type || e.emergencyType || 'N/A',
                timestamp: e.timestamp || e.createdAt || 'N/A',
                location: e.location || 'N/A',
                resolution: e.resolution || e.resolutionDetails || 'N/A',
                status: e.status || 'Pending'
              }))
            : [],
          latitude: busDetails.latitude,
          longitude: busDetails.longitude
        };
        
        console.log('=== Transformed Bus Data ===');
        console.log(JSON.stringify(transformedData, null, 2));
        
        setBusData(transformedData);
      } catch (error) {
        console.error('=== Error Fetching Bus Details ===');
        console.error(error);
        alert('Failed to load bus details. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBusDetails();
  }, [busId]);


  const openEditModal = () => {
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
  };

  const handleUpdateBus = (updatedBusData: Bus) => {
    const transformedBusData: BusData = {
      id: updatedBusData.id,
      name: updatedBusData.name,
      code: updatedBusData.code,
      route: updatedBusData.route,
      driver: updatedBusData.driver,
      driverPhone: "+1 (555) 123-4567",
      driverEmail: "driver@school.com",
      currentLocation: "5th Ave & Elm St (Stop 4)",
      currentSpeed: 25,
      fuelLevel: 78,
      capacity: updatedBusData.capacity,
      maxCapacity: updatedBusData.maxCapacity,
      active: updatedBusData.active,
      plateNumber: "XYZ-789",
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
    setBusData(transformedBusData);
    closeEditModal();
  };

  const handleLiveTracking = () => {
    window.location.href = '/admin/dashboard';
  };

  const handleEmergencyAlert = () => {
    window.location.href = '/admin/dashboard/emergencies';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <BusesNavbar />
        <div className="flex-1 p-12 sm:p-16">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading bus details...</div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!busData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <BusesNavbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Bus not found</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <BusesNavbar />
      
      <div className="flex-1 p-12 sm:p-16">
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
                <div className={`w-full px-3 py-2 rounded-lg text-xs font-medium text-center border ${busData.active ? "bg-green-100 text-green-800 border-green-500" : "bg-red-500 text-white border-red-500"}`}>
                  Status: {busData.active ? "Moving" : "Inactive"}
                </div>
                <div className="mt-3 space-y-3 text-xs">
                  <div>
                    <div className="flex items-center gap-1">
                      <MapPin size={12} className="text-blue-500" />
                      <p className="text-gray-500">Location</p>
                    </div>
                    <p className="font-semibold text-gray-800">{busData.currentLocation}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <Calendar size={12} className="text-blue-500" />
                      <p className="text-gray-500">Last Update</p>
                    </div>
                    <p className="font-semibold text-gray-800">{new Date().toLocaleTimeString()}</p>
                  </div>
                  <div className="border border-gray-300 rounded-lg p-2 bg-gray-200">
                    <div className="flex items-center justify-between">
                      <p className="text-gray-500">Capacity</p>
                      <span className="font-bold text-gray-800 text-xs">{busData.capacity}/{busData.maxCapacity}</span>
                    </div>
                    <div className="bg-gray-300 h-2 rounded-full mt-1">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: `${(busData.capacity / busData.maxCapacity) * 100}%`}}></div>
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
                {busData.students.length > 0 ? (
                  <div className="space-y-2 max-h-20 overflow-y-auto">
                    {busData.students.map((student, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs">
                        <Users size={10} className="text-blue-500" />
                        <span className="text-gray-700">{student}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">No students assigned to this bus</p>
                )}
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
                    onClick={() => openEditModal()}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg text-xs font-medium hover:bg-blue-600 transition-colors flex items-center justify-center gap-1"
                  >
                    <FileText size={14} /> Edit Bus Info
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="lg:col-span-2 flex flex-col space-y-6">
              {/* Map Card – live tracking from driver + GPS history */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Tracking & location</h2>
                <AdminBusTrackingMap busId={busId as string} busName={busData?.name} />
              </div>

              {/* Route History Card */}
              <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Route History</h2>
                
                {busData.routeHistory.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {busData.routeHistory.map((route: RouteHistory, index: number) => (
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
                ) : (
                  <p className="text-sm text-gray-500 text-center py-8">No route history available</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Section: Emergency Log Full Width */}
          <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ShieldAlert className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-gray-800">Emergency Log</h2>
            </div>
            {busData.emergencyLogs.length > 0 ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 space-y-6">
                {busData.emergencyLogs.map((log: EmergencyLog) => (
                  <div key={log.id} className="border border-green-200 bg-green-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-green-800">{log.timestamp}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        log.status === 'Resolved' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
                      }`}>{log.status}</span>
                    </div>
                    <p className="text-sm font-medium text-green-700 mb-2">{log.type}</p>
                    <p className="text-xs text-green-600 mb-1"><span className="font-bold">Location:</span> {log.location}</p>
                    <p className="text-xs text-green-600"><span className="font-bold">Resolution:</span> {log.resolution}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <p className="text-sm text-gray-500 text-center">No emergency logs recorded</p>
              </div>
            )}
          </div>
        </div>

      </div>
      
      {/* Edit Bus Modal */}
      {showEditModal && (
        <EditBusModal
          bus={busData}
          onClose={closeEditModal}
          onSave={handleUpdateBus}
        />
      )}
      
      <Footer />
    </div>
  );
};

export default BusDetailsPage;