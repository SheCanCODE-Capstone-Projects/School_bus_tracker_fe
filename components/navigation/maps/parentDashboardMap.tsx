'use client'
import React from 'react'
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Bus marker - green background, black text with centered moving icon on left
const createBusIcon = (name: string, status: string) => new L.DivIcon({
  className: '',
  html: `<div style="background:#22c55e;padding:8px 12px 8px 38px;border-radius:8px;color:black;border:3px solid #16a34a;position:relative"><div style="position:absolute;top:50%;left:8px;transform:translateY(-50%) rotate(-90deg);background:#4ade80;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;color:white">➤</div><div style="font-size:12px;font-weight:bold">${name}</div><div style="font-size:10px;margin-top:2px">${status}</div></div>`,
  iconSize: [125, 50],
  iconAnchor: [62, 25]
})

// School marker - blue background with location icon and arrow
const createSchoolIcon = (name: string) => new L.DivIcon({
  className: '',
  html: `<div style="position:relative"><div style="background:#3b82f6;padding:8px 12px 8px 38px;border-radius:8px;color:white;font-size:12px;font-weight:bold;position:relative"><div style="position:absolute;top:50%;left:8px;transform:translateY(-50%) rotate(45deg);background:#60a5fa;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:12px">📍</div>${name}</div><div style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:10px solid #3b82f6"></div></div>`,
  iconSize: [230, 50],
  iconAnchor: [115, 50]
})
function ParentDashboardMap() {
  const position: LatLngExpression = [-1.9441, 30.0619]
  
    // Example positions
const busData = [
  { id: 1, position: [-1.9441, 30.0619] as LatLngExpression, name: 'Bus 01', status: 'Moving' }
];

const schoolData = [
  { id: 1, position: [-1.946, 30.060] as LatLngExpression, name: 'Lincoln Elementary School' }
];

  return (

    <div className="w-10/12 mx-auto mt-5 h-[400px] flex justify-end">
        <div className='border w-200 p-4 rounded-lg shadow-lg bg-blue-100 overflow-hidden'>
        <div className="flex items-center gap-2">
        <div className="h-4  w-1 mb-4 bg-blue-700 rounded-lg"></div>
           <h2 className='text-xl font-semibold mb-4 text-black  text-left p-2'>Live Bus Location</h2>
        </div>

    <div className="flex gap-4 items-end">
      <div className="flex flex-col gap-2  text-xs p-4 w-30 text-gray-500  bg-white rounded-lg shadow-lg">
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
        <MapContainer 
            center={position}
            zoom={14}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '300px' }}
          >  
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
         {/* Bus markers with text */}
        {busData.map(bus => (
          <Marker key={bus.id} position={bus.position} icon={createBusIcon(bus.name, bus.status)}>
            <Popup>
              <strong>{bus.name}</strong><br/>
              Status: {bus.status}
            </Popup>
          </Marker>
        ))}

        {/* School markers with border and text */}
        {schoolData.map(school => (
          <Marker key={school.id} position={school.position} icon={createSchoolIcon(school.name)}>
            <Popup><strong>{school.name}</strong></Popup>
          </Marker>
        ))}
        </MapContainer>
      </div>
    </div>
    </div>
    </div>
    
    
   
  )
}

export default ParentDashboardMap
