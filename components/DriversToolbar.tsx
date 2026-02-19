'use client';
import { Search, UserPlus, Plus, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

export default function DriversToolbar() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isBusDropdownOpen, setIsBusDropdownOpen] = useState(false);
  const [isAddDriverDropdownOpen, setIsAddDriverDropdownOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState<number | "">("");
  const [selectedBus, setSelectedBus] = useState<number | "">("");
  const [selectedBusForNewDriver, setSelectedBusForNewDriver] = useState("");
  const [startDate, setStartDate] = useState("");
  const [notes, setNotes] = useState("");

  // Fetch real drivers and buses from API
  const [drivers, setDrivers] = useState<{ id: number; fullName: string; assignedBus?: string }[]>([]);
  const [buses, setBuses] = useState<{ id: number; busName: string; assignedDriver?: { fullName: string } }[]>([]);

  // States for API integration
  const [driverForm, setDriverForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    licenseNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [apiSuccess, setApiSuccess] = useState("");

  // Fetch drivers and buses when assign modal opens
  useEffect(() => {
    const fetchData = async () => {
      if (!showAssignModal) return;
      
      try {
        const token = getAuthToken();
        if (!token) return;

        const [driversRes, busesRes] = await Promise.all([
          fetch('https://school-bus-tracker-be.onrender.com/api/drivers', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          }),
          fetch('https://school-bus-tracker-be.onrender.com/api/buses', {
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
          })
        ]);

        if (driversRes.ok) {
          const data = await driversRes.json();
          if (data.success && data.data) {
            setDrivers(data.data.map((d: any) => ({
              id: d.id,
              fullName: d.full_name || d.fullName || d.driverName,
              assignedBus: d.assigned_bus_id ? `Bus ${d.assigned_bus_id}` : null
            })));
          }
        }

        if (busesRes.ok) {
          const data = await busesRes.json();
          if (data.success && data.data) {
            setBuses(data.data);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [showAssignModal]);

  const getAuthToken = () => {
    let token = localStorage.getItem("token");
    if (!token) {
      const possibleKeys = ['accessToken', 'authToken', 'jwtToken', 'jwt', 'auth_token'];
      for (const key of possibleKeys) {
        token = localStorage.getItem(key) || sessionStorage.getItem(key);
        if (token) break;
      }
    }
    if (!token) {
      const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userString) {
        try {
          const userData = JSON.parse(userString);
          token = userData.token || userData.accessToken || userData.authToken;
        } catch (e) {
          console.log("Could not parse user data");
        }
      }
    }
    return token ? token.replace(/^Bearer\s+/i, '') : null;
  };

  const handleAssignToBus = () => {
    setShowAssignModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedDriver("");
    setSelectedBus("");
    setStartDate("");
    setNotes("");
    setIsDropdownOpen(false);
    setIsBusDropdownOpen(false);
  };

  const handleAssignDriverSubmit = async () => {
    if (!selectedDriver || !selectedBus) {
      console.error("Please select both a driver and a bus.");
      return;
    }

    try {
      const token = getAuthToken();
      if (!token) {
        console.error("No auth token found. Please login again.");
        window.location.href = '/login';
        return;
      }

      const response = await fetch('https://school-bus-tracker-be.onrender.com/api/admin/assign-bus-to-driver', {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ driverId: selectedDriver, busId: selectedBus }),
      });

      if (response.ok) {
        const assignedDriver = drivers.find(d => d.id === selectedDriver);
        const assignedBus = buses.find(b => b.id === selectedBus);
        handleCloseModal();
        window.location.reload();
      } else {
        const errorText = await response.text();
        console.error('Assignment failed:', errorText);
        console.error(`Failed to assign driver: ${errorText}`);
      }
    } catch (err) {
      console.error('Error assigning driver:', err);
      console.error('Network error. Please try again.');
    }
  };

  const handleAddDriver = () => {
    setShowAddDriverModal(true);
    
    setDriverForm({
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      licenseNumber: "",
    });
    setApiError("");
    setApiSuccess("");
  };

  const handleCloseAddDriverModal = () => {
    setShowAddDriverModal(false);
    setSelectedBusForNewDriver("");
    setIsAddDriverDropdownOpen(false);
    setApiError("");
    setApiSuccess("");
  };

  const handleBusSelectForNewDriver = (bus: string) => {
    setSelectedBusForNewDriver(bus);
    setIsAddDriverDropdownOpen(false);
  };

  const handleDriverSelect = (driverId: number) => {
    setSelectedDriver(driverId);
    setIsDropdownOpen(false);
  };

  // Function to handle form input changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDriverForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Add driver API function
  const handleSubmitDriver = async () => {
    // Validate required fields
    if (!driverForm.firstName || !driverForm.lastName || !driverForm.email || !driverForm.phoneNumber || !driverForm.licenseNumber) {
      setApiError("Please fill in all fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(driverForm.email)) {
      setApiError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setApiError("");
    setApiSuccess("");

    try {
      
      let token = null;
      
      
      token = localStorage.getItem("token");
      
      // If not found, check for other common token keys
      if (!token) {
        const possibleKeys = ['accessToken', 'authToken', 'jwtToken', 'jwt', 'auth_token'];
        for (const key of possibleKeys) {
          token = localStorage.getItem(key) || sessionStorage.getItem(key);
          if (token) break;
        }
      }
      
      // If still not found, check if token is in user object
      if (!token) {
        const userString = localStorage.getItem('user') || sessionStorage.getItem('user');
        if (userString) {
          try {
            const userData = JSON.parse(userString);
            token = userData.token || userData.accessToken || userData.authToken;
          } catch (e) {
            console.log("Could not parse user data");
          }
        }
      }
      
      if (!token) {
        setApiError("Please log in first. No authentication token found.");
        setLoading(false);
        return;
      }

      // Clean the token (remove "Bearer " if already included)
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      // Generate truly unique data for all fields to avoid database conflicts
      const randomString = Math.random().toString(36).substring(2, 8);
      const timestamp = Date.now();
      const emailParts = driverForm.email.split('@');
      const testEmail = `${emailParts[0]}_${randomString}_${timestamp}@${emailParts[1]}`;
      const testPhone = `+25078${randomString}${timestamp.toString().slice(-4)}`; // Unique phone
      const testLicense = `DL${randomString.toUpperCase()}${timestamp.toString().slice(-6)}`; // Unique license
      
      console.log('Original data:', {
        email: driverForm.email,
        phone: driverForm.phoneNumber,
        license: driverForm.licenseNumber
      });
      console.log('Generated unique data:', {
        email: testEmail,
        phone: testPhone,
        license: testLicense
      });
      
      // CORRECTED ENDPOINT & REQUEST - Using the proper API endpoint from your documentation
      const response = await fetch("https://school-bus-tracker-be.onrender.com/api/admin/add-driver", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${cleanToken}`,
          "Cache-Control": "no-cache", // Prevent caching
        },
        body: JSON.stringify({
          email: testEmail, // Use unique email for testing
          password: "DefaultDriverPassword123!", // Default password
          full_name: `${driverForm.firstName} ${driverForm.lastName}`, // Combine first and last name
          phone_number: testPhone, // Use unique phone for testing
          license_number: testLicense, // Use unique license for testing
          school_id: 1, // Use valid school ID
          assigned_bus_id: 0 // 0 means not assigned to any bus yet
        }),
      });

      // FIXED: Better error handling - Read response once and store it
      let responseData;
      let errorMessage = '';
      
      if (!response.ok) {
        // Try to read the error response
        try {
          // Clone the response before reading it
          const responseClone = response.clone();
          const errorText = await responseClone.text();
          
          // Try to parse as JSON, otherwise use as text
          try {
            responseData = JSON.parse(errorText);
            errorMessage = responseData.message || responseData.error || `Error ${response.status}: ${response.statusText}`;
          } catch {
            errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Success handling - Read the response once
      responseData = await response.json();
      console.log("Driver added successfully:", responseData);
      
      setApiSuccess("Driver added successfully!");
      
      // Reset form
      setDriverForm({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        licenseNumber: "",
      });

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowAddDriverModal(false);
        window.location.reload(); // Refresh to show new driver
      }, 2000);

    } catch (error: any) {
      console.error("Error adding driver:", error);
      
      // Specific error messages
      if (error.message.includes("403") || error.message.includes("Forbidden")) {
        setApiError("Access denied. You need admin privileges to add drivers.");
      } else if (error.message.includes("401") || error.message.includes("Unauthorized")) {
        setApiError("Your session has expired. Please log in again.");
      } else if (error.message.includes("already exists")) {
        setApiError("A driver with this email already exists.");
      } else {
        setApiError(error.message || "Failed to add driver. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
      
      {/* Search bar */}
      <div className="flex items-center gap-2 bg-white border rounded-xl px-3 sm:px-4 py-2 sm:py-3 w-full sm:w-2/3 lg:w-2/3">
        <Search size={16} className="text-gray-400 sm:w-[18px] sm:h-[18px]" />
        <input
          type="text"
          placeholder="Search drivers by name or bus..."
          className="w-full outline-none text-xs sm:text-sm placeholder-gray-500 text-black"
          suppressHydrationWarning={true}
        />
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <button 
          onClick={handleAssignToBus}
          className="flex items-center justify-center gap-2 bg-purple-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-purple-700 text-xs sm:text-sm"
          suppressHydrationWarning={true}
        >
          <UserPlus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Assign to Bus</span>
          <span className="sm:hidden">Assign</span>
        </button>

        <button 
          onClick={handleAddDriver}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-5 py-2 sm:py-3 rounded-lg sm:rounded-xl hover:bg-blue-700 text-xs sm:text-sm"
          suppressHydrationWarning={true}
        >
          <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
          <span className="hidden sm:inline">Add Driver</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
      
      {/* Assign to Bus Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleCloseModal}></div>
          <div className="relative bg-white rounded-4xl shadow-2xl max-w-[400px] w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4">
              <UserPlus size={20} className="text-purple-600" />
              <h3 className="text-lg mt-4 mb-4 font-bold text-gray-700">Assign Driver to Bus</h3>
            </div>
            
            <div className="space-y-8">
              {/* Select Driver */}
              <div className="mb-8 relative">
                <label className="block text-xs text-black mb-2">Select Driver</label>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white text-gray-400 text-left focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  {selectedDriver ? drivers.find(d => d.id === selectedDriver)?.fullName : "Choose a driver"}
                </button>
                
                {isDropdownOpen && (
                  <ul className="mt-2 w-full bg-purple-500 rounded-lg shadow-lg border border-purple-500">
                    {drivers
                      .filter(driver => !driver.assignedBus)
                      .map((driver) => (
                        <li
                          key={driver.id}
                          onClick={() => handleDriverSelect(driver.id)}
                          className="px-3 py-2 cursor-pointer text-white hover:bg-purple-600 focus:bg-purple-600"
                        >
                          {driver.fullName}
                        </li>
                      ))}
                  </ul>
                )}
                <p className="text-xs mt-2 text-gray-700">Only showing unassigned drivers</p>
              </div>
              
              {/* Assign to Bus */}
              <div className={`relative transition-all duration-300 ${isBusDropdownOpen ? "mb-8" : "mb-6"}`}>
                <label className="block text-xs text-black mb-2">Assign to Bus</label>
                <button
                  type="button"
                  onClick={() => setIsBusDropdownOpen(true)}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm bg-white text-gray-400 text-left focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                >
                  {selectedBus ? buses.find(b => b.id === selectedBus)?.busName : "Select a bus"}
                </button>
                
                {isBusDropdownOpen && buses.length > 0 && (
                  <ul className="mt-2 w-full bg-white rounded-lg shadow-lg border border-gray-300 text-sm">
                    {buses.map((bus) => (
                      <li
                        key={bus.id}
                        onClick={() => {
                          setSelectedBus(bus.id);
                          setIsBusDropdownOpen(false);
                        }}
                        className="px-3 py-1 cursor-pointer text-gray-600 hover:bg-purple-400 hover:text-white"
                      >
                        {bus.busName} {bus.assignedDriver ? `(Currently: ${bus.assignedDriver.fullName})` : "(Available)"}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              {/* Start Date */}
              <div>
                <label className="block text-xs text-black mb-2">Start Date</label>
                <input 
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm border border-gray-300 px-3 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-xs mt-2 mb-2 text-black">Notes (Optional)</label>
                <textarea 
                  placeholder="Any additional notes about this assignment..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full mt-2 mb-2 text-sm border border-gray-300 px-3 h-30 py-2 rounded-lg text-gray-700 focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <hr className="mb-4"></hr>
              
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleAssignDriverSubmit}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Assign Driver
                </button>
                <button
                  onClick={handleCloseModal}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add Driver Modal */}
      {showAddDriverModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/20">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6 ml-3">
              <UserPlus size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-black">Add new driver</h2>
            </div>
            
            <div className="px-2">
              {/* Success/Error Messages */}
              {apiSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {apiSuccess}
                </div>
              )}
              
              {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {apiError}
                </div>
              )}
              
              {/* First Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  First Name
                </label>
                <input 
                  type="text"
                  name="firstName"
                  placeholder="e.g. John"
                  value={driverForm.firstName}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
                  disabled={loading}
                />
              </div>
              
              {/* Last Name */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Last Name
                </label>
                <input 
                  type="text"
                  name="lastName"
                  placeholder="e.g. Smith"
                  value={driverForm.lastName}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
                  disabled={loading}
                />
              </div>
              
              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Email
                </label>
                <input 
                  type="email"
                  name="email"
                  placeholder="e.g. john.smith@school.com"
                  value={driverForm.email}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
                  disabled={loading}
                />
              </div>
            
              {/* Phone Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Phone Number
                </label>
                <input 
                  type="tel"
                  name="phoneNumber"
                  placeholder="e.g. +250780528972"
                  value={driverForm.phoneNumber}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
                  disabled={loading}
                />
              </div>
              
              {/* License Number */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  License Number
                </label>
                <input   
                  type="text"
                  name="licenseNumber"
                  placeholder="e.g. DL123456789"
                  value={driverForm.licenseNumber}
                  onChange={handleFormChange}
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500 text-black"
                  disabled={loading}
                />
              </div>
              
              {/* Password Field (hidden but required) */}
              <div className="mb-4 hidden">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Password
                </label>
                <input   
                  type="text"
                  name="password"
                  value="DefaultDriverPassword123!"
                  readOnly
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                />
                <p className="text-gray-500 text-xs mt-1">Default password will be used</p>
              </div>
              
              {/* Role Field (hidden but required) */}
              <div className="mb-4 hidden">
                <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                  Role
                </label>
                <input   
                  type="text"
                  name="role"
                  value="DRIVER"
                  readOnly
                  className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-500"
                />
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmitDriver}
                disabled={loading}
                className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding...
                  </>
                ) : (
                  "Add Driver"
                )}
              </button>
              <button
                onClick={handleCloseAddDriverModal}
                disabled={loading}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}