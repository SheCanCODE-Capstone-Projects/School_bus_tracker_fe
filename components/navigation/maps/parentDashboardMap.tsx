"use client";
import React from "react";
import dynamic from "next/dynamic";

const DynamicMap = dynamic(() => import("./LiveMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500 text-center">
        <div className="text-2xl mb-2">🗺️</div>
        <div>Loading map...</div>
      </div>
    </div>
  ),
});

function ParentDashboardMap() {
  return (
    <div className="w-full">
      <div className="border border-gray-200 h-[670px] p-4 rounded-lg shadow-lg bg-white mb-4 md:mb-6 flex flex-col transition-all duration-300 hover:shadow-xl hover:border-gray-300 hover:-translate-y-1 hover:scale-[1.02]">
        
        {/* Title */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 w-1 bg-blue-700 rounded-lg"></div>
          <h2 className="text-xl lg:text-2xl font-semibold text-black">
            Live Bus Location
          </h2>
        </div>

        {/* Map Container */}
        <div className="bg-blue-200 p-4 lg:p-6 rounded-xl flex-1 relative transition-all duration-300">
          {/* Map */}
          <div className="w-4/5 absolute top-4 right-4 bottom-4 overflow-hidden rounded-lg transition-all duration-300">
            {/* Actual Map with Error Handling */}
            <div className="w-full h-full">
              <React.Suspense fallback={
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <div className="text-gray-500 text-center">
                    <div className="text-2xl mb-2">🗺️</div>
                    <div>Loading map...</div>
                  </div>
                </div>
              }>
                <DynamicMap />
              </React.Suspense>
            </div>
            
            {/* Bus Pin - Moving */}
            <div className="absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
              <div className="bg-green-500 w-4 h-4 rounded-full border-2 border-white shadow-lg"></div>
              <div className="text-xs text-white bg-green-500 px-2 py-1 rounded mt-1 whitespace-nowrap">Bus 01</div>
            </div>
            

          </div>
          
          {/* Status Legend - On Blue Border */}
          <div className="absolute bottom-4 left-4 flex flex-col gap-2 text-xs p-3 w-28 bg-white border border-gray-300 rounded-lg shadow-lg z-10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
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
        </div>

      </div>
    </div>
  );
}

export default ParentDashboardMap;
