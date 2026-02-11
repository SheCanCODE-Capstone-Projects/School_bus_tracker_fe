"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import {
  adminGetTrackingStatus,
  adminGetBusLocations,
  type AdminTrackingStatusResponse,
  type AdminBusLocationPoint,
} from "@/lib/tracking-api";

const AdminSinglePointMap = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, Marker, useMap } = mod;
      if (typeof window !== "undefined") {
        import("leaflet").then((L) => {
          // @ts-expect-error
          delete L.Icon.Default.prototype._getIconUrl;
          L.Icon.Default.mergeOptions({
            iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
            iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
            shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
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
          <MapContainer center={position} zoom={14} scrollWheelZoom style={{ width: "100%", height: "100%" }}>
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

const POLL_STATUS_MS = 15000;
const POLL_LOCATIONS_MS = 10000;

interface AdminBusTrackingMapProps {
  busId: string | number;
  busName?: string;
}

export default function AdminBusTrackingMap({ busId, busName }: AdminBusTrackingMapProps) {
  const [status, setStatus] = useState<AdminTrackingStatusResponse | null>(null);
  const [locations, setLocations] = useState<AdminBusLocationPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchStatus = async () => {
      try {
        const data = await adminGetTrackingStatus(busId);
        if (!cancelled) setStatus(data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load tracking status");
      }
    };

    const fetchLocations = async () => {
      try {
        const data = await adminGetBusLocations(busId);
        console.log('=== Bus GPS Location Data ===');
        console.log('Bus ID:', busId);
        console.log('Location Points:', data);
        if (Array.isArray(data) && data.length > 0) {
          console.log('Latest GPS Coordinates:');
          console.log('  Latitude:', data[0].latitude);
          console.log('  Longitude:', data[0].longitude);
          console.log('  Last Updated:', data[0].lastUpdated);
        }
        if (!cancelled) setLocations(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching GPS locations:', err);
        if (!cancelled) setLocations([]);
      }
    };

    fetchStatus();
    fetchLocations();
    const t1 = setInterval(fetchStatus, POLL_STATUS_MS);
    const t2 = setInterval(fetchLocations, POLL_LOCATIONS_MS);
    return () => {
      cancelled = true;
      clearInterval(t1);
      clearInterval(t2);
    };
  }, [busId]);

  const latest =
    locations.length > 0
      ? locations[0]
      : null;
  const position: [number, number] | null =
    latest && typeof latest.latitude === "number" && typeof latest.longitude === "number"
      ? [latest.latitude, latest.longitude]
      : null;

  const isActive = status?.status === "ACTIVE";
  const startedAt = status?.startedAt ? new Date(status.startedAt) : null;
  const stoppedAt = status?.stoppedAt ? new Date(status.stoppedAt) : null;

  return (
    <div className="space-y-4">
      {/* Tracking status card */}
      <div className="flex flex-wrap items-center gap-4 p-4 bg-white border rounded-xl shadow-sm">
        <div
          className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
            isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-700"
          }`}
        >
          {status?.status ?? "—"} {isActive ? "(On route)" : "(No active trip)"}
        </div>
        {status?.driverName && (
          <span className="text-sm text-gray-600">Driver: {status.driverName}</span>
        )}
        {status?.busNumber && (
          <span className="text-sm text-gray-600">Bus: {status.busNumber}</span>
        )}
        {startedAt && !isNaN(startedAt.getTime()) && (
          <span className="text-xs text-gray-500">Started: {startedAt.toLocaleString()}</span>
        )}
        {stoppedAt && !isNaN(stoppedAt.getTime()) && (
          <span className="text-xs text-gray-500">Stopped: {stoppedAt.toLocaleString()}</span>
        )}
      </div>

      {error && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
          {error}
        </div>
      )}

      {/* Map */}
      <div className="h-[500px] w-full relative overflow-hidden rounded-lg border border-gray-200">
        {position ? (
          <AdminSinglePointMap position={position} />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
            <div className="text-center text-gray-500">
              <p className="text-sm">No location data yet for this bus.</p>
              <p className="text-xs mt-1">When the driver starts a trip and sends location, it will appear here.</p>
            </div>
          </div>
        )}
      </div>
      {latest?.lastUpdated && (
        <p className="text-xs text-gray-500">
          Last position: {new Date(latest.lastUpdated).toLocaleString()}
          {locations.length > 1 && ` • ${locations.length} points in history`}
        </p>
      )}
    </div>
  );
}
