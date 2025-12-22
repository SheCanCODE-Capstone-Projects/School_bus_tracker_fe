'use client';

import DriverFooter from '@/components/navigation/DriverFooter';
import DriverNavbar from '@/components/navigation/DriverNavbar';
import DriverHeaderCard from '../../../components/DriverHeaderCard';
import GpsTrackingCard from '../../../components/GPSTrackingCard';
import EmergencyCard from '../../../components/EmergenceCard';
import React from 'react';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// Dynamic Leaflet Map
const Map = dynamic(() => import('react-leaflet').then(mod => {
  const { MapContainer, TileLayer } = mod;
  return {
    default: () => (
      <MapContainer
        center={[-1.9441, 30.0619]}
        zoom={14}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
      </MapContainer>
    )
  };
}), { ssr: false });

export default function DriverTracker() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DriverNavbar />

      <main className="flex-1">

        {/* Header */}
        <div className="mb-4 sm:mb-6 px-2 sm:px-4">
          <DriverHeaderCard />
        </div>

        {/* Cards Section */}
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-4 max-w-7xl mx-auto">
            <div className="w-[500px] max-w-full">
              <GpsTrackingCard />
            </div>
            <div className="w-[500px] max-w-full">
              <EmergencyCard />
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 mb-10">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 hover:scale-[1.02] transition-all max-w-7xl mx-auto" style={{width: '1000px', maxWidth: '100%'}}>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-4 w-1 bg-blue-700 rounded-lg"></div>
              <h3 className="text-xl text-black">Current Location Preview</h3>
            </div>

            <div className="flex items-end gap-4 rounded-lg p-4 bg-blue-300">
              {/* Status Legend */}
              <div className="flex flex-col gap-2 text-xs p-3 w-32 bg-white border border-gray-300 rounded-lg shadow-lg">
                <h3 className="font-semibold mb-1 text-gray-700">Status Legend</h3>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-600">On Route</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-gray-600">Stopped</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-gray-600">Emergency</span>
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 h-[300px]">
                <Map />
              </div>
            </div>
          </div>
        </div>

      </main>

      <DriverFooter />
    </div>
  );
}
