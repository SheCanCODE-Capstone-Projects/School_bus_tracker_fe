'use client';

import React, { useEffect, useState } from 'react';
import { Shield, Star, Calendar, Phone, Mail, User, TrendingUp, Award, Users } from 'lucide-react';
import DriverNavbar from '@/components/navigation/DriverNavbar';
import { getUserData } from '@/lib/auth';
import { getDriverById, type DriverProfile, type StudentOnBus } from '@/lib/tracking-api';

function busDisplay(driver: DriverProfile): string {
  const ab = driver.assigned_bus;
  if (ab?.bus_name) return ab.bus_name;
  if (ab?.bus_number) return `${ab.bus_number}`;
  const bus = driver.bus;
  if (bus) {
    if (typeof bus === 'string') return bus;
    const b = bus as { busName?: string; busNumber?: string; bus_name?: string; bus_number?: string };
    return b.busName ?? b.bus_name ?? b.busNumber ?? b.bus_number ?? '—';
  }
  const id = driver.assigned_bus_id;
  if (id != null) return `Bus ${id}`;
  return '—';
}

function busSubtext(driver: DriverProfile): string {
  const ab = driver.assigned_bus;
  if (ab?.bus_number && ab?.bus_name) return ab.bus_number;
  if (ab?.bus_number) return ab.bus_number;
  if (ab?.bus_name) return ab.bus_name;
  return '';
}

function busRoute(driver: DriverProfile): string {
  const ab = driver.assigned_bus;
  if (ab?.route) return ab.route;
  const bus = driver.bus;
  if (!bus || typeof bus === 'string') return '';
  return (bus as { route?: string }).route ?? '';
}

function studentsOnBusCount(driver: DriverProfile): number {
  const list = driver.students_on_bus ?? (driver as { studentsOnBus?: unknown[] }).studentsOnBus;
  return Array.isArray(list) ? list.length : 0;
}

export default function DriverProfile() {
  const [driver, setDriver] = useState<DriverProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getUserData();
    const id = user?.id != null ? String(user.id) : null;
    if (!id) {
      setError('Ntabwo wiyandikishije.');
      setLoading(false);
      return;
    }
    getDriverById(id)
      .then(setDriver)
      .catch((e) => setError(e instanceof Error ? e.message : 'Request failed'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <DriverNavbar />
        <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <p className="text-gray-600">Loading...</p>
        </main>
      </div>
    );
  }

  if (error || !driver) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <DriverNavbar />
        <main className="flex-1 p-4 sm:p-6 flex items-center justify-center">
          <p className="text-red-600">{error ?? 'Driver not found.'}</p>
        </main>
      </div>
    );
  }

  const name = driver.full_name ?? driver.fullName ?? driver.name ?? 'Driver';
  const phone = driver.phone_number ?? driver.phone ?? '—';
  const busName = busDisplay(driver);
  const busSub = busSubtext(driver);
  const busRouteText = busRoute(driver);
  const studentsCount = studentsOnBusCount(driver);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      <DriverNavbar />

      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-6xl mx-auto">

          {/* Header Card */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl p-6 sm:p-8 mb-6 text-black shadow-lg">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="w-20 h-20 sm:w-28 sm:h-28 bg-white rounded-xl sm:rounded-2xl flex items-center justify-center text-4xl sm:text-6xl shadow-lg">
                👨‍✈️
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{name}</h1>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-gray-300 text-sm sm:text-base">Professional Bus Driver</span>
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-1 h-6 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-2"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Full Name</label>
                  <p className="text-base sm:text-lg text-gray-900 font-medium">{name}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Phone Number</label>
                  <p className="text-base sm:text-lg text-gray-900 font-medium">{phone}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4 lg:col-span-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <p className="text-base sm:text-lg text-gray-900 font-medium break-all sm:break-normal">{driver.email ?? '—'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bus Assignment */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-1 h-6 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-2"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Bus Assignment</h2>
            </div>
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-5">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-md">
                🚌
              </div>
              <div className="text-center sm:text-left">
                <div className="text-sm font-medium text-gray-500 mb-1">Assigned Bus</div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1">{busName}{busSub ? ` (${busSub})` : ''}</h3>
                {busRouteText && <p className="text-gray-600 text-sm sm:text-base">{busRouteText}</p>}
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6 transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
            <div className="flex items-center gap-3 mb-6 group">
              <div className="w-1 h-6 bg-blue-600 rounded-full transition-all duration-300 group-hover:w-2"></div>
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Professional Details</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">License Number</label>
                  <p className="text-base sm:text-lg text-gray-900 font-semibold">{driver.license_number ?? '—'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Years of Service</label>
                  <p className="text-base sm:text-lg text-gray-900 font-semibold">{(driver as { yearsOfService?: number | string }).yearsOfService ?? '—'}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Total Trips Completed</label>
                  <p className="text-base sm:text-lg text-gray-900 font-semibold">{(driver as { totalTrips?: number | string }).totalTrips ?? '—'}</p>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg sm:rounded-xl p-4 sm:p-5 flex items-start gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-green-700" />
                </div>
                <div className="min-w-0 flex-1">
                  <label className="block text-sm font-medium text-green-700 mb-1">Safety Rating</label>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-base sm:text-lg text-gray-900 font-semibold">{(driver as { safetyRating?: string | number }).safetyRating ?? '—'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Row – optional if API returns these */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6">
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{(driver as { onTimeRate?: string | number }).onTimeRate ?? '—'}</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">On-Time Rate</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{(driver as { incidents?: number }).incidents ?? '—'}</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Incidents</p>
            </div>
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 text-center transition-transform duration-300 hover:-translate-y-1 sm:hover:-translate-y-2.5 hover:shadow-lg">
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">{studentsCount}</h3>
              <p className="text-gray-600 font-medium text-sm sm:text-base">Students</p>
            </div>
          </div>

          {/* Students on bus – real data from API */}
          {studentsCount > 0 && (
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
              <div className="flex items-center gap-3 mb-4 group">
                <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Students on Bus</h2>
              </div>
              <ul className="space-y-3">
                {(driver.students_on_bus ?? []).map((s: StudentOnBus) => (
                  <li key={s.id ?? s.student_name ?? Math.random()} className="bg-gray-50 rounded-lg p-4 flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900">{s.student_name ?? '—'}</p>
                      <p className="text-sm text-gray-500">Age {s.age ?? '—'} • Parent: {s.parent_name ?? '—'} ({s.parent_phone ?? '—'})</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 mb-1 text-sm sm:text-base">School Bus Tracker © 2025</p>
          <p className="text-gray-500 text-xs sm:text-sm">Drive safely, arrive safely</p>
        </div>
      </footer>

      {/* Help Button */}
      <button className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 sm:w-12 sm:h-12 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 transition-colors">
        <span className="text-lg sm:text-xl">?</span>
      </button>
    </div>
  );
}