"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

import DriverFooter from "@/components/navigation/DriverFooter";
import DriverNavbar from "@/components/navigation/DriverNavbar";
import DriverHeaderCard from "../../../components/DriverHeaderCard";
import GpsTrackingCard from "../../../components/GPSTrackingCard";
import EmergencyCard from "../../../components/EmergenceCard";
import { isAuthenticated, getUserRole } from "@/lib/auth";

/* ============================
   DYNAMIC MAP COMPONENT
============================ */
const Map = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, Marker, useMap } = mod;

      if (typeof window !== "undefined") {
        import("leaflet").then((L) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          delete L.Icon.Default.prototype._getIconUrl;

          L.Icon.Default.mergeOptions({
            iconUrl: "/leaflet/marker-icon.png",
            iconRetinaUrl: "/leaflet/marker-icon-2x.png",
            shadowUrl: "/leaflet/marker-shadow.png",
            iconSize: [25, 41],
            shadowSize: [41, 41],
          });
        });
      }

      function Recenter({ position }: { position: [number, number] }) {
        const map = useMap();
        map.setView(position);
        return null;
      }

      return {
        default: ({ position }: { position: [number, number] }) => (
          <MapContainer
            center={position}
            zoom={15}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <Marker position={position} />
            <Recenter position={position} />
          </MapContainer>
        ),
      };
    }),
  { ssr: false }
);

export default function DriverTracker() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");

  // Role-based protection - only allow driver access
  useEffect(() => {
    const checkAuth = () => {
      if (!isAuthenticated()) {
        router.push('/login');
        return;
      }
      
      const role = getUserRole();
      if (role !== 'driver') {
        if (role === 'admin') {
          router.push('/admin/dashboard');
        } else if (role === 'parent') {
          router.push('/parent/dashboard');
        } else {
          router.push('/login');
        }
        return;
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, [router]);

  /* ============================
     GPS TRACKING
  ============================ */
  useEffect(() => {
    if (isLoading) return; // Don't start GPS until auth is complete
    
    if (!navigator.geolocation) {
      alert("Geolocation is not supported in this browser.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        console.log("Driver location:", { latitude: lat, longitude: lng });
        setPosition([lat, lng]);

        // Reverse geocode coordinates to address
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
          );
          const data = await res.json();
          setAddress(data.display_name || "Unknown location");
        } catch (err) {
          console.error("Failed to fetch address:", err);
          setAddress("Unknown location");
        }
      },
      (err) => console.error("GPS error:", err),
      { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoading]);

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
    <div className="min-h-screen flex flex-col bg-white">
      <DriverNavbar />

      <main className="flex-1">
        <div className="mb-4 sm:mb-6 px-2 sm:px-4">
          <DriverHeaderCard />
        </div>

        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 mb-10">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-4 max-w-7xl mx-auto">
            <div className="w-[500px] max-w-full">
              <GpsTrackingCard position={position} address={address} />
            </div>
            <div className="w-[500px] max-w-full">
              <EmergencyCard />
            </div>
          </div>
        </div>

        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 mb-10">
          <div className="flex justify-center">
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-[1000px] max-w-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-blue-700 rounded-lg"></div>
                <h3 className="text-xl text-black">Current Location Preview</h3>
              </div>

              <div className="flex items-end gap-4 rounded-lg p-4 bg-blue-300">
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

                <div className="flex-1 h-[300px]">
                  {position ? (
                    <Map position={position} />
                  ) : (
                    <p className="text-sm text-gray-700">Getting GPS location...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <DriverFooter />
    </div>
  );
}
