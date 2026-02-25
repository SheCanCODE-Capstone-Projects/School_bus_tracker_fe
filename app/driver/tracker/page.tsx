"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "leaflet/dist/leaflet.css";

import DriverFooter from "@/components/navigation/DriverFooter";
import DriverNavbar from "@/components/navigation/DriverNavbar";
import DriverHeaderCard from "../../../components/DriverHeaderCard";
import GpsTrackingCard from "../../../components/GPSTrackingCard";
import EmergencyCard from "../../../components/EmergenceCard";
import SinglePointMap from "@/components/navigation/maps/SinglePointMap";
import { isAuthenticated, getUserRole } from "@/lib/auth";
import { driverSendLocation, driverStartTracking, driverStopTracking } from "@/lib/tracking-api";

/** Default map center when GPS not yet available – map loads like bus details page. */
const DEFAULT_MAP_CENTER: [number, number] = [-1.9441, 30.0619];

export default function DriverTracker() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState<string>("");
  const [isTracking, setIsTracking] = useState(false);
  const [isTrackingBusy, setIsTrackingBusy] = useState(false);
  const [trackingError, setTrackingError] = useState<string>("");
  const [lastSent, setLastSent] = useState<string>("--:--:--");
  const lastSentAtRef = useRef<number>(0);
  const isTrackingRef = useRef(false);
  isTrackingRef.current = isTracking;
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isRequestingLocation, setIsRequestingLocation] = useState(false);

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
     GPS TRACKING – same pattern as your working (non-integrated) code: watchPosition only, inline callback
     + when tracking is on, send to POST /api/driver/tracking/location every 5s
  ============================ */
  useEffect(() => {
    if (isLoading) return;

    if (!navigator.geolocation) {
      return;
    }

    // Get current position so the map shows "where I am" directly (fresh fix when possible)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setLocationError(null);
      },
      (err) => {
        if (err.code === 1) setLocationError("Location blocked. Click «Use my location» below and choose Allow.");
        else if (err.code === 3) setLocationError("Timed out. Click «Use my location» to try again.");
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 }
    );

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        setPosition([lat, lng]);
        setLocationError(null);

        // Send to backend only when driver has started tracking (throttled every 5s)
        if (isTrackingRef.current) {
          const now = Date.now();
          const throttleMs = 5000;
          if (now - lastSentAtRef.current >= throttleMs) {
            try {
              lastSentAtRef.current = now;
              setTrackingError("");
              await driverSendLocation({
                latitude: lat,
                longitude: lng,
                speed: typeof pos.coords.speed === "number" ? pos.coords.speed : null,
                heading: typeof pos.coords.heading === "number" ? pos.coords.heading : null,
              });
              setLastSent(new Date().toLocaleTimeString());
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Failed to send location";
              setTrackingError(msg);
              lastSentAtRef.current = 0;
            }
          }
        }

        // Reverse geocode (same as your working code)
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            setAddress(data.locality || data.city || data.countryName || "Unknown location");
          } else {
            setAddress("Unknown location");
          }
        } catch (err) {
          console.error("Failed to fetch address:", err);
          setAddress("Unknown location");
        }
      },
      (err) => {
        console.log("GPS error:", err);
        setAddress("GPS unavailable - please enable location services");
        const msg =
          err.code === 1
            ? "Location blocked. Click «Use my location» and allow when the browser asks."
            : err.code === 3
              ? "Location timed out. Click «Use my location» to try again."
              : "Could not get location. Use the button below to try again.";
        setLocationError(msg);
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isLoading]);

  // Request location on button click (user gesture – often needed for browser to show "Allow?" prompt)
  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setIsRequestingLocation(true);
    setLocationError(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);
        setLocationError(null);
        setIsRequestingLocation(false);
        try {
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}&localityLanguage=en`
          );
          if (res.ok) {
            const data = await res.json();
            setAddress(data.locality || data.city || data.countryName || "Unknown location");
          } else setAddress("Unknown location");
        } catch {
          setAddress("Unknown location");
        }
      },
      (err) => {
        setIsRequestingLocation(false);
        const msg =
          err.code === 1
            ? "Location blocked. In the address bar click the lock/info icon → Site settings → set Location to Allow, then try again."
            : err.code === 3
              ? "Request timed out. Check your connection and try again."
              : "Could not get location. Try again or check site settings.";
        setLocationError(msg);
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 20000 }
    );
  };

  const handleStartTracking = async () => {
    setTrackingError("");
    setIsTrackingBusy(true);
    try {
      await driverStartTracking();
      setIsTracking(true);
      lastSentAtRef.current = 0;
      setLastSent("--:--:--");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to start tracking";
      setTrackingError(msg);
      setIsTracking(false);
    } finally {
      setIsTrackingBusy(false);
    }
  };

  const handleStopTracking = async () => {
    setTrackingError("");
    setIsTrackingBusy(true);
    try {
      await driverStopTracking();
      setIsTracking(false);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Failed to stop tracking";
      setTrackingError(msg);
    } finally {
      setIsTrackingBusy(false);
    }
  };

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
              <GpsTrackingCard
                position={position}
                address={address}
                isTracking={isTracking}
                lastSent={lastSent}
                isBusy={isTrackingBusy}
                error={trackingError}
                onStart={handleStartTracking}
                onStop={handleStopTracking}
              />
            </div>
            <div className="w-[500px] max-w-full">
              <EmergencyCard />
            </div>
          </div>
        </div>

        {/* Map section – loads like bus details: map always visible, no "Waiting for GPS" placeholder */}
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8 mb-10">
          <div className="max-w-5xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-4 w-1 bg-blue-700 rounded-lg" />
                <h3 className="text-lg font-bold text-gray-800">Tracking &amp; location</h3>
              </div>

              <div className="h-[500px] w-full relative overflow-hidden rounded-lg border border-gray-200">
                <SinglePointMap
                  position={position ?? DEFAULT_MAP_CENTER}
                  showMarker={!!position}
                />
              </div>

              {position ? (
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">Current position:</span> Lat {position[0].toFixed(6)}, Lng {position[1].toFixed(6)}
                  {isTracking && (
                    <span className="ml-2 text-green-700"> • Sending to server every 5s (last: {lastSent})</span>
                  )}
                </p>
              ) : (
                <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
                  <button
                    type="button"
                    onClick={requestLocation}
                    disabled={isRequestingLocation}
                    className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-60"
                  >
                    {isRequestingLocation ? "Requesting…" : "Use my location"}
                  </button>
                  {locationError && (
                    <span className="text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs">
                      {locationError}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-4 flex items-center gap-4 text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-green-500 rounded-full" /> On Route
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-yellow-400 rounded-full" /> Stopped
              </span>
              <span className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full" /> Emergency
              </span>
            </div>
          </div>
        </div>
      </main>

      <DriverFooter />
    </div>
  );
}
