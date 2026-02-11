"use client";

import { BsCursor, BsCaretRight, BsStopFill, BsGeoAlt, BsClock } from "react-icons/bs";

interface GpsTrackingCardProps {
  position: [number, number] | null;
  address: string;
  isTracking: boolean;
  lastSent: string;
  isBusy?: boolean;
  error?: string;
  onStart: () => void;
  onStop: () => void;
}

const GpsTrackingCard = ({
  position,
  address,
  isTracking,
  lastSent,
  isBusy,
  error,
  onStart,
  onStop,
}: GpsTrackingCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 h-96 w-full flex items-center justify-center">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BsCursor className="text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">GPS Tracking Control</h2>
        </div>

        <button
          onClick={isTracking ? onStop : onStart}
          disabled={!!isBusy}
          className={`${
            isTracking ? "bg-gray-500 hover:bg-gray-600" : "bg-[#1F883F] hover:bg-[#176a32]"
          } disabled:opacity-50 text-white font-semibold py-4 sm:py-6 px-8 sm:px-20 lg:px-32 w-full rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base sm:text-lg`}
        >
          {isTracking ? (
            <>
              <BsStopFill className="text-white text-xl sm:text-2xl" />
              {isBusy ? "Stopping…" : "Stop Tracking"}
            </>
          ) : (
            <>
              <BsCaretRight className="text-white text-xl sm:text-2xl" />
              {isBusy ? "Starting…" : "Start Tracking"}
            </>
          )}
        </button>

        <div
          className={`${
            isTracking ? "bg-green-100 border-green-300 text-green-700" : "bg-gray-100 border-gray-300 text-gray-600"
          } font-semibold py-4 sm:py-6 px-8 sm:px-20 lg:px-32 w-full rounded-xl flex items-center justify-center gap-2 text-base sm:text-lg mt-4`}
        >
          <div className={`w-3 h-3 rounded-full ${isTracking ? "bg-green-500" : "bg-gray-500"}`}></div>
          {isTracking ? "Tracking Active" : "Tracking Inactive"}
        </div>

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        {position && (
          <div className="mt-4 text-center space-y-2">
            <p className="text-black font-bold text-sm">{address || "Getting address…"}</p>
            <div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
              <BsGeoAlt className="text-green-500" />
              <span>
                Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
              </span>
            </div>
            {isTracking && (
              <div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
                <BsClock className="text-green-500" />
                <span>Last Sent to server: {lastSent}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GpsTrackingCard;
