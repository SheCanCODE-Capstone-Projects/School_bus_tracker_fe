import ParentNavbar from '@/components/navigation/ParentNavbar'
import React from 'react'
import Footer from '@/components/Footer'
import Notifications from '@/components/notifications'
import ParentDashboardMap from '@/components/navigation/maps/parentDashboardMap'
import BusInformationCard from '@/components/BusInformationCard'
import RecentUpdates from '@/components/RecentUpdates'

export default function ParentDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      
      {/* Top Navigation */}
      <ParentNavbar />

      <main className="flex-1 p-4 md:p-6">

        {/* 🔶 Top Notification Banner */}
        <div className="mb-6">
          <Notifications />
        </div>

        {/* 🔷 Main Dashboard Content */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT: Bus Information (50%) */}
          <div className="w-full lg:w-1/2 h-full">
            <BusInformationCard />
          </div>

          {/* RIGHT: Map (50%) */}
          <div className="w-full lg:w-1/2 h-full">
            <ParentDashboardMap />
          </div>
        </div>

        {/* 🔵 Recent Updates Section */}
        <div className="mt-8">
          <RecentUpdates />
        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
