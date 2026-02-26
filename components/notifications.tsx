'use client';

import React, { useState, useEffect } from 'react';
import { AiOutlineExclamationCircle } from 'react-icons/ai';
import { FaTimes } from 'react-icons/fa';
import { FiClock } from 'react-icons/fi';
import { parentGetBusLocation } from '@/lib/tracking-api';
import type { ParentStudent } from '@/lib/tracking-api';

/** Show banner only when bus is within this distance (km) of the stop. */
const APPROACHING_THRESHOLD_KM = 3;

/** Distance in km between two points (Haversine). */
function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export interface NotificationsProps {
  busId?: number | null;
  students?: ParentStudent[] | null;
  /** Optional bus stop coordinates (when backend provides them) for real distance/ETA */
  stopLat?: number | null;
  stopLon?: number | null;
}

function Notifications({ busId, students = [], stopLat = null, stopLon = null }: NotificationsProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [distanceKmVal, setDistanceKmVal] = useState<number | null>(null);
  const [etaTime, setEtaTime] = useState<string | null>(null);
  const [stopName, setStopName] = useState<string>('your stop');
  const [loading, setLoading] = useState(false);

  const firstStudent = students?.[0];
  const busStop = firstStudent?.busStop as { stopName?: string; address?: string; latitude?: number; longitude?: number } | undefined;
  const resolvedStopName = busStop?.stopName ?? stopName;

  useEffect(() => {
    if (resolvedStopName && resolvedStopName !== 'your stop') setStopName(resolvedStopName);
  }, [resolvedStopName]);

  useEffect(() => {
    if (busId == null) return;
    let cancelled = false;
    setLoading(true);
    setDistanceKmVal(null);
    setEtaTime(null);
    parentGetBusLocation(busId)
      .then((loc) => {
        if (cancelled) return;
        const busLat = loc.latitude;
        const busLon = loc.longitude;
        const slat = stopLat ?? busStop?.latitude;
        const slon = stopLon ?? busStop?.longitude;
        if (typeof slat === 'number' && typeof slon === 'number') {
          const d = distanceKm(busLat, busLon, slat, slon);
          setDistanceKmVal(d);
          const speedKmh = loc.speed != null ? Math.max(5, loc.speed * 3.6) : 25;
          const etaHours = d / speedKmh;
          const etaDate = new Date(Date.now() + etaHours * 60 * 60 * 1000);
          setEtaTime(etaDate.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }));
        } else {
          setDistanceKmVal(null);
          setEtaTime(null);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setDistanceKmVal(null);
          setEtaTime(null);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [busId, stopLat, stopLon, busStop?.latitude, busStop?.longitude]);

  // Only show when: parent has a bus assigned, has at least one student, and bus is actually approaching (within threshold)
  const hasBusAssigned = busId != null && Number(busId) > 0;
  const hasStudents = Array.isArray(students) && students.length > 0;
  const isApproaching =
    distanceKmVal != null && distanceKmVal <= APPROACHING_THRESHOLD_KM;
  const shouldShow =
    isVisible &&
    hasBusAssigned &&
    hasStudents &&
    isApproaching;

  if (!shouldShow) return null;

  const distanceText =
    distanceKmVal != null
      ? `approximately ${distanceKmVal < 1 ? (distanceKmVal * 1000).toFixed(0) + ' m' : distanceKmVal.toFixed(1) + ' km'} away from ${stopName}`
      : `approaching ${stopName}`;
  const etaText = etaTime != null ? `Estimated arrival: ${etaTime}` : null;

  return (
    <div className="relative block border pl-10 sm:flex flex-col bg-gradient-to-r from-yellow-500 to-amber-600 via-yellow-600 w-full max-w-2xl mx-auto mt-5 p-6 min-h-20 rounded-3xl shadow-2xl shadow-amber-100">
      <button
        type="button"
        onClick={() => setIsVisible(false)}
        aria-label="Close notification"
        className="absolute top-2 right-2 text-white p-4 hover:text-white transition-colors"
      >
        <FaTimes size={20} />
      </button>
      <h2 className="flex items-center text-black text-xl font-semibold pt-4 gap-2">
        <AiOutlineExclamationCircle className="text-white w-10 h-10 p-2 bg-amber-400 rounded-lg" />
        Bus Approaching Your Stop!
      </h2>
      <p className="text-xs sm:text-sm text-gray-700 sm:text-gray-600 pt-2">
        The bus is {distanceText}. Please get ready!
      </p>
      <div className="pt-4">
        {loading && distanceKmVal == null && !etaText && (
          <p className="text-xs text-white/90">Loading location...</p>
        )}
        {etaText && (
          <p className="flex items-center gap-2 text-xs text-white w-fit bg-amber-400 px-4 py-2 rounded-lg">
            <FiClock size={16} />
            {etaText}
          </p>
        )}
      </div>
    </div>
  );
}

export default Notifications;
