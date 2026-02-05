"use client";

import React, { useEffect, useState } from "react";
import { parentGetBusLocation } from "@/lib/tracking-api";
import type { ParentBusLocationResponse } from "@/lib/tracking-api";
import ParentLiveBusMap from "./ParentLiveBusMap";

const POLL_INTERVAL_MS = 8000; // 8 seconds

interface ParentDashboardMapProps {
  /** Bus ID to show (e.g. from getParentBuses() or userData). Parent can only see buses their children use. */
  busId: number | null;
  busLabel?: string;
}

function ParentDashboardMap({ busId, busLabel = "Your bus" }: ParentDashboardMapProps) {
  const [location, setLocation] = useState<ParentBusLocationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (busId == null) {
      setLoading(false);
      setLocation(null);
      setError(null);
      return;
    }

    let cancelled = false;

    const fetchLocation = async () => {
      try {
        if (cancelled) return;
        setError(null);
        const data = await parentGetBusLocation(busId);
        if (cancelled) return;
        setLocation(data);
      } catch (e) {
        if (cancelled) return;
        const msg = e instanceof Error ? e.message : "Could not load bus location";
        setError(msg);
        setLocation(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [busId]);

  return (
    <div className="w-full">
      <div className="border border-gray-200 p-4 rounded-lg shadow-lg bg-white mb-4 md:mb-6 flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-1 bg-blue-700 rounded-lg" />
          <h2 className="text-xl lg:text-2xl font-semibold text-black">Live Bus Location</h2>
        </div>

        {busId == null ? (
          <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center text-gray-600 px-4">
              <p className="font-medium">No bus assigned</p>
              <p className="text-sm mt-1">Contact your school to assign your child to a bus. Then you’ll see the live location here.</p>
            </div>
          </div>
        ) : (
          <ParentLiveBusMap
            location={location}
            busLabel={busLabel}
            error={error}
            loading={loading}
          />
        )}

        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 bg-green-500 rounded-full" /> On route
          <span className="w-2 h-2 bg-yellow-400 rounded-full ml-2" /> Stopped
          <span className="w-2 h-2 bg-red-500 rounded-full ml-2" /> Emergency
        </div>
      </div>
    </div>
  );
}

export default ParentDashboardMap;
