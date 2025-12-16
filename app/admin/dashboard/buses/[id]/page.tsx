"use client";
// app/admin/dashboard/buses/[id]/page.tsx
import { useParams } from "next/navigation";
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
  const busId = params.id;
  
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

        {/* Bus Header */}

        <div className="bg-white text-black p-6 rounded-2xl mb-6 border shadow-sm">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className ="text-4xl">🚌</div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{busData.name}</h1>
                <p className="text-gray-600">{busData.code} • {busData.plateNumber}</p>
              </div>
            </div>
            <div className={`text-white px-4 py-2 rounded-full font-semibold text-sm ${busData.active ? "bg-green-500" : "bg-red-500"}`}>
              {busData.active ? "En Route" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN (Map, Metrics, History, Logs) - Takes 2/3 width on large screens */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map Container */}
                    <ParentDashboardMap />
            {/* Operational Metrics Card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Current Operational Metrics</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <InfoItem label="Current Location" value={busData.currentLocation} icon={<MapPin size={18} />} />
                <InfoItem label="Current Speed" value={`${busData.currentSpeed} mph`} icon={<Zap size={18} />} />
                <InfoItem label="Fuel Level" value={`${busData.fuelLevel}%`} icon={<Fuel size={18} />} />
              </div>
            </div>

            {/* Route History Card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-blue-500" /> Route History
                </h2>
                <div className="mb-4 flex gap-3 items-center">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700">
                        <option>Select Date</option>
                        <option>{busData.routeHistory[0].date}</option>
                        <option>{busData.routeHistory[1].date}</option>
                        <option>{busData.routeHistory[2].date}</option>
                    </select>
                    <span className="bg-green-100 text-green-800 px-3 py-2 rounded-lg font-medium text-sm">Completed</span>
                </div>
                
                <div className="overflow-x-auto mb-4">
                    {/* FIX 1: Hydration Error in Table */}
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                        <tr>
                            <th className="px-4 py-2">Date</th>
                            <th className="px-4 py-2">Distance</th>
                            <th className="px-4 py-2">Duration</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {busData.routeHistory.map((history, i) => (
                                <tr key={i} className="text-gray-700 text-sm hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-2 whitespace-nowrap">{history.date}</td>
                                    <td className="px-4 py-2">{history.distance}</td>
                                    <td className="px-4 py-2">{history.duration}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Emergency Log Card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <ShieldAlert size={20} className="text-red-500" /> Emergency Log
                </h2>
                <div className="space-y-4">
                    {busData.emergencyLogs.map((log) => (
                        <LogItem key={log.id} log={log} />
                    ))}
                </div>
            </div>

          </div>

          {/* RIGHT COLUMN (Actions, Driver, Bus Details, Capacity, Students) - Takes 1/3 width on large screens */}
          <div className="space-y-6">

                {/* Quick Actions */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-3 rounded-xl font-medium hover:bg-blue-600 transition-colors">
                  Edit Bus & Route
                </button>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-xl font-medium hover:bg-yellow-600 transition-colors">
                  Notify Parents
                </button>
                <button className="w-full bg-red-500 text-white py-3 rounded-xl font-medium hover:bg-red-600 transition-colors">
                  Report Incident
                </button>
              </div>
            </div>

            {/* Driver Information Card (Custom Styled as requested) */}
            <DriverCard driver={busData.driver} phone={busData.driverPhone} />
            
            {/* Consolidated Bus Details Card */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Vehicle Details</h2>
              <div className="space-y-3">
                <InfoItem label="Vehicle Plate" value={busData.plateNumber} icon={<FileText size={18} />} />
                <InfoItem label="Route Code" value={busData.code} icon={<MapPin size={18} />} />
                <InfoItem label="Last Service" value={busData.lastMaintenance} icon={<Calendar size={18} />} />
              </div>
            </div>

            {/* Capacity Section */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Student Capacity</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2 text-sm">
                  <span className="text-gray-600 font-medium">Current Load: {busData.capacity}/{busData.maxCapacity} students</span>
                  <span className="text-gray-800 font-bold">{percent}% full</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full">
                  <div 
                    className="h-4 rounded-full" 
                    style={{ 
                      width: `${percent}%`,
                        backgroundColor: percent > 80 ? "#F59E0B" : "#10B981" 
                    }}
                  ></div>
                </div>
              </div>
            </div>
            
            {/* Students List */}
            <div className="bg-white border rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-800 mb-4">On-Board Students ({busData.students.length})</h2>
              <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
                {busData.students.map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-blue-500" />
                      </div>
                      <span className="text-gray-700 font-medium">{student}</span>
                    </div>
                    <span className="text-sm text-green-600 font-semibold">Checked In</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// --- Helper Components ---

interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoItem = ({ label, value, icon }: InfoItemProps) => (
  <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
    {icon && <div className="text-blue-500">{icon}</div>}
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-800 font-medium">{value}</p>
      </div>
  </div>
);

// Custom Driver Card
interface DriverCardProps {
    driver: string;
    phone: string;
}
const DriverCard = ({ driver, phone }: DriverCardProps) => (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Driver Information</h2>
        <div className="flex flex-col items-center text-center space-y-3">
            <span className="text-5xl">👨‍✈️</span>
            <p className="text-gray-500 text-sm">Assigned Driver</p>
            <p className="text-2xl font-bold text-gray-800">{driver}</p>
        </div>
        <a href={`tel:${phone}`} className="flex items-center gap-2 w-full bg-yellow-500 text-white py-3 rounded-xl font-medium hover:bg-yellow-600 transition-colors justify-center mt-4">
            <Phone size={18} /> {phone}
        </a>
    </div>
);


// Custom Log Item
interface Log {
    id: number;
    type: string;
    timestamp: string;
    location: string;
    resolution: string;
    status: string;
}
const LogItem = ({ log }: { log: Log }) => (
    <div className="p-4 border border-red-100 bg-red-50 rounded-lg">
        <div className="flex justify-between items-start mb-2">
            <p className="font-semibold text-red-800 flex items-center gap-2 text-sm">
                <Clock size={16} /> {log.timestamp}
            </p>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${log.status === 'Resolved' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                {log.status}
            </span>
        </div>
        <p className="text-sm text-red-700 mb-2 font-medium">{log.type}</p>
        <div className="text-xs text-red-600 border-l-2 border-red-400 pl-2 space-y-1">
            <p>
                <span className="font-bold">Location:</span> {log.location}
            </p>
            <p>
                <span className="font-bold">Resolution:</span> {log.resolution}
            </p>
        </div>
    </div>
);


export default BusDetailsPage;