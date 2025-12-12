
'use client';
import DriverFooter from '@/components/navigation/DriverFooter'
import DriverNavbar from '@/components/navigation/DriverNavbar'
import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

function DriverTracker() {
  const position: LatLngExpression = [-1.9441, 30.0619]

  return (
    <div>
        <main className='flex-1 min-h-screen  bg-white'>
            <DriverNavbar/>
            
           
              <div className='flex items-center justify-center p-2 m-2'>
                <div className='bg-white border-3 m-1  w-280 h-auto min-h-[200px] pl-1 pt-0.5 rounded-3xl'>
                <div className="h-4 w-1 bg-blue-700 rounded-lg"></div>
                <h3 className='p-2 text-xl text-black '>Current Location Preview</h3>
                    
                      {/* Status Legend - On Blue Border */}
                <div className="absolute bottom-2 m-4 right flex flex-col gap-2 text-xs p-3 w-28 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
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
        <div className='flex items-center justify-center rounded-3xl pr-4 w-250 pl-12 pt-4 pb-4 h-auto mx-auto mb-2 bg-blue-300'>
                    
          
                     
                 <MapContainer 
                 
                center={position}
                zoom={14}
                scrollWheelZoom={true}
                dragging={true}
                touchZoom={true}
                doubleClickZoom={true}
                keyboard={true}
                style={{ width: '100%', height: '500px', minHeight: '250px' }}
              >  
              
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                
                
              </MapContainer>
              
              
              </div>
              </div>
              </div>
             
          
        </main>
        
        <DriverFooter/>
    </div>
  )
}

export default DriverTracker