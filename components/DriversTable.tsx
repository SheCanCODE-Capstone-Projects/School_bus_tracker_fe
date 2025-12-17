'use client';
import DriverRow from "./DriverRow";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { useState } from "react";

type Driver = {
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
};

const drivers: Driver[] = [
  {
    name: "Michael Johnson",
    email: "michael.j@school.com",
    phone: "+1 (555) 987-6543",
    bus: "Bus 01",
    status: "Active",
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@school.com",
    phone: "+1 (555) 123-4567",
    bus: "Bus 02",
    status: "Active",
  },
  {
    name: "David Brown",
    email: "david.b@school.com",
    phone: "+1 (555) 789-0123",
    bus: "Bus 03",
    status: "Active",
  },
  {
    name: "Emily Davis",
    email: "emily.d@school.com",
    phone: "+1 (555) 456-7890",
    bus: "Bus 04",
    status: "Active",
  },
  {
    name: "James Wilson",
    email: "james.w@school.com",
    phone: "+1 (555) 234-5678",
    bus: null,
    status: "Inactive",
  },
];

export default function DriversTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const driversPerPage = 3;
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
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px]">
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
            {currentDrivers.map((driver) => (
              <DriverRow key={driver.email} driver={driver} />
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, drivers.length)} of {drivers.length} drivers
        </div>
        
        <div className="flex items-center gap-2">
          {/* First Page / Previous Button */}
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  currentPage === pageNumber
                    ? 'bg-blue-600 text-white border-blue-600'
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
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FaAngleRight className="text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
