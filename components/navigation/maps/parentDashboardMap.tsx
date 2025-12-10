'use client'
import React from 'react'
import dynamic from 'next/dynamic'

const DynamicMap = dynamic(() => import('./LiveMap'), {
  ssr: false,
  loading: () => <div className="w-full h-[300px] bg-gray-100 rounded-lg flex items-center justify-center">Loading map...</div>
})

function ParentDashboardMap() {

    return (
      <div className="w-full lg:w-1/2 ml-auto mt-5 px-4">
        <div className='border border-gray-200 p-4 rounded-lg shadow-lg bg-white mb-5'>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-1 bg-blue-700 rounded-lg"></div>
            <h2 className='text-lg sm:text-xl lg:text-2xl font-semibold text-black'>Live Bus Location</h2>
          </div>
          
          <div className="bg-blue-200 p-3 sm:p-6 rounded-xl">
            <div className="flex gap-4 items-end">
              <div className="flex flex-col gap-2 text-xs p-4 w-32 text-gray-500 bg-white rounded-lg shadow-lg">
                <h3 className="font-semibold mb-2">Status Legend</h3>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span>On Route</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
                  <span>Stopped</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span>Emergency</span>
                </div>
              </div>
              
              <div className='flex-1'>
                <DynamicMap />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      
    
    )
  }

  export default ParentDashboardMap
