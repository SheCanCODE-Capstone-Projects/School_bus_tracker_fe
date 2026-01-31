'use client';
import React from 'react';
import { useState, useMemo, useEffect } from "react";
import AdminFooter from "@/components/navigation/AdminFooter";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import { Search, X, Bus, UserPlus } from "lucide-react";
import { FiEdit } from "react-icons/fi";
import { IoPersonOutline } from "react-icons/io5";
import { LiaEyeSolid } from "react-icons/lia";
import { CiPower } from "react-icons/ci";
import Link from "next/link";
import EditBusModal from "@/components/EditBusModal";
import { getAuthToken } from "@/lib/auth";

// Custom Dropdown Component
function CustomDropdown({ schools, selectedSchool, setSelectedSchool }: {
  schools: School[];
  selectedSchool: number | "";
  setSelectedSchool: (value: number | "") => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative pb-8">
      <label className="block text-xs text-black mb-2">School</label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full bg-white text-gray-400 text-left  px-3 py-2  rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
      >
        {selectedSchool ? schools.find(s => s.id === selectedSchool)?.name : "Choose a school"}
      </button>

      {open && (
        <ul className="absolute mt-2 w-full bg-blue-400  rounded-lg shadow-lg z-10">
          {schools.map((s) => (
            <li
              key={s.id}
              onClick={() => {
                setSelectedSchool(s.id);
                setOpen(false);
              }}
              className="px-3 py-2 cursor-pointer text-white hover:bg-blue-400"
            >
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// API-based interfaces
interface Driver {
  fullName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: string;
}

interface ApiBus {
  id: number;
  busName: string;
  busNumber: string;
  capacity: number;
  route: string;
  status: string;
  assignedDriver?: Driver;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

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

interface School { id: number; name: string; }

const API_BASE_URL = "https://school-bus-tracker-be.onrender.com/api";

const BusesPage = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  // Store drivers fetched from backend
const [drivers, setDrivers] = useState<{ id: number; fullName: string }[]>([]);

  // Authentication check
  useEffect(() => {
    const token = getAuthToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }
  }, []);

  // Modal states
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);
  const [showAssignDriverModal, setShowAssignDriverModal] = useState(false);

  // Assign Driver modal states
  const [selectedDriverForBus, setSelectedDriverForBus] = useState<number | "">("");
  const [selectedBusForDriver, setSelectedBusForDriver] = useState<number | "">("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");

  // Add Bus form states
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [route, setRoute] = useState("");
  const [driver, setDriver] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [maxCapacity, setMaxCapacity] = useState(50);
  const [active, setActive] = useState(true);

  // Schools
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<number | "">("");

  useEffect(() => {
    const fetchBuses = async () => {
      try {
        setLoading(true);
        const token = getAuthToken();
        
        if (!token) {
          console.log('No token found');
          window.location.href = '/login';
          return;
        }
        
        const response = await fetch(`${API_BASE_URL}/buses`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const apiResponse: ApiResponse<ApiBus[]> = await response.json();
          if (apiResponse.success && apiResponse.data) {
            const transformedBuses: Bus[] = apiResponse.data.map(apiBus => ({
              id: apiBus.id,
              name: apiBus.busName,
              code: apiBus.busNumber,
              route: apiBus.route,
              driver: apiBus.assignedDriver?.fullName || "Not Assigned",
              capacity: apiBus.capacity,
              maxCapacity: apiBus.capacity,
              active: apiBus.status === "ACTIVE"
            }));
            setBuses(transformedBuses);
          }
        } else {
          console.log('API failed, no fallback data');
        }
      } catch (error) {
        console.error('Error fetching buses:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBuses();
  }, []);
  // --- Fetch drivers ---
useEffect(() => {
  const fetchDrivers = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        console.log('No token found for drivers');
        return;
      }

      const res = await fetch(`${API_BASE_URL}/drivers`, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      });

      if (!res.ok) {
        console.error('Failed to fetch drivers:', res.status);
        return;
      }

      const data = await res.json();
      if (data.success && data.data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const driverList = data.data.map((driver: any) => ({
          id: driver.id,
          fullName: driver.full_name
        }));
        setDrivers(driverList);
      }

    } catch (err) {
      console.error("Error fetching drivers:", err);
    }
  };

  fetchDrivers();
}, []);


  useEffect(() => {
    (async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(`${API_BASE_URL}/schools`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        });
        if (!res.ok) {
          setSchools([{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
          return;
        }
        const data = await res.json();
        console.log('Schools API response:', data);
        const schoolsArray = data?.content || data?.data || data?.schools || data || [];
        setSchools(Array.isArray(schoolsArray) ? schoolsArray : [{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
      } catch (err) {
        console.error("Failed to load schools:", err);
        setSchools([{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
      }
    })();
  }, []);
  
  
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
  //change status based on the apis
 const confirmChangeStatus = async () => {
  if (!selectedBus) return;

  const newStatus = !selectedBus.active; // the new status we want

  try {
    const token = getAuthToken();
    if (!token) {
      alert("No auth token found. Please login again.");
      return;
    }

    const res = await fetch(`${API_BASE_URL}/buses/${selectedBus.id}/status`, {
      method: "PATCH", // or PUT depending on the backend
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ status: newStatus ? "ACTIVE" : "INACTIVE" })
    });

    if (!res.ok) {
      const errorText = await res.text();
      alert("Failed to update bus status: " + errorText);
      return;
    }

    // Update UI only if API succeeded
    setBuses((prev: Bus[]) =>
      prev.map((b: Bus) => b.id === selectedBus.id ? { ...b, active: newStatus } : b)
    );
    closeStatusModal();

  } catch (err) {
    console.error("Error updating bus status:", err);
    alert("Error updating bus status. See console for details.");
  }
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
    setBuses((prev: Bus[]) => prev.map((b: Bus) => b.id === updatedBusData.id ? updatedBusData : b));
    closeEditModal();
  };

  // --- Add Bus Handler (uses backend, logs payload) ---
  const handleAddBus = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate truly unique bus number to avoid duplicates
    const timestamp = Date.now();
    const uniqueBusNumber = code || `SCH-${timestamp.toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
    
    const payload = {
      busName: name,
      busNumber: uniqueBusNumber,
      capacity,
      route,
      status: active ? "ACTIVE" : "INACTIVE"
    };

    console.log("Posting new bus payload:", payload);
    console.log("Selected school ID:", selectedSchool);

    try {
      const token = getAuthToken();
      console.log("Auth token:", token ? `${token.substring(0, 20)}...` : "No token");
      
      const url = selectedSchool ? `${API_BASE_URL}/buses?schoolId=${selectedSchool}` : `${API_BASE_URL}/buses`;
      console.log("Request URL:", url);
      console.log("Request headers:", {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token.substring(0, 20)}...` : "No auth"
      });
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      console.log("Network response status:", res.status);
      console.log("Network response statusText:", res.statusText);
      console.log("Network response headers:", Object.fromEntries(res.headers.entries()));
      let apiResponse: ApiResponse<ApiBus> | null = null;
      
      if (res.ok) {
        try {
          apiResponse = await res.json();
          console.log("Response JSON:", apiResponse);
        } catch (jsonError) {
          console.error("Failed to parse JSON:", jsonError);
        }
      } else {
        console.log(`API error: ${res.status} ${res.statusText}`);
        
        // Handle 403 specifically - token might be expired
        if (res.status === 403) {
          console.log('403 Forbidden - Token may be expired or insufficient permissions');
          localStorage.removeItem('authToken');
          alert('Session expired or insufficient permissions. Please login again.');
          window.location.href = '/login';
          return;
        }
        
        // Handle 400 - Bad Request
        if (res.status === 400) {
          try {
            const errorResponse = await res.text();
            console.log('400 Bad Request - Server response:', errorResponse);
            const errorData = JSON.parse(errorResponse);
            if (errorData.message && errorData.message.includes('duplicate key')) {
              alert('Bus number already exists. Please use a different bus number.');
            } else {
              alert(`Bad Request: ${errorData.message || 'Invalid data sent to server'}`);
            }
          } catch (e) {
            console.log('400 Bad Request - Could not read error response');
            alert('Bad Request: Invalid data sent to server');
          }
          return;
        }
      }

      if (res.ok && apiResponse?.success && apiResponse.data) {
        const newBus: Bus = {
          id: apiResponse.data.id,
          name: apiResponse.data.busName,
          code: apiResponse.data.busNumber,
          route: apiResponse.data.route,
          driver: apiResponse.data.assignedDriver?.fullName || "Not Assigned",
          capacity: apiResponse.data.capacity,
          maxCapacity: apiResponse.data.capacity,
          active: apiResponse.data.status === "ACTIVE"
        };
        setBuses((prev: Bus[]) => [...prev, newBus]);
        alert('Bus added successfully!');
      } else {
        setBuses((prev: Bus[]) => [...prev, { id: Date.now(), name, code: uniqueBusNumber, route, driver, capacity, maxCapacity, active }]);
      }
    } catch (err) {
      console.error("POST /api/buses failed:", err);
      setBuses((prev: Bus[]) => [...prev, { id: Date.now() + Math.random(), name, code: uniqueBusNumber, route, driver, capacity, maxCapacity, active }]);
    }

    setShowAddForm(false);

    // Reset form
    setName("");
    setCode("");
    setRoute("");
    setDriver("");
    setCapacity(0);
    setMaxCapacity(50);
    setActive(true);
    setSelectedSchool("");
  };

  // --- Assign Driver Handler ---
  const openAssignDriverModal = () => setShowAssignDriverModal(true);
  const closeAssignDriverModal = () => {
    setShowAssignDriverModal(false);
    setSelectedDriverForBus("");
    setSelectedBusForDriver("");
    setStartDate("");
    setNotes("");
  };
 // --- Assign Driver Handler ---
const handleAssignDriverSubmit = async () => {
  if (!selectedDriverForBus || !selectedBusForDriver) {
    alert("Please select both a driver and a bus.");
    return;
  }

  try {
    const token = getAuthToken();
    if (!token) {
      alert("No auth token found. Please login again.");
      window.location.href = '/login';
      return;
    }

    const busId = Number(selectedBusForDriver);
    const driverId = Number(selectedDriverForBus);

    // Check if bus is already assigned
    const selectedBusData = buses.find(bus => bus.id === busId);
    if (selectedBusData && selectedBusData.driver && selectedBusData.driver !== "Not Assigned") {
      const confirmReassign = confirm(`Bus ${selectedBusData.name} is already assigned to ${selectedBusData.driver}. Do you want to reassign it?`);
      if (!confirmReassign) {
        return;
      }
    }

    console.log('Assigning driver:', { busId, driverId });

    const res = await fetch(`${API_BASE_URL}/admin/assign-bus-to-driver`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({ driverId, busId }),
    });

    console.log(`Response status: ${res.status}`);

    if (res.ok) {
      const data = await res.json();
      console.log("Driver assigned successfully:", data);
      
      const assignedDriver = drivers.find(d => d.id === driverId);
      const selectedBusData = buses.find(b => b.id === busId);
      
      setBuses(prev =>
        prev.map(bus =>
          bus.id === busId ? { ...bus, driver: assignedDriver?.fullName || "Assigned" } : bus
        )
      );
      
      alert(`Driver ${assignedDriver?.fullName || 'Unknown'} has been assigned to ${selectedBusData?.name || 'Bus'} successfully!`);
      closeAssignDriverModal();
    } else {
      const errorText = await res.text();
      console.error('Assignment failed:', errorText);
      
      try {
        const errorData = JSON.parse(errorText);
        if (errorData.message?.includes('duplicate key') || errorData.message?.includes('already exists')) {
          alert('This bus is already assigned to another driver. Please unassign the current driver first or choose a different bus.');
        } else {
          alert(`Assignment failed: ${errorData.message || 'Unknown error'}`);
        }
      } catch {
        if (res.status === 403) {
          alert('Permission denied. You may not have admin privileges to assign drivers.');
        } else if (res.status === 401) {
          localStorage.removeItem('authToken');
          alert('Session expired. Please login again.');
          window.location.href = '/login';
        } else {
          alert(`Failed to assign driver: ${res.status} - ${errorText}`);
        }
      }
    }

  } catch (err) {
    console.error('Error assigning driver:', err);
    alert('Network error. Please try again.');
  }
};



  // --- Stats Data ---
  const activeBuses = buses.filter(b => b.active).length;
  const totalStudents = 172;
  const avgCapacity = "70%";
  const stats = [
    { title: "Total Buses", value: buses.length, color: "border-blue-200" },
    { title: "Active Buses", value: activeBuses, color: "border-green-200" },
    { title: "Total Students", value: totalStudents, color: "border-yellow-200" },
    { title: "Avg Capacity", value: avgCapacity, color: "border-purple-200" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <AdminNavbar />
        <div className="flex-1 px-8 sm:px-12 lg:px-16 py-4 sm:py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading buses...</div>
          </div>
        </div>
        <AdminFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AdminNavbar />

      {/* Search and Buttons */}
      <div className="flex-1 px-8 sm:px-12 lg:px-16 py-4 sm:py-8">
        <div className="flex flex-col sm:flex-row sm:gap-4 mb-5">
          <div className="relative flex-1 mb-3 sm:mb-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Search buses by name, driver, or route..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-blue-100 text-gray-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-blue-600"
            />
          </div>

          {/* Assign Driver Button */}
          <button 
            onClick={openAssignDriverModal}
            className="flex items-center gap-2 px-4 py-2 justify-center mb-2 bg-purple-500 transition-transform duration-300 hover:scale-105 text-white rounded-lg whitespace-nowrap"
          >
            <UserPlus size={16} />
            Assign driver
          </button>

          {/* Add Bus Button */}
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 mb-2 bg-blue-500 transition-transform duration-300 hover:scale-105 text-white rounded-lg whitespace-nowrap"
          >
            + Add Bus
          </button>
        </div>

        {/* Add Bus Modal */}
        {showAddForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={() => setShowAddForm(false)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10">
              <button 
                onClick={() => setShowAddForm(false)} 
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <Bus className="w-6 h-6 text-blue-500" />
                <h3 className="text-lg font-bold text-gray-700">Add New Bus</h3>
              </div>

              <form onSubmit={handleAddBus} className="space-y-4">
               <div>
  <label className="block text-xs text-black mb-1">Bus Name</label>
  <input
    type="text"
    placeholder="Bus 06"
    value={name}
    onChange={e => setName(e.target.value)}
    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
    required
  />
</div>

<div>
  <label className="block text-xs text-black mb-1">Bus Number</label>
  <input
    type="text"
    placeholder="SCH-106"
    value={code}
    onChange={e => setCode(e.target.value)}
    className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 
               focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"
    required
  />
</div>

                <CustomDropdown
                  schools={schools}
                  selectedSchool={selectedSchool}
                  setSelectedSchool={setSelectedSchool}
                />

                <div>
                  <label className="block text-xs text-black mb-1">Max Capacity</label>
                  <input type="number" placeholder="50" value={maxCapacity} onChange={e => setMaxCapacity(Number(e.target.value))} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-300" required />
                </div>
                <div>
                  <label className="block text-xs text-black mb-1">Current Filled</label>
                  <input type="number" placeholder="0" value={capacity} max={maxCapacity} onChange={e => {
                    const value = Number(e.target.value);
                    if (value > maxCapacity) {
                      alert(`Current filled (${value}) cannot exceed max capacity (${maxCapacity})`);
                      return;
                    }
                    setCapacity(value);
                  }} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"/>
                </div>

                <div>
                  <label className="block text-xs text-black mb-1">Route</label>
                  <input type="text" placeholder="Route E - Central District" value={route} onChange={e => setRoute(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300"/>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors">Add Bus</button>
                  <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, i) => (
            <div key={i} className={`border shadow-lg p-4 rounded-xl ${stat.color} bg-white transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
              <p className="text-gray-500">{stat.title}</p>
              <p className=" text-gray-500">{stat.value}</p>
            </div>
          ))}
        </div>


        {/* Bus Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBuses.length > 0 ? (
            filteredBuses.map(bus => {
              const percent = Math.round((bus.capacity / bus.maxCapacity) * 100);
              const getCapacityColor = () => {
                if (bus.capacity === 0) return "#D1D5DB";
                if (bus.capacity <= 20) return "#EF4444";
                if (bus.capacity <= 30) return "#F97316";
                return "#10B981";
              };
              return (
                <div key={`bus-${bus.id}-${bus.code}`} className="bg-white border rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
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
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${bus.active ? "bg-blue-300  text-white" : "bg-gray-300 text-white"}`}>
                        {bus.active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <p className="text-gray-500 text-xs">Route</p>
                      <p className="text-gray-500 text-xs">{bus.route}</p>
                    </div>
                    <div className="mb-4">
                      <p className="text-gray-500 text-xs mb-1">Driver</p>
                      <div className="flex items-center">
                        <span className="text-blue-500 mr-2">
                          <IoPersonOutline size={16} />
                        </span>
                        <p className="text-gray-500 text-xs">{bus.driver}</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Capacity</span>
                        <span className="text-gray-800 font-medium">{bus.capacity}/{bus.maxCapacity}</span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-gray-300">
                        <div 
                          className="h-full rounded-full" 
                          style={{ 
                            width: `${percent}%`, 
                            backgroundColor: getCapacityColor()
                          }}
                        ></div>
                      </div>
                    </div>

                    <hr className="border-gray-200 my-4" />

                    {/* Action Buttons */}
                    <div className="flex items-center">
                      <Link 
                        href={`/admin/dashboard/buses/${bus.id}`} 
                        className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded-xl flex-1 justify-center text-sm font-medium hover:bg-blue-600 transition-colors"
                      >
                        <LiaEyeSolid size={18} /> View Details
                      </Link>
                      <div className="flex gap-2 ml-3">
                        <button onClick={() => openEditModal(bus)} className="text-blue-500 text-lg p-2 rounded-full hover:bg-blue-50 transition-colors">
                          <FiEdit size={18} />
                        </button>
                        <button
                          onClick={() => openStatusModal(bus)}
                          aria-label={`Change status for ${bus.name}`}
                          title={bus.active ? "Deactivate Bus" : "Activate Bus"}
                          className={`${bus.active ? "text-red-500 hover:bg-red-50" : "text-green-500 hover:bg-green-50"} text-lg p-2 rounded-full transition-colors`}
                        >
                          <CiPower size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="col-span-full text-center p-10 text-gray-500 border border-dashed rounded-xl">
              No buses found matching &ldquo;{searchTerm}&ldquo;.
            </div>
          )}
        </div>
      </div>

      {/* Assign Driver Modal */}
      {showAssignDriverModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeAssignDriverModal}></div>
       <div className="relative bg-white rounded-4xl shadow-2xl max-w-[400px] w-full h-[90vh] p-6">


            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={20} className="text-purple-600" />
              <h3 className="text-lg mt-4 mb-4 font-bold text-gray-700">Assign Driver to Bus</h3>
            </div>

            <div className="space-y-8">
              {/* Select Driver */}
              <div className="mb-8">
                <label className="block text-xs text-black mb-2">Select Driver</label>
                <select
                  value={selectedDriverForBus}
                  onChange={(e) => setSelectedDriverForBus(e.target.value ? Number(e.target.value) : "")}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Choose a driver</option>
                  {drivers
                    .filter(driver =>
                      !buses.some(bus =>
                        bus.driver &&
                        bus.driver !== "Not Assigned" &&
                        bus.driver.trim() === driver.fullName.trim()
                      )
                    )
                    .map(driver => (
                      <option key={driver.id} value={driver.id}>
                        {driver.fullName}
                      </option>
                    ))
                  }
                </select>
                <p className="text-xs mt-2 text-gray-700">Only showing unassigned drivers</p>
              </div>

              {/* Assign to Bus */}
              <div className="mb-12">
                <label className="block text-xs text-black mb-2">Assign to Bus</label>
                <select
                  value={selectedBusForDriver}
                  onChange={(e) => setSelectedBusForDriver(e.target.value ? Number(e.target.value) : "")}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="">Select a bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id}>
                      {bus.name} {bus.driver !== "Not Assigned" ? `(Currently: ${bus.driver})` : "(Available)"}
                    </option>
                  ))}
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block mt-2 mb-2  text-xs text-black">Start Date</label>
                <input 
                  type="date" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  className="w-full mt-2 mb-2  text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs mt-2 mb-2  text-black">Notes (Optional)</label>
                <textarea
                  placeholder="Any additional notes about this assignment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-2 mb-2 text-sm border border-gray-300 px-3 h-30 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <hr className="mb-4"></hr>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2 ">
                <button 
                  onClick={handleAssignDriverSubmit} 
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Assign Driver
                </button>
                <button 
                  onClick={closeAssignDriverModal} 
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && selectedBus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeStatusModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 z-10">
            <button onClick={closeStatusModal} className="absolute top-3 right-3 text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-full ${selectedBus.active ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                <CiPower size={24} />
              </div>
              <h3 className="text-lg text-gray-800 font-bold">Confirm Status Change</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to change <span className="text-black font-semibold">{selectedBus.name}</span>&apos;s status to <span className={`font-bold ${selectedBus.active ? "text-red-600" : "text-green-600"}`}>{selectedBus.active ? "Inactive" : "Active"}</span>?
            </p>
            <div className="flex justify-end">
              <button onClick={confirmChangeStatus} className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 ${selectedBus.active ? "bg-orange-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>Yes, Change Status</button>
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

      <AdminFooter />
    </div>
  );
};

export default BusesPage;