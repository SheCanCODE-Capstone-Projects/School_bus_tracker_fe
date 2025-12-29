'use client';
import { SquarePen, ChevronDown, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function EditDriverPage() {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedBus, setSelectedBus] = useState("Bus 01"); // Default from existing data
  const [formData, setFormData] = useState({
    name: "Michael Johnson", // Pre-filled with existing data
    email: "michael.johnson@school.com",
    phone: "+1 (555) 123-4567",
    license: "DL123456789"
  });

  const handleBusSelect = (bus: string) => {
    setSelectedBus(bus);
    setIsDropdownOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // Save logic would go here
    router.push('/admin/dashboard/drivers');
  };

  const handleCancel = () => {
    router.push('/admin/dashboard/drivers');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={handleCancel}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-gray-600" />
          </button>
          <div className="flex items-center gap-3">
            <SquarePen size={28} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-black">Edit Driver</h1>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <div className="px-2">
            {/* Full Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Full Name
              </label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            
            {/* Email */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Email
              </label>
              <input 
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            
            {/* Phone Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Phone Number
              </label>
              <input 
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            
            {/* License Number */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                License Number
              </label>
              <input 
                type="text"
                value={formData.license}
                onChange={(e) => handleInputChange('license', e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
            
            {/* Assign to Bus */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-2 ml-1">
                Assign to Bus
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-2xl px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className={selectedBus ? "text-black" : "text-gray-500"}>
                    {selectedBus || "No assignment"}
                  </span>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>
                
                {/* Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-2xl shadow-lg z-10 max-h-48 overflow-y-auto">
                    <button
                      onClick={() => handleBusSelect("")}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-gray-500 border-b border-gray-100"
                    >
                      No assignment
                    </button>
                    <button
                      onClick={() => handleBusSelect("Bus 01")}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black border-b border-gray-100"
                    >
                      Bus 01
                    </button>
                    <button
                      onClick={() => handleBusSelect("Bus 02")}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black border-b border-gray-100"
                    >
                      Bus 02
                    </button>
                    <button
                      onClick={() => handleBusSelect("Bus 03")}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black border-b border-gray-100"
                    >
                      Bus 03
                    </button>
                    <button
                      onClick={() => handleBusSelect("Bus 04")}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black last:border-none"
                    >
                      Bus 04
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={handleSaveChanges}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Save Changes
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-xl transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}