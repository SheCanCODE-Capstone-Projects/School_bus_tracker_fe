"use client";

import React, { useState } from "react";
import { Bus, LogOut } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
    // router.push("/login");
  };

  return (
    <header className="relative bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 py-8 z-50">
      <div className="flex items-center justify-between">

        {/* LEFT: Logo + Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bus className="w-5 h-5 text-white" />
          </div>

          <h1 className="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">
            Admin Dashboard
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden text-gray-800 transition-transform duration-200 hover:scale-110"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
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
          <Link
            href="/admin/dashboard"
            className="text-blue-600 bg-blue-100 border border-blue-200 rounded-lg px-4 py-2 
            transition-all duration-200 hover:bg-blue-200 hover:scale-105 hover:shadow-md"
          >
            Dashboard
          </Link>

          <a 
            href="/admin/buses" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg
            transition-all duration-200 hover:bg-gray-100 hover:translate-x-1"
          >
            Buses
          </Link>

          <a 
            href="/admin/drivers" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg
            transition-all duration-200 hover:bg-gray-100 hover:translate-x-1"
          >
            Drivers
          </Link>

          <a 
            href="/admin/parents" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg
            transition-all duration-200 hover:bg-gray-100 hover:translate-x-1"
          >
            Parents
          </Link>

          <a 
            href="/admin/dashboardstudents" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg
            transition-all duration-200 hover:bg-gray-100 hover:translate-x-1"
          >
            Students
          </Link>

          <a 
            href="#" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 hover:translate-x-1" >History </a>

          <a 
            href="/admin/emergencies" 
            className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-lg
            transition-all duration-200 hover:bg-gray-100 hover:translate-x-1"
          >
            Emergencies
          </Link>

          <div className="hidden lg:block h-6 w-px bg-gray-300" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 
            hover:bg-red-50 rounded-lg px-3 py-2
            transition-all duration-200 hover:scale-105 hover:shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}