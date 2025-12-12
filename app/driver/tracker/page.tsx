
'use client';
import DriverFooter from '@/components/navigation/DriverFooter'
import DriverNavbar from '@/components/navigation/DriverNavbar'
import React from 'react'
import dynamic from 'next/dynamic'

const MapContainer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.MapContainer })), { ssr: false })
const TileLayer = dynamic(() => import('react-leaflet').then(mod => ({ default: mod.TileLayer })), { ssr: false })
import type { LatLngExpression } from 'leaflet'


function DriverTracker() {

  return (
    <div>
        <main className='flex-1 min-h-screen  bg-white'>
            <DriverNavbar/>
            
           
              <div className='flex items-center justify-center p-2 m-2'>
                <div className='bg-white border-3 m-1  w-280 h-auto min-h-[200px] pl-1 pt-0.5 rounded-3xl'>
        <div className='w-250 mx-auto mb-2'>
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-4 w-1 bg-blue-700 rounded-lg"></div>
                  <h3 className='text-xl text-black'>Current Location Preview</h3>
                </div>
                    
        <div className='flex rounded-3xl pr-4 pl-4 pt-4 pb-4 h-auto bg-blue-300'>
                      {/* Status Legend - Left Side */}
                <div className="flex flex-col gap-2 text-xs p-3 w-28 bg-white border border-gray-300 rounded-lg shadow-lg mr-4 self-end">
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
          <div className="flex-1">
                    
          
                     
                 {typeof window !== 'undefined' && (
                   <MapContainer 
                   center={[-1.9441, 30.0619]}
                   zoom={14}
                   scrollWheelZoom={true}
                   dragging={true}
                   touchZoom={true}
                   doubleClickZoom={true}
                   keyboard={true}
                   style={{ width: '100%', height: '300px', minHeight: '250px' }}
                 >  
                   <TileLayer
                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                   />
                      </MapContainer>
                 )}
              </div>
              </div>
              </div>
              </div>
              </div>
             
          
        </main>
        
        <DriverFooter/>
    </div>
  )
}

export default DriverTracker