"use client";

import React from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

export interface BusLocationPoint {
  latitude: number;
  longitude: number;
  lastUpdated?: string;
}

const SinglePointMap = dynamic(
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

interface ParentLiveBusMapProps {
  location: BusLocationPoint | null;
  busLabel?: string;
  error?: string | null;
  loading?: boolean;
}

export default function ParentLiveBusMap({ location, busLabel = "Bus", error, loading }: ParentLiveBusMapProps) {
  const position: [number, number] | null =
    location && typeof location.latitude === "number" && typeof location.longitude === "number"
      ? [location.latitude, location.longitude]
      : null;

  const lastUpdated =
    location?.lastUpdated != null
      ? (() => {
          try {
            const d = new Date(location.lastUpdated);
            return isNaN(d.getTime()) ? null : d;
          } catch {
            return null;
          }
        })()
      : null;

  const lastUpdatedText =
    lastUpdated != null
      ? lastUpdated.toLocaleTimeString() + " " + lastUpdated.toLocaleDateString()
      : null;

  if (loading && !position) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500 text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-500 border-t-transparent mx-auto mb-2" />
          <p className="text-sm">Loading bus location…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-amber-50 rounded-lg border border-amber-200">
        <div className="text-center px-4">
          <p className="text-amber-800 font-medium">{error}</p>
          <p className="text-sm text-amber-700 mt-1">The driver may not have started tracking yet.</p>
        </div>
      </div>
    );
  }

  if (!position) {
    return (
      <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500 text-center">
          <p className="text-sm">No location data yet.</p>
          <p className="text-xs mt-1">When the driver starts a trip, the bus will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-gray-200">
        <SinglePointMap position={position} />
      </div>
      {lastUpdatedText && (
        <p className="text-xs text-gray-600">
          {busLabel} • Last updated: {lastUpdatedText}
        </p>
      )}
    </div>
  );
}
