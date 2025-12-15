"use client";
import { useParams } from "next/navigation";
import Footer from "@/components/Footer";
import BusesNavbar from "@/components/navigation/dashboard/BusStatusCard";
import { ArrowLeft, MapPin, Users, Phone, Mail } from "lucide-react";
import Link from "next/link";

const BusDetailsPage = () => {
  const params = useParams();
  const busId = params.id;
  
  // This data would normally come from an API
  const busData = {
    id: busId,
    name: `Bus ${busId}`,
    code: `SCH-${busId}01`,
    route: `Route ${String.fromCharCode(64 + Number(busId))} - District`,
    driver: "Driver Name",
    capacity: 42,
    maxCapacity: 50,
    active: true,
    plateNumber: `XYZ-${busId}23`,
    lastMaintenance: "2024-01-15",
    students: ["Student 1", "Student 2", "Student 3"],
  };

  const percent = Math.round((busData.capacity / busData.maxCapacity) * 100);

  return (
    <div className="min-h-screen bg-white">
      <BusesNavbar />
      
      <div className="p-4 sm:p-8">
        {/* Back Button */}
        <Link href="/admin/dashboard/buses" className="flex items-center gap-2 text-blue-500 mb-6">
          <ArrowLeft size={20} /> Back to Buses
        </Link>

        {/* Bus Header */}
        <div className="bg-blue-500 text-black p-6 rounded-2xl mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center gap-4 mb-4 sm:mb-0">
              <div className="text-4xl">🚌</div>
              <div>
                <h1 className="text-2xl  font-bold">{busData.name}</h1>
                <p className=" text-gray-700">{busData.code} • {busData.plateNumber}</p>
              </div>
            </div>
            <div className={`text-white px-4 py-2 rounded-full ${busData.active ? "bg-blue-400" : "bg-gray-400"}`}>
              {busData.active ? "Active" : "Inactive"}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-black mb-4">Bus Information</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem label="Route" value={busData.route} icon={<MapPin size={18} />} />
                <InfoItem label="Driver" value={busData.driver} icon={<Users size={18} />} />
                <InfoItem label="Phone" value="+1234567890" icon={<Phone size={18} />} />
                <InfoItem label="Email" value="driver@example.com" icon={<Mail size={18} />} />
                <InfoItem label="Last Maintenance" value={busData.lastMaintenance} />
                <InfoItem label="Status" value={busData.active ? "Running" : "Maintenance"} />
              </div>
            </div>

            {/* Capacity Section */}
            <div className="bg-white border rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-black mb-4">Capacity</h2>
              <div className="mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-500 font-medium">Current: {busData.capacity}/{busData.maxCapacity} students</span>
                  <span className="text-gray-500 font-bold">{percent}% full</span>
                </div>
                <div className="w-full bg-gray-200 h-4 rounded-full">
                  <div className="bg-green-500 h-4 rounded-full" style={{ width: `${percent}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Students */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-black mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full bg-blue-500 text-white py-3 rounded-xl hover:bg-blue-600">
                  Edit Bus Details
                </button>
                <button className="w-full bg-green-500 text-white py-3 rounded-xl hover:bg-green-600">
                  Track Location
                </button>
                <button className="w-full bg-yellow-500 text-white py-3 rounded-xl hover:bg-yellow-600">
                  Maintenance Request
                </button>
              </div>
            </div>

            {/* Students List */}
            <div className="bg-white border rounded-2xl p-6 shadow-md">
              <h2 className="text-xl font-bold text-black mb-4">Students ({busData.students.length})</h2>
              <div className="space-y-3">
                {busData.students.map((student, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Users size={16} className="text-blue-500" />
                      </div>
                      <span className="text-gray-500">{student}</span>
                    </div>
                    <span className="text-sm text-gray-500">Grade {i + 5}</span>
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

// Helper component
interface InfoItemProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

const InfoItem = ({ label, value, icon }: InfoItemProps) => (
  <div className="flex items-center gap-3">
    {icon && <div className="text-blue-500">{icon}</div>}
    <div>
      <p className="text-gray-500 text-sm">{label}</p>
      <p className="text-gray-500 font-medium">{value}</p>
    </div>
  </div>
);

export default BusDetailsPage;