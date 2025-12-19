'use client';
import {
  SquarePen,
  Trash2,
  Phone,
  Bus,
  AlertTriangle,
  ChevronDown
} from "lucide-react";
import { useState } from "react";

// Driver type
type Driver = {
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
};

export default function DriverRow({ driver }: { driver: Driver }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedBus, setSelectedBus] = useState(driver.bus ?? "");
  const [formData, setFormData] = useState({
    name: driver.name,
    email: driver.email,
    phone: driver.phone,
    license: "DL123456789"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    // save logic here
    setShowEditModal(false);
  };

  return (
    <>
      {/* TABLE ROW */}
      <tr className="border-b last:border-none">
        <td className="p-4 flex gap-3">
          <span className="text-2xl">🧑‍✈️</span>
          <p className="text-black">{driver.name}</p>
        </td>

        <td className="p-4 space-y-1">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            <span className="text-black text-xs">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-black text-xs">{driver.email}</span>
          </div>
        </td>

        <td className="p-4 flex items-center gap-2">
          <Bus size={14} className="text-blue-500" />
          <span className="text-black">{driver.bus ?? "Not assigned"}</span>
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

        <td className="p-4 flex gap-3">
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
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-8 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
              <SquarePen className="text-blue-600" />
              Edit Driver
            </h2>

            {/* FORM */}
            <div className="space-y-5">
              <input
                value={formData.name}
                onChange={e => handleInputChange("name", e.target.value)}
                className="w-full border rounded-2xl px-4 py-3 text-black"
                placeholder="Full Name"
              />

              <input
                value={formData.email}
                onChange={e => handleInputChange("email", e.target.value)}
                className="w-full border rounded-2xl px-4 py-3 text-black"
                placeholder="Email"
              />

              <input
                value={formData.phone}
                onChange={e => handleInputChange("phone", e.target.value)}
                className="w-full border rounded-2xl px-4 py-3 text-black"
                placeholder="Phone"
              />

              <input
                value={formData.license}
                onChange={e => handleInputChange("license", e.target.value)}
                className="w-full border rounded-2xl px-4 py-3 text-black"
                placeholder="License"
              />

              {/* BUS DROPDOWN */}
              <div className="relative text-black">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex justify-between border rounded-2xl px-4 py-3"
                >
                  {selectedBus || "No assignment"}
                  <ChevronDown size={18} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute w-full bg-white border rounded-2xl mt-1 shadow-lg text-black ">
                    {["", "Bus 01", "Bus 02", "Bus 03"].map(bus => (
                      <button
                        key={bus}
                        onClick={() => {
                          setSelectedBus(bus);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full px-4 py-3 hover:bg-gray-100 text-left text-black"
                      >
                        {bus || "No assignment"}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* ACTIONS */}
            <div className="flex gap-4 mt-8">
              <button
                onClick={handleSaveChanges}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700"
              >
                Save Changes
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-xl text-black hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE MODAL (UNCHANGED) ================= */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20 p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle className="text-red-600" />
              <h2 className="text-xl font-bold text-black">Delete Driver</h2>
            </div>

            <p className="text-sm text-gray-700 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-black">{driver.name}</span>?
            </p>

            <div className="flex gap-3">
              <button className="flex-1 bg-red-600 text-white py-3 rounded-lg">
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 py-3 rounded-lg text-black"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
