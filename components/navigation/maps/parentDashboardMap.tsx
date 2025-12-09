'use client'
import React from 'react'
import BusMarker from '../maps/BusMarker'
import SchoolMarker from '../maps/SchoolMarker'
import BusStopMarker from './BusStopMarker'
import { MapContainer, TileLayer } from 'react-leaflet'
import type { LatLngExpression } from 'leaflet'

function ParentDashboardMap() {
  const position: LatLngExpression = [-1.9441, 30.0619]
  
  return (

    <div className="w-10/12 mx-auto mt-5 h-[400px] flex justify-end">
        <div className='border w-200 p-4 rounded-lg shadow-lg bg-blue-100 overflow-hidden'>
        <div className="flex items-center gap-2">
        <div className="h-4  w-1 mb-4 bg-blue-700 rounded-lg"></div>
         <h2 className='text-xl font-semibold mb-4 text-black  text-left p-2'>Live Bus Location</h2>
         </div>
        <MapContainer 
            center={position}
            zoom={14}
            style={{ width: '100%', height: '100%' }}
          >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <BusMarker />
          <BusStopMarker/>
          <SchoolMarker />
        </MapContainer>
      </div>
    </div>
    
    
   
  )
}

export default ParentDashboardMap
