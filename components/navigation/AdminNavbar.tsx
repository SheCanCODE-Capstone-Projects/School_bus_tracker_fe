"use client";

import React, { useState } from "react";
import { Bus, LogOut } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <header className="relative bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 py-4 z-50">
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
          className="lg:hidden text-gray-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>

        {/* Navigation */}
        <nav
          className={`${isMenuOpen ? "flex" : "hidden"} lg:flex flex-col lg:flex-row absolute lg:relative top-full lg:top-auto left-0 lg:left-auto
          w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none items-start lg:items-center gap-2 sm:gap-3 lg:gap-4 py-4 lg:py-0 pl-4 lg:pl-0 text-xs sm:text-sm lg:text-base font-medium`} >
          <a
            href="/admin/dashboard"
            className="text-blue-600 bg-blue-100 border border-blue-200 rounded-lg px-4 py-2"
          >
            Dashboard
          </a>

          <a href="/admin/buses" className="text-gray-600 hover:text-black px-3 py-2">
            Buses
          </a>

          <a href="/admin/drivers" className="text-gray-600 hover:text-black px-3 py-2">
            Drivers
          </a>

          <a href="/admin/parents" className="text-gray-600 hover:text-black px-3 py-2">
            Parents
          </a>

          <a href="/admin/students" className="text-gray-600 hover:text-black px-3 py-2">
            Students
          </a>

          <a href="#" className="text-gray-600 hover:text-black px-3 py-2">
            History
          </a>

          <a href="/admin/emergencies" className="text-gray-600 hover:text-black px-3 py-2">
            Emergencies
          </a>

          <div className="hidden lg:block h-6 w-px bg-gray-300" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500 hover:bg-red-100 rounded-lg p-2  transition"
          >
            <LogOut className="w-4 h-4 px-1/2" />
            <span className="px-2">Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
