'use client';
import { BsBroadcast } from "react-icons/bs";

const DriverHeaderCard = () => {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-black rounded-2xl shadow-lg p-4 sm:p-6 mt-4 sm:mt-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-gray text-xs sm:text-sm font-medium">You are driving</span>
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight">
            Bus 01 <span className="text-black block sm:inline">– Tracking Mode</span>
          </h1>
          <div className="flex items-center gap-2 mt-2">
            <BsBroadcast className="text-white text-sm sm:text-base" />
            <span className="text-white text-sm sm:text-base">Ready to broadcast</span>
          </div>
        </div>
        
        <div className="mt-4 md:mt-0 flex justify-center md:justify-end">
          <div className="bg-sky-400 rounded-lg p-2 sm:p-3 w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <span className="text-4xl sm:text-6xl">🚌</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverHeaderCard;