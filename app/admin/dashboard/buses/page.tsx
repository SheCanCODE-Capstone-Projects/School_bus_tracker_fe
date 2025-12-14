"use client";

import Footer from "@/components/Footer";
import BusesNavbar from "@/components/navigation/dashboard/BusStatusCard";
import { Search } from "lucide-react";


export default function BusesPage() {
  return (
    <div className="bg-white flex flex-col min-h-screen">
      <main className="flex-1"><BusesNavbar/>
      <div className="flex items-center gap-4 px-4 sm:px-8 mt-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
          <input 
            placeholder="Search by name, driver, or route..."
            className="w-full pl-10 pr-4 py-2 text-gray-600 border border-gray-400 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-300"
          />
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600">+ Add Bus</button>
      </div>
       <span className="flex space-x-6 mt-5 px-4 sm:px-8 items-center gap-4 text-gray-500">
          <p className="border py-4 px-4 w-85 border-blue-200 bg-transparent rounded-lg shadow-lg">Total Buses <br />5</p>
           <p className="border py-4 px-4 w-85 border-green-200 bg-transparent rounded-lg shadow-lg">Active Buses <br />4</p>
            <p className="border py-4 px-4 w-85 border-yellow-200 bg-transparent rounded-lg shadow-lg">Total Students <br />172</p>
             <p className="border py-4 px-4 w-85 border-purple-200 bg-transparent rounded-lg shadow-lg">Avg Capacity <br />70%</p>
        </span>
      
      
      
      
      
      
      
      </main>
      <Footer/>
    </div>
  )
}