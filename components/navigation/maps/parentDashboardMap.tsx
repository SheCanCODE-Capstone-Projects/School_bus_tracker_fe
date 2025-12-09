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
    <div className="flex justify-end w-1/2 h-[400px] p-4 ml-auto">
    <MapContainer 
        center={position}
        zoom={14}
        style={{ width: '90%', height: '100%' }}
      >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <BusMarker />
      <BusStopMarker/>
      <SchoolMarker />
    </MapContainer> 
    </div>
  )
}

export default ParentDashboardMap
