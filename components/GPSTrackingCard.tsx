'use client';
import { useState } from 'react';
import { BsCursor, BsCaretRight, BsStopFill, BsGeoAlt, BsClock } from "react-icons/bs";
const GpsTrackingCard = () => {
  const [isTracking, setIsTracking] = useState(false);

  const toggleTracking = () => {
    setIsTracking(!isTracking);
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 h-96 w-full flex items-center justify-center">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          <BsCursor className="text-gray-700" />
          <h2 className="text-xl font-bold text-gray-900">GPS Tracking Control</h2>
        </div>
        
        {/* Toggle Tracking Button */}
        <button 
          onClick={toggleTracking}
          className={`${
            isTracking 
              ? 'bg-gray-500 hover:bg-gray-600' 
              : 'bg-[#1F883F] hover:bg-[#176a32]'
          } text-white font-semibold py-4 sm:py-6 px-8 sm:px-20 lg:px-32 w-full rounded-xl transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-base sm:text-lg`}
        >
          {isTracking ? (
            <>
              <BsStopFill className="text-white text-xl sm:text-2xl" />
              Stop Tracking
            </>
          ) : (
            <>
              <BsCaretRight className="text-white text-xl sm:text-2xl" />
              Start Tracking
            </>
          )}
        </button>
        
        {/* Tracking Status */}
        <div className={`${
          isTracking 
            ? 'bg-green-100 border-green-300 text-green-700' 
            : 'bg-gray-100 border-gray-300 text-gray-600'
        } font-semibold py-4 sm:py-6 px-8 sm:px-20 lg:px-32 w-full rounded-xl flex items-center justify-center gap-2 text-base sm:text-lg mt-4`}>
          <div className={`w-3 h-3 rounded-full ${
            isTracking ? 'bg-green-500' : 'bg-gray-500'
          }`}></div>
          {isTracking ? 'Tracking Active' : 'Tracking Inactive'}
        </div>
        
        {/* Tracking Information - Only show when tracking is active */}
        {isTracking && (
          <div className="mt-4 text-center space-y-2">
            {/* Location Address */}
            <p className="text-black font-bold text-sm">
              5th Avenue & Park Street
            </p>
            
            {/* Coordinates */}
            <div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
              <BsGeoAlt className="text-green-500" />
              <span>Lat: 40.7128, Lng: -74.0060</span>
            </div>
            
            {/* Last Sent Time */}
            <div className="flex items-center justify-center gap-1 text-gray-600 text-xs">
              <BsClock className="text-green-500" />
              <span>Last Sent: 12:10:41 AM</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats section - exact styling from image */}

    </div>
  );
};

export default GpsTrackingCard;