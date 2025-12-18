"use client"
import React, { useState } from "react";
import { Bus, LogOut } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BusesNavbar() {
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
             Manage Buses
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>dfhkj</span>
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
          <Link
            href="/admin/dashboard"
             className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"

          >
            Dashboard
          </Link>

          <Link
            href="/admin/dashboard/buses"
                       className="text-blue-600 bg-blue-100 border border-blue-200 rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Buses
          </Link>

          <Link
            href="/admin/drivers"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Drivers
          </Link>

          <Link
            href="/admin/parents"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Parents
          </Link>

          <Link
            href="/admin/students"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Students
          </Link>

          <Link
            href="#"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            History
          </Link>

          <Link
            href="/admin/emergencies"
            className="text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4"
          >
            Emergencies
          </Link>

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
