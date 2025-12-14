'use client';
import { Search, UserPlus, Plus, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function DriversToolbar() {
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");

  const drivers = [
    "Michael Johnson",
    "Sarah Williams", 
    "David Brown",
    "Emily Davis",
    "James Wilson"
  ];

  const handleAssignToBus = () => {
    setShowAssignModal(true);
  };

  const handleCloseModal = () => {
    setShowAssignModal(false);
    setSelectedDriver("");
    setIsDropdownOpen(false);
  };

  const handleDriverSelect = (driver: string) => {
    setSelectedDriver(driver);
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4">
      
      <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 w-full lg:w-2/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search drivers by name or bus..."
          className="w-full outline-none text-sm placeholder-gray-500"
        />
      </div>

      <div className="flex gap-3">
        <button 
          onClick={handleAssignToBus}
          className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl hover:bg-purple-700"
        >
          <UserPlus size={18} />
          Assign to Bus
        </button>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl">
          <Plus size={18} />
          Add Driver
        </button>
      </div>
      
      {/* Assign to Bus Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
            {/* Header */}
            <h2 className="text-xl font-bold text-black mb-6">Assign driver to bus</h2>
            
            {/* Select Driver */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Driver
              </label>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3 text-left focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <span className={selectedDriver ? "text-black" : "text-gray-500"}>
                    {selectedDriver || "Choose a driver"}
                  </span>
                  <ChevronDown size={18} className="text-gray-400" />
                </button>
                
                {/* Dropdown List */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {drivers.map((driver) => (
                      <button
                        key={driver}
                        onClick={() => handleDriverSelect(driver)}
                        className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black border-b border-gray-100 last:border-none"
                      >
                        {driver}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-sm mt-2">Only showing unassigned drivers</p>
            </div>
            
            {/* Assign to Bus */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign to Bus
              </label>
              <select className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-500">
                <option value="" className="text-gray-500">Select a bus</option>
                <option value="bus01">Bus 01</option>
                <option value="bus02">Bus 02</option>
                <option value="bus03">Bus 03</option>
                <option value="bus04">Bus 04</option>
              </select>
            </div>
            
            {/* Start Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input 
                type="date" 
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-500"
              />
            </div>
            
            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea 
                placeholder="Any additional notes about this assignment"
                rows={3}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none placeholder-gray-500"
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleCloseModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Assign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
