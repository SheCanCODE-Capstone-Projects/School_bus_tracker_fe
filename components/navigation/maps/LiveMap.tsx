'use client'
import React from 'react'
import { MapContainer, Marker, TileLayer, Popup } from 'react-leaflet'
import L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Bus marker - green background, black text with centered moving icon on left
const createBusIcon = (name: string, status: string) => new L.DivIcon({
  className: '',
  html: `<div style="background:#22c55e;padding:8px 12px 8px 38px;border-radius:8px;color:black;border:3px solid #16a34a;position:relative"><div style="position:absolute;top:50%;left:8px;transform:translateY(-50%) rotate(-40deg);background:#4ade80;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center;font-size:11px;color:white">➤</div><div style="font-size:12px;font-weight:bold">${name}</div><div style="font-size:12px;margin-top:2px">${status}</div></div>`,
  iconSize: [125, 50],
  iconAnchor: [62, 25]
})

// School marker - blue background with location icon and arrow
const createSchoolIcon = (name: string) => new L.DivIcon({
  className: '',
  html: `<div style="position:relative"><div style="background:#3b82f6;padding:8px 12px 8px 38px;border-radius:8px;color:white;font-size:12px;font-weight:bold;position:relative"><div style="position:absolute;top:50%;left:8px;transform:translateY(-50%);background:#60a5fa;border-radius:50%;width:22px;height:22px;display:flex;align-items:center;justify-content:center"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"></path><circle cx="12" cy="9" r="2.5"></circle></svg></div>${name}</div><div style="position:absolute;bottom:-10px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:10px solid transparent;border-right:10px solid transparent;border-top:10px solid #3b82f6"></div></div>`,
  iconSize: [230, 50],
  iconAnchor: [115, 50]
})

const LiveMap = () => {
  const position: LatLngExpression = [-1.9441, 30.0619]
  
  const busData = [
    { id: 1, position: [-1.9441, 30.0619] as LatLngExpression, name: 'Bus 01', status: 'Moving' }
  ];

  const schoolData = [
    { id: 1, position: [-1.946, 30.060] as LatLngExpression, name: 'Lincoln Elementary School' }
  ];

  return (
    <MapContainer 
      center={position}
      zoom={14}
      scrollWheelZoom={true}
      dragging={true}
      touchZoom={true}
      doubleClickZoom={true}
      keyboard={true}
      style={{ width: '100%', height: '700px', minHeight: '250px' }}
    >  
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {busData.map(bus => (
        <Marker key={bus.id} position={bus.position} icon={createBusIcon(bus.name, bus.status)}>
          <Popup>
            <strong>{bus.name}</strong><br/>
            Status: {bus.status}
          </Popup>
        </Marker>
      ))}
      {schoolData.map(school => (
        <Marker key={school.id} position={school.position} icon={createSchoolIcon(school.name)}>
          <Popup><strong>{school.name}</strong></Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

export default LiveMap