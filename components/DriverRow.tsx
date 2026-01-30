'use client';
import {
  SquarePen,
  Trash2,
  Phone,
  Bus,
  AlertTriangle,
  ChevronDown,
  Mail
} from "lucide-react";
import { useState } from "react";
import { createPortal } from "react-dom";

// Driver type
type Driver = {
  id: number;
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
  license_number?: string;
};

type DriverRowProps = {
  driver: Driver;
  onUpdate?: () => void;
  onDelete?: () => void;
};

export default function DriverRow({ driver, onUpdate, onDelete }: DriverRowProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [selectedBus, setSelectedBus] = useState(driver.bus ?? "");
  const [formData, setFormData] = useState({
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    license: driver.license_number || "DL123456789"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Get authentication token
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

  const handleSaveChanges = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Please log in first");
        return;
      }

      console.log('Attempting to update driver with ID:', driver.id);
      
      // Try multiple possible update endpoints
      const possibleEndpoints = [
        `https://school-bus-tracker-be.onrender.com/api/admin/update-driver/${driver.id}`,
        `https://school-bus-tracker-be.onrender.com/api/admin/drivers/${driver.id}`,
        `https://school-bus-tracker-be.onrender.com/api/drivers/${driver.id}`
      ];
      
      // Try different data formats that the backend might expect
      const possibleDataFormats = [
        {
          email: formData.email,
          name: formData.name,
          phone_number: formData.phone,
          license_number: formData.license,
        },
        {
          email: formData.email,
          fullName: formData.name,
          phoneNumber: formData.phone,
          licenseNumber: formData.license,
        },
        {
          email: formData.email,
          full_name: formData.name,
          phone: formData.phone,
          license: formData.license,
        }
      ];
      
      let response;
      let lastError;
      
      for (let i = 0; i < possibleEndpoints.length; i++) {
        const endpoint = possibleEndpoints[i];
        
        for (let j = 0; j < possibleDataFormats.length; j++) {
          const updateData = possibleDataFormats[j];
          
          try {
            console.log(`Trying update endpoint: ${endpoint} with data format ${j + 1}:`, updateData);
            response = await fetch(endpoint, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
                "Cache-Control": "no-cache",
              },
              body: JSON.stringify(updateData),
            });
            
            console.log(`${endpoint} (format ${j + 1}) - Response status:`, response.status);
            
            if (response.ok) {
              console.log('Success with endpoint:', endpoint, 'and data format:', j + 1);
              break; // Success, exit inner loop
            } else {
              const errorText = await response.text();
              console.log(`${endpoint} (format ${j + 1}) - Error response:`, errorText);
              lastError = `Error ${response.status}: ${errorText || 'Failed to update driver'}`;
            }
          } catch (err) {
            console.log(`${endpoint} (format ${j + 1}) - Network error:`, err);
            lastError = `Network error: ${err}`;
          }
        }
        
        if (response && response.ok) {
          break; // Success, exit outer loop
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(lastError || 'All update endpoints failed');
      }

      console.log("Driver updated successfully");
      setShowEditModal(false);
      onUpdate?.(); // Refresh the drivers list
    } catch (error: any) {
      console.error("Error updating driver:", error);
      setError(error.message || "Failed to update driver");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDriver = async () => {
    setLoading(true);
    setError("");
    
    try {
      const token = getAuthToken();
      if (!token) {
        setError("Please log in first");
        return;
      }

      console.log('Attempting to delete driver with ID:', driver.id);
      
      // Try multiple possible delete endpoints
      const possibleEndpoints = [
        `https://school-bus-tracker-be.onrender.com/api/admin/delete-driver/${driver.id}`,
        `https://school-bus-tracker-be.onrender.com/api/admin/drivers/${driver.id}`,
        `https://school-bus-tracker-be.onrender.com/api/drivers/${driver.id}`
      ];
      
      let response;
      let lastError;
      
      for (const endpoint of possibleEndpoints) {
        try {
          console.log('Trying delete endpoint:', endpoint);
          response = await fetch(endpoint, {
            method: "DELETE",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Cache-Control": "no-cache",
            },
          });
          
          console.log(`${endpoint} - Response status:`, response.status);
          
          if (response.ok) {
            break; // Success, exit loop
          } else {
            const errorText = await response.text();
            console.log(`${endpoint} - Error response:`, errorText);
            lastError = `Error ${response.status}: ${errorText || 'Failed to delete driver'}`;
          }
        } catch (err) {
          console.log(`${endpoint} - Network error:`, err);
          lastError = `Network error: ${err}`;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(lastError || 'All delete endpoints failed');
      }

      console.log("Driver deleted successfully");
      setShowDeleteModal(false);
      onDelete?.(); // Refresh the drivers list
    } catch (error: any) {
      console.error("Error deleting driver:", error);
      setError(error.message || "Failed to delete driver");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* TABLE ROW */}
      <tr className="border-b last:border-none">
        {/* ✅ ONLY CHANGE IS HERE: items-center added */}
        <td className="p-4 flex items-center gap-3">
          <span className="text-2xl">🧑‍✈️</span>
          <p className="text-black">{driver.name}</p>
        </td>

        <td className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            <span className="text-gray-500 text-sm">{driver.phone}</span>
          </div>

          <div className="flex items-center gap-2">
            <Mail size={14} className="text-blue-500" />
            <span className="text-gray-500 text-sm">{driver.email}</span>
          </div>
        </td>

        <td className="p-4 flex items-center gap-2">
          <Bus size={14} className="text-blue-500" />
          <span className="text-gray-500">{driver.bus ?? "Not assigned"}</span>
        </td>

        <td className="p-4">
          <span
            className={`px-3 py-1 rounded-full text-xs ${
              driver.status === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-600"
            }`}
          >
            {driver.status}
          </span>
        </td>

        <td className="p-8 flex gap-6">
          <SquarePen
            size={18}
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            onClick={() => setShowEditModal(true)}
          />
          <Trash2
            size={18}
            className="text-red-500 cursor-pointer hover:text-red-700"
            onClick={() => setShowDeleteModal(true)}
          />
        </td>
      </tr>

      {/* ================= EDIT MODAL ================= */}
      {showEditModal &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-2xl">
              <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                <SquarePen className="text-blue-600" />
                Edit Driver
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <input
                  value={formData.name}
                  onChange={e => handleInputChange("name", e.target.value)}
                  className="w-full border rounded-2xl border-gray-300 px-4 py-3 text-black"
                  placeholder="Full Name"
                />

                <input
                  value={formData.email}
                  onChange={e => handleInputChange("email", e.target.value)}
                  className="w-full border rounded-2xl border-gray-300 px-4 py-3 text-black"
                  placeholder="Email"
                />

                <input
                  value={formData.phone}
                  onChange={e => handleInputChange("phone", e.target.value)}
                  className="w-full border rounded-2xl border-gray-300 px-4 py-3 text-black"
                  placeholder="Phone"
                />

                <input
                  value={formData.license}
                  onChange={e => handleInputChange("license", e.target.value)}
                  className="w-full border rounded-2xl border-gray-300 px-4 py-3 text-black"
                  placeholder="License"
                />

                <div className="relative text-black">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full flex justify-between border rounded-2xl border-gray-300 px-4 py-3"
                  >
                    {selectedBus || "No assignment"}
                    <ChevronDown size={18} />
                  </button>

                  {isDropdownOpen && (
                    <div className="absolute w-full bg-white border rounded-2xl mt-1 shadow-lg">
                      {["", "Bus 01", "Bus 02", "Bus 03"].map(bus => (
                        <button
                          key={bus}
                          onClick={() => {
                            setSelectedBus(bus);
                            setIsDropdownOpen(false);
                          }}
                          className="block w-full px-4 py-3 hover:bg-gray-100 text-left"
                        >
                          {bus || "No assignment"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={handleSaveChanges}
                  disabled={loading}
                  className={`flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 py-3 rounded-xl text-black hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}

      {/* ================= DELETE MODAL ================= */}
      {showDeleteModal &&
        typeof window !== "undefined" &&
        createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="text-red-600" />
                <h2 className="text-xl font-bold text-black">Delete Driver</h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <p className="text-sm text-gray-700 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-black">{driver.name}</span>?
                <br />
                <span className="text-red-600 font-medium">This action cannot be undone.</span>
              </p>

              <div className="flex gap-3">
                <button 
                  onClick={handleDeleteDriver}
                  disabled={loading}
                  className={`flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={loading}
                  className="flex-1 bg-gray-200 py-3 rounded-lg text-black hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
