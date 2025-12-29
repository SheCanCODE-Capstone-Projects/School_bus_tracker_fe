"use client";

import React, { useState } from "react";
import { Bus, LogOut } from "lucide-react";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", title: "Admin Dashboard" },
  { href: "/admin/dashboard/buses", label: "Buses", title: "Manage Buses" },
  { href: "/admin/dashboard/drivers", label: "Drivers", title: "Manage Drivers" },
  { href: "/admin/dashboard/parents", label: "Parents", title: "Manage Parents" },
  { href: "/admin/dashboard/students", label: "Students", title: "Manage Students" },
  { href: "/admin/dashboard/history", label: "History", title: "History" },
  {
    href: "/admin/dashboard/emergencies",
    label: "Emergencies",
    title: "Emergency Management",
  },
];

export default function AdminNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // ✅ Correct page title resolution
  const currentPage =
    navItems.find(item =>
      item.href === "/admin/dashboard"
        ? pathname === "/admin/dashboard"
        : pathname.startsWith(item.href)
    ) ?? navItems[0];

  const handleLogout = () => {
    router.replace("/login");
  };

  return (
    <header className="relative bg-white border-b border-gray-200 px-4 sm:px-6 md:px-8 lg:px-12 py-8 z-50">
      <div className="flex items-center justify-between">

        {/* LEFT: Logo + Dynamic Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Bus className="w-5 h-5 text-white" />
          </div>

          <h1 className="text-lg md:text-xl font-semibold text-gray-900 whitespace-nowrap">
            {currentPage.title}
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
            isMenuOpen ? "flex" : "hidden"
          } lg:flex flex-col lg:flex-row absolute lg:relative top-full lg:top-auto left-0
          w-full lg:w-auto bg-white lg:bg-transparent shadow-lg lg:shadow-none
          items-start lg:items-center gap-2 sm:gap-3 lg:gap-4
          py-4 lg:py-0 pl-4 lg:pl-0
          text-xs sm:text-sm lg:text-base font-medium`}
        >
          {navItems.map(item => {
            // ✅ Correct active logic (Dashboard handled specially)
            const isActive =
              item.href === "/admin/dashboard"
                ? pathname === "/admin/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`px-4 py-2 rounded-lg transition-all duration-200
                  ${
                    isActive
                      ? "text-blue-600 bg-blue-100 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
              >
                {item.label}
              </Link>
            );
          })}

          <div className="hidden lg:block h-6 w-px bg-gray-300" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-500
            hover:bg-red-50 rounded-lg px-3 py-2 transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
