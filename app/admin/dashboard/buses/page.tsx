"use client";
import { useState, useMemo } from "react";
import Footer from "@/components/Footer";
import BusesNavbar from "@/components/navigation/dashboard/BusStatusCard";
import { Search, X } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { LiaEyeSolid } from "react-icons/lia";
import { CiPower } from "react-icons/ci";
import Link from "next/link";
import EditBusModal from "@/components/EditBusModal";

// Define a type for the bus data
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

const initialBuses: Bus[] = [
    { id: 1, name: "Bus 01", code: "SCH-101", route: "Route A - North District", driver: "Michael Johnson", capacity: 42, maxCapacity: 50, active: true },
    { id: 2, name: "Bus 02", code: "SCH-102", route: "Route B - East District", driver: "Sarah Williams", capacity: 42, maxCapacity: 50, active: true },
    { id: 3, name: "Bus 03", code: "SCH-103", route: "Route C - South District", driver: "John Doe", capacity: 38, maxCapacity: 50, active: true },
    { id: 4, name: "Bus 04", code: "SCH-104", route: "Route D - West District", driver: "Alice Brown", capacity: 47, maxCapacity: 50, active: true },
    { id: 5, name: "Bus 05", code: "SCH-105", route: "Not Assigned", driver: "Not Assigned", capacity: 0, maxCapacity: 50, active: false },
];

const BusesPage = () => {
  const [buses, setBuses] = useState<Bus[]>(initialBuses);
  const [searchTerm, setSearchTerm] = useState(""); // State for search term

  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  // --- Add Bus Form States ---
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [route, setRoute] = useState("");
  const [driver, setDriver] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(50);
  const [active, setActive] = useState(true);

  // --- Search Functionality ---
  const filteredBuses = useMemo(() => {
    if (!searchTerm) return buses;
    const lowerCaseSearch = searchTerm.toLowerCase();
    return buses.filter(bus => 
        bus.name.toLowerCase().includes(lowerCaseSearch) ||
        bus.code.toLowerCase().includes(lowerCaseSearch) ||
        bus.route.toLowerCase().includes(lowerCaseSearch) ||
        bus.driver.toLowerCase().includes(lowerCaseSearch)
    );
  }, [buses, searchTerm]);

  // --- Modal Handlers ---
  const openStatusModal = (bus: Bus) => {
    setSelectedBus(bus);
    setShowStatusModal(true);
  };

  const closeStatusModal = () => {
    setShowStatusModal(false);
    setSelectedBus(null);
  };

  const confirmChangeStatus = () => {
    if (!selectedBus) return;
    setBuses(prev => prev.map(b => b.id === selectedBus.id ? { ...b, active: !b.active } : b));
    closeStatusModal();
  };

  const openEditModal = (bus: Bus) => {
    setSelectedBus(bus);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setShowEditModal(false);
    setSelectedBus(null);
  };

  const handleUpdateBus = (updatedBusData: Bus) => {
    setBuses(prev => prev.map(b => b.id === updatedBusData.id ? updatedBusData : b));
    closeEditModal();
  };

  // --- Add Bus Handler ---
  const handleAddBus = (e: React.FormEvent) => {
    e.preventDefault();
    const newBus: Bus = {
      id: buses.length + 1,
      name,
      code,
      route,
      driver,
      capacity,
      maxCapacity,
      active,
    };
    setBuses([...buses, newBus]);
    setShowAddForm(false);

    // Reset form
    setName("");
    setCode("");
    setRoute("");
    setDriver("");
    setCapacity(0);
    setMaxCapacity(50);
    setActive(true);
  };

  // --- Stats Data ---
  const activeBuses = buses.filter(b => b.active).length;
  const totalStudents = 172; // fixed
  const totalCapacity = buses.reduce((sum, b) => sum + b.maxCapacity, 0);
  const avgCapacity = "70%"; // fixed

  const stats = [
    { title: "Total Buses", value: buses.length, color: "border-blue-200" },
    { title: "Active Buses", value: activeBuses, color: "border-green-200" },
    { title: "Total Students", value: totalStudents, color: "border-yellow-200" },
    { title: "Avg Capacity", value: avgCapacity, color: "border-purple-200" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <BusesNavbar />
      
      {/* Search and Add Button */}
      <div className="p-4 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:gap-4 mb-5">
          <div className="relative flex-1 mb-3 sm:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search buses by name, driver, or route..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-100 text-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-600" 
            />
          </div>
          <button 
            onClick={() => setShowAddForm(!showAddForm)} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg whitespace-nowrap"
          >
            + Add Bus
          </button>
        </div>

        {/* Add Bus Form */}
        {showAddForm && (
          <form onSubmit={handleAddBus} className="mb-6 p-4 border rounded-xl shadow-sm bg-gray-50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <input type="text" placeholder="Bus Name" value={name} onChange={e => setName(e.target.value)} className="w-full border px-3 py-2 rounded-lg text-gray-700" required />
            <input type="text" placeholder="Bus Code" value={code} onChange={e => setCode(e.target.value)} className="w-full border px-3 py-2 rounded-lg text-gray-700" required />
            <input type="text" placeholder="Route" value={route} onChange={e => setRoute(e.target.value)} className="w-full border px-3 py-2 rounded-lg text-gray-700" required />
            <input type="text" placeholder="Driver Name" value={driver} onChange={e => setDriver(e.target.value)} className="w-full border px-3 py-2 rounded-lg text-gray-700" required />
            <input type="number" placeholder="Current Capacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))} className="w-full border px-3 py-2 rounded-lg text-gray-700" required />
            <input type="number" placeholder="Max Capacity" value={maxCapacity} onChange={e => setMaxCapacity(Number(e.target.value))} className="w-full border px-3 py-2 rounded-lg text-gray-700" required />
            <div className="flex items-center gap-2">
              <input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} className="w-4 h-4" />
              <label className="text-gray-700">Active</label>
            </div>
            <button type="submit" className="col-span-full px-4 py-2 bg-green-500 text-white rounded-lg">Add Bus</button>
          </form>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className={`border shadow-lg p-4 rounded-xl ${stat.color} bg-white`}>
              <p className="text-gray-500">{stat.title}</p>
              <p className=" text-gray-500">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Bus Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {filteredBuses.length > 0 ? (
            filteredBuses.map((bus) => {
              const percent = Math.round((bus.capacity / bus.maxCapacity) * 100);
              const isAssigned = bus.driver !== "Not Assigned";
              
              return (
                <div key={bus.id} className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
                  {/* Header */}
                  <div className={`p-4 rounded-t-2xl ${bus.active ? "bg-blue-400" : "bg-gray-400"}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🚌</span>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">{bus.name}</h3>
                          <p className="text-sm text-gray-600">{bus.code}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bus.active ? "bg-blue-300  text-white" : "bg-gray-300 text-white"}`}>
                        {bus.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4">
                    <div className="mb-3">
                      <p className="text-gray-500 text-sm">Route</p>
                      <p className="text-gray-500">{bus.route}</p>
                    </div>

                    <div className="flex items-center mb-3">
                      <IoPersonOutline className="text-blue-500 mr-2" />
                      <div>
                        <p className="text-gray-500 text-sm">Driver</p>
                        <p className={isAssigned ? "text-gray-5change inactive from red to 00 " : "text-gray-500"}>{bus.driver}</p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-500">Capacity</span>
                        <span className="text-gray-800 font-medium">{bus.capacity}/{bus.maxCapacity}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${percent}%`, 
                            backgroundColor: percent >= 90 ? "#EF4444" : percent >= 70 ? "#F59E0B" : "#10B981" 
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center">
                      <Link 
                        href={`/admin/dashboard/buses/${bus.id}`} 
                        className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-xl flex-1 justify-center text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        <LiaEyeSolid className="text-lg" /> View Details
                      </Link>
                      <div className="flex gap-2 ml-3">
                        <button 
                          onClick={() => openEditModal(bus)} 
                          title="Edit bus details" 
                          className="text-blue-500 text-2xl p-2 rounded-full hover:bg-blue-50 transition-colors"
                        >
                          <FiEdit />
                        </button>
                        <button
                          onClick={() => openStatusModal(bus)}
                          aria-label={`Change status for ${bus.name}`}
                          title={bus.active ? "Deactivate Bus" : "Activate Bus"}
                          className={`${bus.active ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"} text-2xl p-2 rounded-full transition-colors`}
                        >
                          <CiPower />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full text-center p-10 text-gray-500 border border-dashed rounded-xl">
              No buses found matching &ldquo;{searchTerm}&ldquo;.
            </div>
          )}
        </div>
      </div>
      
      {/* Status Change Modal */}
      {showStatusModal && selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={closeStatusModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10">
            <button 
              onClick={closeStatusModal} 
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-4">
              <CiPower className="text-2xl text-green-600" />
              <h3 className="text-lg text-gray-800 font-bold">Confirm Status Change</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change <span className="font-medium text-black">{selectedBus.name}</span>&apos;s status to <span className={`font-bold ${selectedBus.active ? "text-red-600" : "text-green-600"}`}>{selectedBus.active ? "Inactive" : "Active"}</span>?
            </p>
            <div className="flex justify-end">
              <button onClick={confirmChangeStatus} className={`px-4 py-2 rounded-lg text-white font-medium transition-colors ${selectedBus.active ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>Yes, Change Status</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Bus Modal */}
      {showEditModal && selectedBus && (
        <EditBusModal 
          bus={selectedBus}
          onClose={closeEditModal}
          onSave={handleUpdateBus}
        />
      )}

      <Footer />
    </div>
  );
};

export default BusesPage;
