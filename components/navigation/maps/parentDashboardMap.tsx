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
    <div>
    <div className="w-10/12 mx-auto mt-5 h-[400px] flex justify-end">
      <div className="w-1/2 h-full bg-blue-200 rounded-lg shadow-lg overflow-hidden">
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
    </div>
  )
}

export default ParentDashboardMap
