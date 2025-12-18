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
        <div className="bg-blue-200 p-4 lg:p-6 rounded-xl flex-1 relative transition-all duration-300 mb-4">
          {/* Map */}
          <div className="w-4/5 absolute top-4 right-4 bottom-8 overflow-hidden rounded-lg transition-all duration-300">
          
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
          <div className="absolute bottom-8 left-4 flex flex-col gap-1 text-xs p-3 w-36 sm:w-40 bg-white border border-gray-300 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <h3 className="font-semibold text-gray-600">Status Legend</h3>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">On Route</span>
            </div>

            <div className="flex items-center gap-2 mb-1">
              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
              <span className="text-gray-600">Stopped</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-600">Emergency</span>
            </div>

            <div className="flex items-center gap-2 mb-1 pt-2 border-t border-gray-200">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-xs">Last Updated</span>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-3 h-3 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 text-xs">Location</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ParentDashboardMap;
