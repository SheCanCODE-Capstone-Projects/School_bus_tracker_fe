"use client";
import ParentNavbar from '@/components/navigation/ParentNavbar'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '@/components/Footer'
import Notifications from '@/components/notifications'
import ParentDashboardMap from '@/components/navigation/maps/parentDashboardMap'
import BusInformationCard from '@/components/BusInformationCard'
import RecentUpdates from '@/components/RecentUpdates'
import { isAuthenticated, getUserRole, logout } from '@/lib/auth'
import { getParentStudents, getAssignedBusIdFromStudents, type ParentStudent } from '@/lib/tracking-api'

export default function ParentDashboard() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [busId, setBusId] = useState<number | null>(null);
  const [students, setStudents] = useState<ParentStudent[]>([]);

  // Run once on mount: auth check + load parent's students (GET /parent/{parentId}/students)
  useEffect(() => {
    const init = async () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      const role = getUserRole();
      if (role !== 'parent') {
        if (role === 'admin') router.push('/admin/dashboard');
        else if (role === 'driver') router.push('/driver/tracker');
        else router.push('/login');
        return;
      }
      setIsLoading(false);

      try {
        const raw = typeof window !== 'undefined' ? localStorage.getItem('userData') : null;
        const userData = raw ? (JSON.parse(raw) as { id?: number; parentId?: number }) : null;
        const parentId = userData?.parentId ?? userData?.id;
        if (parentId != null) {
          const list = await getParentStudents(parentId);
          setStudents(list);
          const assignedBusId = getAssignedBusIdFromStudents(list);
          if (assignedBusId != null) setBusId(assignedBusId);
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : '';
        // Only logout when token is missing/invalid (Not authenticated). 403 = forbidden but still logged in.
        if (msg.includes('Not authenticated')) {
          logout();
          return;
        }
        setStudents([]);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  const firstStudent = students[0];
  const assignedBus = firstStudent?.assignedBus;
  const busLabel = assignedBus?.busName ?? assignedBus?.busNumber ?? 'Your bus';
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
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
            <BusInformationCard
              students={students}
              busName={assignedBus?.busName}
              busNumber={assignedBus?.busNumber}
              parentName={firstStudent?.parentName}
            />
          </div>

          {/* RIGHT: Map (50%) – GET /parent/bus/{busId}/location */}
          <div className="w-full lg:w-1/2 h-full">
            <ParentDashboardMap busId={busId} busLabel={busLabel} />
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
