'use client';
import { SquarePen, Trash2, Phone, Bus, AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Define the type directly inside this file
type Driver = {
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
};

export default function DriverRow({ driver }: { driver: Driver }) {
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleEditClick = () => {
    router.push('/admin/dashboard/drivers/edit');
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  const handleConfirmDelete = () => {
    // Delete logic would go here
    setShowDeleteModal(false);
  };
  return (
    <>
      <tr className="border-b last:border-none">
      <td className="p-4 flex gap-3">
        <span className="text-2xl">🧑‍✈️</span>
        <div>
          <p className="text-black">{driver.name}</p>
        </div>
      </td>

      <td className="p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            <span className="text-black text-xs">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-black text-xs">{driver.email}</span>
          </div>
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
        <SquarePen size={18} className="text-blue-500 cursor-pointer hover:text-blue-700" onClick={handleEditClick} />
        <Trash2 size={18} className="text-red-500 cursor-pointer hover:text-red-700" onClick={handleDeleteClick} />
      </td>
      </tr>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <tr>
          <td colSpan={5} className="p-0">
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 backdrop-blur-sm bg-black/20">
              <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-full max-w-md">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <AlertTriangle size={24} className="text-red-600" />
                  <h2 className="text-xl font-bold text-black">Delete Driver</h2>
                </div>
                
                {/* Content */}
                <div className="mb-6">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Are you sure you want to delete <span className="font-semibold text-black">{driver.name}</span>? This action cannot be undone.
                  </p>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={handleConfirmDelete}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-3 rounded-lg transition-colors"
                  >
                    Delete
                  </button>
                  <button
                    onClick={handleCloseDeleteModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
