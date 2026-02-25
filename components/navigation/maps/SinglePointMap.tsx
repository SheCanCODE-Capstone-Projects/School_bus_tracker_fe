"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

export interface SinglePointMapProps {
  /** Center of the map (required). On driver page use default when GPS not yet available. */
  position: [number, number];
  /** When false, map loads but no marker (e.g. driver waiting for GPS). Default true. */
  showMarker?: boolean;
}

const SinglePointMap = dynamic(
  () =>
    import("react-leaflet").then((mod) => {
      const { MapContainer, TileLayer, Marker, useMap } = mod;
      if (typeof window !== "undefined") {
        import("leaflet").then((L) => {
          // @ts-expect-error - Leaflet icon default
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
        useEffect(() => {
          map.setView(position, map.getZoom());
        }, [map, position[0], position[1]]);
        return null;
      }
      return {
        default: ({ position, showMarker = true }: SinglePointMapProps) => (
          <MapContainer
            center={position}
            zoom={14}
            scrollWheelZoom
            style={{ width: "100%", height: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {showMarker && <Marker position={position} />}
            {showMarker && <Recenter position={position} />}
          </MapContainer>
        ),
      };
    }),
  { ssr: false }
);

export default SinglePointMap;
