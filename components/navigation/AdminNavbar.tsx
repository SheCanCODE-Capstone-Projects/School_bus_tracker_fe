import React from "react";
import { Bus, LogOut } from "lucide-react";

export default function AdminDashboardHeader() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>dfhkj</span>
            </div>
          </div>
        </div>

        <nav className="flex items-center gap-2">
          <a href="#" className="text-blue-600 hover:text-gray-700 font-medium bg-blue-50 px-4 py-2 rounded-lg hover:bg-blue-100 transition-colors">
            Dashboard
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Buses
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Drivers
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Parents
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Students
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            History
          </a>
          <a href="#" className="text-gray-500 hover:text-gray-700  font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            Emergencies
          </a>
          
          <div className="w-px h-9 bg-gray-300 mx-2"></div>
          
          <button className="flex items-center gap-2 text-gray-600 font-medium px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}