'use client';
import React, { useState } from "react";
import { Bus, LogOut } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function AdminDriverNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router= useRouter();
  const handleLogout=()=>{
    router.push('/login')
  }

  return (
    <header className="relative bg-white border-b border-gray-200 shadow-xs px-4 sm:px-8 py-4 sm:py-6">
      <div className="flex items-center justify-between">

        {/* Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bus className="w-6 h-6 text-white" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Manage Drivers
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              
              <span></span>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="sm:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row
          absolute sm:relative top-full sm:top-auto left-0 sm:left-auto w-full sm:w-auto
          bg-white sm:bg-transparent shadow-lg sm:shadow-none
          items-center justify-center gap-3 sm:gap-6 py-4 sm:py-0 font-medium text-xs sm:text-sm`}
        >
          <a
            href="/admin/dashboard"
            className="text-blue-600 bg-sky-100 border border-sky-200 rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Dashboard
          </a>

          <a
            href="/admin/buses"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Buses
          </a>

          <a
            href="/admin/dashboard/drivers"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Drivers
          </a>

          <a
            href="/admin/parents"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Parents
          </a>

          <a
            href="/admin/students"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Students
          </a>

          

          <a
            href="/admin/emergencies"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Emergencies
          </a>

          {/* Divider */}
          <div className="h-6 w-px bg-gray-300"></div>

          {/* Logout */}
          <button
          onClick={handleLogout}
           className="flex items-center gap-2 text-gray-600 hover:text-red-500 border border-transparent transition-all duration-300 hover:bg-red-100 rounded-lg py-1 px-3 sm:py-2 sm:px-5">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
