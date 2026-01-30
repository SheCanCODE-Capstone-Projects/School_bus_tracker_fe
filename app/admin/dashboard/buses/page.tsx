/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { getAuthToken, getUserRole } from "@/lib/auth";

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

  // Enhanced JWT token decoding and role verification with expiry check
  const decodeJWT = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding JWT:', error);
      return null;
    }
  };

  // Check if token is expired or will expire soon (within 5 minutes)
  const isTokenExpired = (token: string) => {
    const payload = decodeJWT(token);
    if (!payload?.exp) return false;
    const expiryTime = payload.exp * 1000;
    const currentTime = Date.now();
    const fiveMinutes = 5 * 60 * 1000;
    return expiryTime - currentTime < fiveMinutes;
  };

  // Refresh token function
  const refreshToken = async () => {
    try {
      const currentToken = getAuthToken();
      if (!currentToken) return null;

      const refreshEndpoints = [
        `${API_BASE_URL}/auth/refresh`,
        `${API_BASE_URL}/refresh-token`,
        `${API_BASE_URL}/token/refresh`
      ];

      for (const endpoint of refreshEndpoints) {
        try {
          const res = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${currentToken}`,
              'Content-Type': 'application/json'
            }
          });

          if (res.ok) {
            const data = await res.json();
            const newToken = data.token || data.accessToken || data.access_token;
            if (newToken) {
              localStorage.setItem('authToken', newToken);
              console.log('Token refreshed successfully');
              return newToken;
            }
          }
        } catch (err) {
          console.log(`Refresh failed for ${endpoint}:`, err);
        }
      }
      return null;
    } catch (err) {
      console.error('Token refresh error:', err);
      return null;
    }
  };

  // Simplified token validation
  const getValidToken = async () => {
    const token = getAuthToken();
    if (!token) {
      console.log('No token available');
      return null;
    }

    // Check if token is expired locally
    if (isTokenExpired(token)) {
      console.log('Token expired, attempting refresh...');
      const newToken = await refreshToken();
      if (newToken) {
        console.log('Token refreshed successfully');
        return newToken;
      } else {
        console.log('Token refresh failed');
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        return null;
      }
    }
    
    return token;
  };

  // Comprehensive role and permission checking
  const token = getAuthToken();
  const tokenPayload = token ? decodeJWT(token) : null;
  const userRoleFromToken = tokenPayload?.role || tokenPayload?.authorities?.[0] || tokenPayload?.scope || tokenPayload?.roles?.[0];
  const userRoleFromStorage = getUserRole();
  
  console.log("=== AUTHENTICATION DEBUG ===");
  console.log("Token exists:", !!token);
  console.log("Token payload:", tokenPayload);
  console.log("User role from token:", userRoleFromToken);
  console.log("User role from localStorage:", userRoleFromStorage);
  console.log("Token expiry:", tokenPayload?.exp ? new Date(tokenPayload.exp * 1000) : 'No expiry');
  console.log("Current time:", new Date());
  console.log("Token valid:", tokenPayload?.exp ? tokenPayload.exp * 1000 > Date.now() : 'Unknown');
  
  // Test user permissions
  const testUserPermissions = async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      console.log('=== TESTING USER PERMISSIONS ===');
      
      // Test different permission endpoints
      const permissionTests = [
        `${API_BASE_URL}/user/permissions`,
        `${API_BASE_URL}/auth/permissions`,
        `${API_BASE_URL}/me/permissions`,
        `${API_BASE_URL}/profile`
      ];

      for (const endpoint of permissionTests) {
        try {
          const res = await fetch(endpoint, {
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            }
          });
          
          if (res.ok) {
            const data = await res.json();
            console.log(`Permissions from ${endpoint}:`, data);
          } else {
            console.log(`${endpoint} returned:`, res.status);
          }
        } catch (err) {
          console.log(`${endpoint} failed:`, err.message);
        }
      }
    } catch (err) {
      console.log('Permission test failed:', err);
    }
  };

  // Test permissions on component mount
  useEffect(() => {
    if (token) {
      testUserPermissions();
    }
  }, [token]);

  // Always show assign driver button for admin users
  const canAssignDrivers = true;

  // Bypass authentication temporarily to test
  useEffect(() => {
    console.log('Skipping authentication check for debugging');
  }, []);

  // Set up token refresh interval
  useEffect(() => {
    const interval = setInterval(async () => {
      const token = getAuthToken();
      if (token && isTokenExpired(token)) {
        console.log('Token expiring, refreshing...');
        await getValidToken();
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
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
        
        // Use mock data if API fails
        const mockBuses: Bus[] = [
          {
            id: 1,
            name: "Bus 01",
            code: "SCH-101",
            route: "Route A - Downtown",
            driver: "John Doe",
            capacity: 25,
            maxCapacity: 50,
            active: true
          },
          {
            id: 2,
            name: "Bus 02",
            code: "SCH-102",
            route: "Route B - Suburbs",
            driver: "Not Assigned",
            capacity: 0,
            maxCapacity: 45,
            active: false
          }
        ];
        
        const token = await getValidToken();
        
        if (!token) {
          console.log('No token, using mock data');
          setBuses(mockBuses);
          setLoading(false);
          return;
        }
        
        console.log('Fetching buses from API...');
        
        const response = await fetch(`${API_BASE_URL}/admin/actions/buses`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        console.log('Buses API response status:', response.status);
        
        if (response.ok) {
          const apiResponse = await response.json();
          console.log('Buses API response:', apiResponse);
          
          let busesData = [];
          if (apiResponse?.success && Array.isArray(apiResponse.data)) {
            busesData = apiResponse.data;
          } else if (Array.isArray(apiResponse)) {
            busesData = apiResponse;
          } else if (Array.isArray(apiResponse?.buses)) {
            busesData = apiResponse.buses;
          } else if (Array.isArray(apiResponse?.content)) {
            busesData = apiResponse.content;
          } else {
            console.warn('Unexpected API response, using mock data');
            setBuses(mockBuses);
            return;
          }
          
          const transformedBuses: Bus[] = busesData.map((apiBus: any) => ({
            id: apiBus.id || 0,
            name: apiBus.busName || apiBus.name || 'Unknown Bus',
            code: apiBus.busNumber || apiBus.code || 'N/A',
            route: apiBus.route || 'No Route',
            driver: apiBus.assignedDriver?.full_name || apiBus.assignedDriver?.fullName || apiBus.driver || "Not Assigned",
            capacity: Number(apiBus.currentCapacity || apiBus.capacity || 0),
            maxCapacity: Number(apiBus.maxCapacity || apiBus.capacity || 50),
            active: apiBus.status === "ACTIVE" || apiBus.active === true
          }));
          
          setBuses(transformedBuses);
          console.log('Buses loaded from API:', transformedBuses.length);
        } else {
          console.log('API failed with status:', response.status, 'using mock data');
          setBuses(mockBuses);
        }
      } catch (error) {
        console.error('Error fetching buses, using mock data:', error);
        setBuses([
          {
            id: 1,
            name: "Bus 01",
            code: "SCH-101",
            route: "Route A - Downtown",
            driver: "John Doe",
            capacity: 25,
            maxCapacity: 50,
            active: true
          }
        ]);
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

        console.log('Fetching drivers...');
        const res = await fetch(`${API_BASE_URL}/admin/actions/drivers`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });

        console.log('Drivers API response status:', res.status);
        
        if (res.ok) {
          const data = await res.json();
          console.log('Drivers API response:', data);
          
          let driversData = [];
          if (data?.success && Array.isArray(data.data)) {
            driversData = data.data;
          } else if (Array.isArray(data)) {
            driversData = data;
          } else if (Array.isArray(data?.drivers)) {
            driversData = data.drivers;
          } else {
            console.warn('Unexpected drivers API response structure:', data);
            return;
          }
          
          const driverList = driversData.map((driver: any) => ({
            id: driver.id || 0,
            fullName: driver.name || driver.full_name || driver.fullName || 'Unknown Driver'
          }));
          
          setDrivers(driverList);
          console.log('Drivers loaded successfully:', driverList.length);
        } else {
          if (res.status === 403 || res.status === 401) {
            console.error('Authentication error for drivers API');
            localStorage.removeItem('authToken');
            window.location.href = '/login';
          } else {
            const errorText = await res.text();
            console.error('Failed to fetch drivers:', res.status, errorText);
          }
        }

      } catch (err) {
        console.error("Error fetching drivers:", err);
      }
    };

    fetchDrivers();
  }, []);

  // Remove localStorage dependency for driver assignments
  // useEffect(() => {
  //   const assignments = JSON.parse(localStorage.getItem('driverAssignments') || '{}');
  //   if (Object.keys(assignments).length > 0) {
  //     setBuses(prev =>
  //       prev.map(bus => {
  //         const assignment = assignments[bus.id];
  //         return assignment ? { ...bus, driver: assignment.driverName } : bus;
  //       })
  //     );
  //   }
  // }, [buses.length]);


  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          setSchools([{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
          return;
        }
        
        const res = await fetch(`${API_BASE_URL}/schools`, {
          method: 'GET',
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log('Schools API response:', data);
          
          let schoolsData = [];
          if (data?.success && Array.isArray(data.data)) {
            schoolsData = data.data;
          } else if (Array.isArray(data)) {
            schoolsData = data;
          } else if (Array.isArray(data?.schools)) {
            schoolsData = data.schools;
          } else if (Array.isArray(data?.content)) {
            schoolsData = data.content;
          }
          
          const validSchools = schoolsData.filter(school => school?.id && school?.name);
          setSchools(validSchools.length > 0 ? validSchools : [{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
        } else {
          console.warn('Schools API failed:', res.status);
          setSchools([{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
        }
      } catch (err) {
        console.error("Failed to load schools:", err);
        setSchools([{ id: 1, name: "Main School" }, { id: 2, name: "Branch School" }]);
      }
    };
    
    fetchSchools();
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

  const newStatus = !selectedBus.active;

  try {
    const token = getAuthToken();
    if (!token) {
      alert("Authentication required. Please login again.");
      window.location.href = '/login';
      return;
    }

    const payload = { status: newStatus ? "ACTIVE" : "INACTIVE" };
    console.log('Updating bus status:', { busId: selectedBus.id, payload });

    const res = await fetch(`${API_BASE_URL}/admin/actions/buses/${selectedBus.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: JSON.stringify(payload)
    });

    console.log('Status update response:', res.status);

    if (res.ok) {
      const response = await res.json();
      console.log('Status update success:', response);
      
      // Update UI only if API succeeded
      setBuses((prev: Bus[]) =>
        prev.map((b: Bus) => b.id === selectedBus.id ? { ...b, active: newStatus } : b)
      );
      
      alert(`✅ Bus status updated to ${newStatus ? 'Active' : 'Inactive'}`);
      closeStatusModal();
    } else {
      const errorText = await res.text();
      console.error('Status update failed:', res.status, errorText);
      
      if (res.status === 403) {
        alert('❌ Permission denied. You may not have permission to change bus status.');
      } else if (res.status === 401) {
        localStorage.removeItem('authToken');
        alert('❌ Session expired. Please login again.');
        window.location.href = '/login';
      } else if (res.status === 404) {
        alert('❌ Bus not found. It may have been deleted.');
      } else {
        alert(`❌ Failed to update status: ${res.status} - ${errorText || 'Unknown error'}`);
      }
    }

  } catch (err) {
    console.error("Error updating bus status:", err);
    alert('❌ Network error. Please check your connection and try again.');
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

    if (!name || !route || capacity < 0 || maxCapacity <= 0) {
      alert('Please fill in all required fields with valid values.');
      return;
    }

    const timestamp = Date.now();
    const uniqueBusNumber = code || `SCH-${timestamp.toString().slice(-6)}-${Math.floor(Math.random() * 100)}`;
    
    const payload = {
      busName: name.trim(),
      busNumber: uniqueBusNumber.trim(),
      capacity: Number(maxCapacity),
      currentCapacity: Number(capacity),
      route: route.trim(),
      status: active ? "ACTIVE" : "INACTIVE"
    };

    console.log("Creating new bus with payload:", payload);

    try {
      const token = getAuthToken();
      if (!token) {
        alert("Authentication required. Please login again.");
        window.location.href = '/login';
        return;
      }
      
      const url = selectedSchool ? `${API_BASE_URL}/admin/actions/buses?schoolId=${selectedSchool}` : `${API_BASE_URL}/admin/actions/buses`;
      console.log("Request URL:", url);
      
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify(payload),
      });

      console.log("Add bus response status:", res.status);
      
      if (res.ok) {
        const apiResponse = await res.json();
        console.log("Add bus response:", apiResponse);
        
        // Extract the new bus data from response
        let newBusData = null;
        if (apiResponse?.success && apiResponse.data) {
          newBusData = apiResponse.data;
        } else if (apiResponse?.id) {
          newBusData = apiResponse;
        }
        
        if (newBusData) {
          const newBus: Bus = {
            id: newBusData.id,
            name: newBusData.busName || name,
            code: newBusData.busNumber || uniqueBusNumber,
            route: newBusData.route || route,
            driver: newBusData.assignedDriver?.full_name || "Not Assigned",
            capacity: Number(newBusData.currentCapacity || capacity),
            maxCapacity: Number(newBusData.capacity || maxCapacity),
            active: newBusData.status === "ACTIVE"
          };
          
          setBuses((prev: Bus[]) => [...prev, newBus]);
          alert('✅ Bus added successfully!');
        } else {
          console.warn('Unexpected response structure:', apiResponse);
          alert('Bus may have been created but response format was unexpected.');
        }
      } else {
        const errorText = await res.text();
        console.error('Add bus failed:', res.status, errorText);
        
        if (res.status === 403) {
          alert('❌ Permission denied. You may not have permission to add buses.');
        } else if (res.status === 401) {
          localStorage.removeItem('authToken');
          alert('❌ Session expired. Please login again.');
          window.location.href = '/login';
        } else if (res.status === 400) {
          try {
            const errorData = JSON.parse(errorText);
            if (errorData.message?.includes('duplicate') || errorData.message?.includes('exists')) {
              alert('❌ Bus number already exists. Please use a different bus number.');
            } else {
              alert(`❌ Invalid data: ${errorData.message || 'Please check your input'}`);
            }
          } catch {
            alert('❌ Invalid data provided. Please check your input.');
          }
        } else if (res.status === 500) {
          alert('❌ Server error. Please try again later.');
        } else {
          alert(`❌ Failed to add bus: ${res.status} - ${errorText || 'Unknown error'}`);
        }
        return;
      }
    } catch (err) {
      console.error("Error adding bus:", err);
      alert('❌ Network error. Please check your connection and try again.');
      return;
    }

    // Reset form and close modal
    setShowAddForm(false);
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
    const token = await getValidToken();
    if (!token) {
      alert("Authentication required. Please login again.");
      window.location.href = '/login';
      return;
    }

    const busId = Number(selectedBusForDriver);
    const driverId = Number(selectedDriverForBus);

    console.log('=== DRIVER ASSIGNMENT DEBUG ===');
    console.log('Bus ID:', busId);
    console.log('Driver ID:', driverId);
    console.log('Token exists:', !!token);

    const res = await fetch(`${API_BASE_URL}/admin/assign-bus-to-driver`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: JSON.stringify({ driverId: driverId, busId: busId }),
    });

    console.log('Driver assignment response status:', res.status);
    
    if (res.ok) {
      const data = await res.json();
      console.log('Assignment successful:', data);
      
      const assignedDriver = drivers.find(d => d.id === driverId);
      setBuses(prev =>
        prev.map(bus =>
          bus.id === busId ? { ...bus, driver: assignedDriver?.fullName || "Assigned" } : bus
        )
      );
      
      alert(`✅ Driver ${assignedDriver?.fullName || 'Unknown'} assigned successfully!`);
      closeAssignDriverModal();
    } else {
      const errorText = await res.text();
      console.error('Assignment failed:', res.status, errorText);
      
      if (res.status === 403) {
        alert('❌ Permission Denied: You do not have permission to assign drivers. Contact your system administrator.');
      } else if (res.status === 401) {
        localStorage.removeItem('authToken');
        alert('❌ Session expired. Please login again.');
        window.location.href = '/login';
      } else {
        alert(`❌ Assignment Failed: ${res.status} - ${errorText || 'Unknown error'}`);
      }
    }

  } catch (err) {
    console.error('Error assigning driver:', err);
    alert('❌ Network Error: Unable to connect to server. Please check your connection and try again.');
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
          {canAssignDrivers && (
            <button 
              onClick={openAssignDriverModal}
              className="flex items-center gap-2 px-4 py-2 justify-center mb-2 bg-purple-500 transition-transform duration-300 hover:scale-105 text-white rounded-lg whitespace-nowrap"
            >
              <UserPlus size={16} />
              Assign driver
            </button>
          )}

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
                  <input type="text" placeholder="Bus 06" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-300" required />
                </div>
                <div>
                  <label className="block text-xs text-black mb-1">Bus Number</label>
                  <input type="text" placeholder="SCH-106" value={code} onChange={e => setCode(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-300" required />
                </div>

                <div>
                  <label className="block text-xs text-black mb-2">School</label>
                 <select
                 value={selectedSchool}
                 onChange={(e) => setSelectedSchool(e.target.value ? Number(e.target.value) : "")}
                 className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-300 mb-4 text-gray-700 [&>option:hover]:bg-blue-400"
                 required
                 >
                <option value="" disabled hidden>Choose a school</option>
                {Array.isArray(schools) ? schools.map(s => (
                <option key={s.id} value={s.id} className="hover:bg-blue-400">{s.name}</option>
                )) : null}
               </select>
                </div>

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
                  }} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-300" required />
                </div>

                <div>
                  <label className="block text-xs text-black mb-1">Route</label>
                  <input type="text" placeholder="Route E - Central District" value={route} onChange={e => setRoute(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-300 focus:border-blue-300" required />
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

            <div className="space-y-4">
              {/* Select Driver */}
              <div>
                <label className="block text-xs mt-2 mb-2  text-black">Select Driver</label>
                <select
                  value={selectedDriverForBus}
                  onChange={(e) => setSelectedDriverForBus(Number(e.target.value))}
                  className="w-full border text-sm border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 [&>option:hover]:bg-blue-400"
                >
                  <option value="">Choose a driver</option>
                {drivers
                .filter(driver => 
                !buses.some(bus => 
                bus.driver && bus.driver !== "Not Assigned" && bus.driver.trim() === driver.fullName.trim()
                )
                )
                .map(driver => (
                <option key={driver.id} value={driver.id} className="hover:bg-blue-400">{driver.fullName}</option>
                ))}


                </select>
              </div>
              <p className="text-xs mb-4 mt-2  text-gray-700">Only showing unassigned drivers</p>

              {/* Assign to Bus */}
              <div>
                <label className="block text-xs text-black  mb-1">Assign to Bus</label>
                <select
                  value={selectedBusForDriver}
                  onChange={(e) => setSelectedBusForDriver(Number(e.target.value))}
                  className="w-full mt-2 mb-2 text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 [&>option:hover]:bg-blue-400"
                >
                  <option value="">Select a bus</option>
                  {buses.map(bus => (
                    <option key={bus.id} value={bus.id} className="hover:bg-blue-400">{bus.name}</option>
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
                  className="w-full mt-2 mb-2  text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
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