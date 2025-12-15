"use client";
import { useState } from "react";
import Footer from "@/components/Footer";
import BusesNavbar from "@/components/navigation/dashboard/BusStatusCard";
import { Search } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { LiaEyeSolid } from "react-icons/lia";
import { CiPower } from "react-icons/ci";
import Link from "next/link";

const BusesPage = () => {
  // Bus data (stateful so we can toggle status)
  const [buses, setBuses] = useState([
    { id: 1, name: "Bus 01", code: "SCH-101", route: "Route A - North District", driver: "Michael Johnson", capacity: 42, maxCapacity: 50, active: true },
    { id: 2, name: "Bus 02", code: "SCH-102", route: "Route B - East District", driver: "Sarah Williams", capacity: 42, maxCapacity: 50, active: true },
    { id: 3, name: "Bus 03", code: "SCH-103", route: "Route C - South District", driver: "John Doe", capacity: 38, maxCapacity: 50, active: true },
    { id: 4, name: "Bus 04", code: "SCH-104", route: "Route D - West District", driver: "Alice Brown", capacity: 47, maxCapacity: 50, active: true },
    { id: 5, name: "Bus 05", code: "SCH-105", route: "Not Assigned", driver: "Not Assigned", capacity: 0, maxCapacity: 50, active: false },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null as null | { id: number; name: string; active: boolean });

  const openStatusModal = (bus: { id: number; name: string; active: boolean }) => {
    setSelectedBus(bus);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedBus(null);
  };

  const confirmChangeStatus = () => {
    if (!selectedBus) return;
    setBuses(prev => prev.map(b => b.id === selectedBus.id ? { ...b, active: !b.active } : b));
    closeModal();
  };

  // Stats data
  const stats = [
    { title: "Total Buses", value: buses.length, color: "border-blue-200" },
    { title: "Active Buses", value: buses.filter(b => b.active).length, color: "border-green-200" },
    { title: "Total Students", value: 172, color: "border-yellow-200" },
    { title: "Avg Capacity", value: "70%", color: "border-purple-200" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <BusesNavbar />
      
      {/* Search and Add Button */}
      <div className="p-4 sm:p-8">
        <div className="flex gap-4 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search buses..." className="w-full pl-10 pr-4 py-2 border rounded-xl" />
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-500 text-white rounded-xl whitespace-nowrap">
            + Add Bus
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className={`border p-4 rounded-xl ${stat.color} bg-white`}>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-gray-500">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Bus Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {buses.map((bus) => {
            const percent = Math.round((bus.capacity / bus.maxCapacity) * 100);
            
            return (
              <div key={bus.id} className="bg-white border rounded-2xl shadow">
                {/* Header */}
                <div className={`p-4 rounded-t-2xl ${bus.active ? "bg-blue-500" : "bg-gray-300"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🚌</span>
                      <div>
                        <h3 className="text-2xl font-bold text-black">{bus.name}</h3>
                        <p className="text-sm text-gray-500">{bus.code}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-white text-sm ${bus.active ? "bg-blue-400" : "bg-gray-500"}`}>
                      {bus.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4">
                  <div className="mb-4">
                    <p className="text-gray-500 text-sm">Route</p>
                    <p className="text-gray-500">{bus.route}</p>
                  </div>

                  <div className="flex items-center mb-4">
                    <IoPersonOutline className="text-blue-500 mr-2" />
                    <div>
                      <p className="text-gray-500 text-sm">Driver</p>
                      <p className="text-gray-500">{bus.driver}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-500">Capacity</span>
                      <span className="text-gray-500 font-medium">{bus.capacity}/{bus.maxCapacity}</span>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full">
                      <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center">
                    <Link href={`/admin/dashboard/buses/${bus.id}`} className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-xl flex-1 justify-center">
                      <LiaEyeSolid /> View Details
                    </Link>
                    <div className="flex gap-2 ml-3">
                      <button onClick={() => console.log('Edit bus', bus.id)} title="Edit bus" className="text-blue-500 text-xl cursor-pointer flex items-center justify-center">
                        <FiEdit />
                      </button>
                      <button
                        onClick={() => openStatusModal(bus)}
                        aria-label={`Change status for ${bus.name}`}
                        className="text-green-500 text-xl cursor-pointer flex items-center justify-center"
                      >
                        <CiPower />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Status Change Modal */}
      {modalOpen && selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-lg max-w-md w-full p-6 z-10">
            <div className="flex items-center gap-3 mb-4">
              <CiPower className="text-green-600 text-2xl" />
              <h3 className="text-lg font-bold">Active Bus?</h3>
            </div>
            <p className="text-gray-700 mb-6">
              Are you sure you want to change <span className="font-medium">{selectedBus.name}</span>&apos;s status to <span className="font-bold text-green-600">{selectedBus.active ? "Inactive" : "Active"}</span>?
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={confirmChangeStatus} className="px-4 py-2 border border-green-500 bg-green-100 text-green-800 rounded-lg">Yes, Change Status</button>
              <button onClick={closeModal} className="px-4 py-2 rounded-lg border">Cancel</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default BusesPage;