'use client';
import DriverRow from "./DriverRow";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useState, useEffect } from "react";

type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
  license_number?: string;
};

export default function DriversTable() {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 3;
  
  // Fetch drivers from API
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      
      // Get authentication token
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
      
      if (!token) {
        setError("Please log in to view drivers");
        setLoading(false);
        return;
      }

      const cleanToken = token.replace(/^Bearer\s+/i, '');
      
      console.log('Attempting to fetch drivers with token:', cleanToken.substring(0, 20) + '...');
      
      // Try multiple possible endpoints
      const possibleEndpoints = [
        "https://school-bus-tracker-be.onrender.com/api/admin/drivers",
        "https://school-bus-tracker-be.onrender.com/api/drivers",
        "https://school-bus-tracker-be.onrender.com/api/admin/get-drivers"
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of possibleEndpoints) {
        try {
          console.log('Trying endpoint:', endpoint);
          response = await fetch(endpoint, {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${cleanToken}`,
              "Cache-Control": "no-cache",
            },
          });
          
          console.log(`${endpoint} - Response status:`, response.status);
          
          if (response.ok) {
            break; 
          } else {
            const errorText = await response.text();
            console.log(`${endpoint} - Error response:`, errorText);
            lastError = `Error ${response.status}: ${errorText || 'Failed to fetch drivers'}`;
          }
        } catch (err) {
          console.log(`${endpoint} - Network error:`, err);
          lastError = `Network error: ${err}`;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(lastError || 'All endpoints failed');
      }

      const data = await response.json();
      console.log("Fetched drivers:", data);
      
      
      let driversArray;
      if (Array.isArray(data)) {
        driversArray = data;
      } else if (data.data && Array.isArray(data.data)) {
        driversArray = data.data;
      } else if (data.drivers && Array.isArray(data.drivers)) {
        driversArray = data.drivers;
      } else {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid response format from server');
      }
      
      console.log('Drivers array:', driversArray);
      
      // Transform API data to match our Driver type
      const transformedDrivers = driversArray.map((driver: any) => ({
        id: driver.id,
        name: driver.driverName || driver.full_name || driver.name || 'Unknown Driver',
        email: driver.email,
        phone: driver.phoneNumber || driver.phone_number || driver.phone,
        bus: driver.assignedBus?.busName || driver.assigned_bus_id ? `Bus ${driver.assigned_bus_id}` : null,
        status: driver.status || "Active" as "Active" | "Inactive",
        license_number: driver.licenseNumber || driver.license_number
      }));
      
      setDrivers(transformedDrivers);
      setError("");
    } catch (error: any) {
      console.error("Error fetching drivers:", error);
      setError(error.message || "Failed to fetch drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);
  
  const totalPages = Math.ceil(drivers.length / driversPerPage);
  const startIndex = (currentPage - 1) * driversPerPage;
  const endIndex = startIndex + driversPerPage;
  const currentDrivers = drivers.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading drivers...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <div className="text-red-600 mb-4">⚠️ Error loading drivers</div>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={fetchDrivers}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px] ">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Driver</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Contact</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Assigned Bus</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Status</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentDrivers.length > 0 ? (
              currentDrivers.map((driver) => (
                <DriverRow 
                  key={driver.id} 
                  driver={driver} 
                  onUpdate={fetchDrivers} 
                  onDelete={fetchDrivers}
                />
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  No drivers found. Add some drivers to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {drivers.length > 0 && (
        <div className="flex flex-row flex-wrap items-center justify-between px-4 py-3 border-t border-gray-200 gap-2">
          <div className="text-sm text-gray-700 flex-shrink-0">
            Showing {startIndex + 1} to {Math.min(endIndex, drivers.length)} of {drivers.length} drivers
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* First Page / Previous Button */}
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleLeft className="text-gray-600" />
            </button>

            {/* Page Number Cards */}
            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`w-10 h-10 flex items-center justify-center text-sm font-medium rounded-lg border transition-colors ${
                    currentPage === pageNumber
                      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            {/* Next Page Button */}
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <FaAngleRight className="text-gray-600" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
