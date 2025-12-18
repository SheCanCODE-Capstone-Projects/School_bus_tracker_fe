"use client";

import React, { useState } from "react";
import { Bus, LogOut } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import { usePathname } from "next/navigation";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleLogout = () => {
    console.log("Logging out...");
    // router.push("/login");
  };

  return (
    <header className="relative bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 py-9 z-50">
      <div className="flex items-center justify-between">

        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-12 hover:shadow-lg cursor-pointer">
            <Bus className="w-5 h-5 text-white transition-transform duration-300 hover:scale-110" />
          </div>

          <h1 className="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap transition-all duration-300 hover:text-blue-600 cursor-pointer">
            Admin Dashboard
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-800 transition-all duration-300 hover:scale-110 hover:rotate-180 hover:bg-gray-100 rounded-lg p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} className="transition-transform duration-300 rotate-180" /> : <HiMenu size={24} className="transition-transform duration-300" />}
        </button>

        {/* Navigation */}
        <nav
          className={`${
            isMenuOpen 
              ? "flex opacity-100 translate-y-0" 
              : "hidden opacity-0 -translate-y-4"
          } lg:flex lg:opacity-100 lg:translate-y-0 
          flex-col lg:flex-row absolute lg:relative top-full lg:top-auto left-0 lg:left-auto
          w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none 
          items-start lg:items-center gap-2 sm:gap-3 lg:gap-4 
          py-4 lg:py-0 pl-4 lg:pl-0 
          text-xs sm:text-sm lg:text-base font-medium
          transition-all duration-300 ease-in-out`}
        >
          <a
            href="/admin/dashboard"
            className={`${pathname === '/admin/dashboard' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            Dashboard
          </a>

          <a 
            href="/admin/buses" 
            className={`${pathname === '/admin/buses' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            Buses
          </a>

          <a 
            href="/admin/drivers" 
            className={`${pathname === '/admin/drivers' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            Drivers
          </a>

          <a 
            href="/admin/dashboard/parents" 
            className={`${pathname === '/admin/dashboard/parents' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            Parents
          </a>

          <a 
            href="/admin/dashboard/students" 
            className={`${pathname === '/admin/dashboard/students' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            Students
          </a>

          <a 
            href="#" 
            className={`${pathname === '#' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            History
          </a>

          <a 
            href="/admin/emergencies" 
            className={`${pathname === '/admin/emergencies' ? 'text-blue-600 bg-blue-100 border border-blue-200 scale-105 shadow-lg -translate-y-1' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100 hover:-translate-y-1'} rounded-lg px-4 py-2 transition-all duration-500 ease-out hover:scale-110 hover:shadow-lg transform hover:rotate-1`}
          >
            Emergencies
          </a>

          <div className="hidden lg:block h-6 w-px bg-gray-300" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 
            hover:bg-red-50 rounded-lg px-3 py-2
            transition-all duration-300 hover:scale-110 hover:shadow-lg hover:-translate-y-1 hover:rotate-3"
          >
            <LogOut className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}