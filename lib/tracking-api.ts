import { getAuthToken } from './auth';

const API_BASE_URL = 'https://school-bus-tracker-be.onrender.com/api';
/** Parent controller routes in doc are without /api: GET /parent/{id}/students, GET /parent/bus/{id}/location */
const PARENT_BASE_URL = 'https://school-bus-tracker-be.onrender.com';

/** Throws if no valid token – use this so we never call protected APIs without Authorization. */
function requireAuthHeaders(): HeadersInit {
  const token = getAuthToken();
  if (!token || typeof token !== 'string' || token.trim() === '') {
    throw new Error('Not authenticated. Please log in again.');
  }
  return { Authorization: `Bearer ${token}` };
}

export interface TrackingSuccessResponse {
  success: boolean;
  message?: string;
}

export interface DriverLocationPayload {
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
}

export interface ParentBusLocationResponse {
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
  lastUpdated: string; // ISO 8601
}

export interface AdminTrackingStatusResponse {
  status: 'ACTIVE' | 'STOPPED';
  startedAt: string | null;
  stoppedAt: string | null;
  driverName?: string;
  busNumber?: string;
}

export interface AdminBusLocationPoint {
  latitude: number;
  longitude: number;
  speed?: number | null;
  heading?: number | null;
  lastUpdated: string; // ISO 8601
}

const REQUEST_TIMEOUT_MS = 45000; // 45s – Render free tier cold start can be slow

async function fetchWithTimeout(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<Response> {
  const { timeoutMs = REQUEST_TIMEOUT_MS, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
    return res;
  } catch (e) {
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error(
        'Request timed out. Backend may be starting (e.g. Render free tier). Check network/CORS or try again.'
      );
    }
    if (e instanceof TypeError && e.message === 'Failed to fetch') {
      throw new Error(
        'Network error: cannot reach server. Check CORS (backend must allow your origin) and that the server is running.'
      );
    }
    throw e;
  } finally {
    clearTimeout(id);
  }
}

async function parseError(res: Response): Promise<string> {
  try {
    const text = await res.text();
    if (!text) return `Request failed (${res.status})`;
    try {
      const json = JSON.parse(text) as { message?: string };
      return json?.message || text;
    } catch {
      return text;
    }
  } catch {
    return `Request failed (${res.status})`;
  }
}

/** Backend must resolve JWT to a Driver entity; "Driver entity not found" means no Driver record for this user. */
export async function driverStartTracking(): Promise<TrackingSuccessResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/driver/tracking/start`, {
    method: 'POST',
    headers: { ...requireAuthHeaders() },
  });

  let data: (TrackingSuccessResponse & { message?: string }) | null = null;
  try {
    data = (await res.json()) as TrackingSuccessResponse & { message?: string };
  } catch {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  if (data && data.success === false) {
    throw new Error(data.message || 'Failed to start tracking');
  }
  return data!;
}

export async function driverStopTracking(): Promise<TrackingSuccessResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/driver/tracking/stop`, {
    method: 'POST',
    headers: { ...requireAuthHeaders() },
  });

  let data: (TrackingSuccessResponse & { message?: string }) | null = null;
  try {
    data = (await res.json()) as TrackingSuccessResponse & { message?: string };
  } catch {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  if (data && data.success === false) {
    throw new Error(data.message || 'Failed to stop tracking');
  }
  return data!;
}

export async function driverSendLocation(payload: DriverLocationPayload): Promise<TrackingSuccessResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/driver/tracking/location`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...requireAuthHeaders(),
    },
    body: JSON.stringify(payload),
  });

  let data: (TrackingSuccessResponse & { message?: string }) | null = null;
  try {
    data = (await res.json()) as TrackingSuccessResponse & { message?: string };
  } catch {
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
  }
  if (!res.ok) throw new Error(data?.message || `Request failed (${res.status})`);
  if (data && data.success === false) {
    throw new Error(data.message || 'Failed to send location');
  }
  return data!;
}

/** Student from GET /parent/{parentId}/students – has assignedBus; use assignedBus.id for GET /parent/bus/{busId}/location. */
export interface ParentStudent {
  id?: number;
  studentName?: string;
  age?: number;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  busStop?: { stopName?: string; address?: string };
  assignedBus?: {
    id?: number;
    busName?: string;
    busNumber?: string;
  };
  school_id?: number;
  busId?: number;
  [key: string]: unknown;
}

/** GET /parent/{parentId}/students – returns list of parent's students (each can have assignedBus with bus id). */
export async function getParentStudents(parentId: number | string): Promise<ParentStudent[]> {
  const res = await fetchWithTimeout(`${PARENT_BASE_URL}/parent/${parentId}/students`, {
    headers: { ...requireAuthHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  const list = Array.isArray(data) ? data : data?.students ?? data?.data ?? [];
  return list;
}

/**
 * Get the assigned bus ID from students (for GET /parent/bus/{busId}/location).
 * Backend should include assignedBus.id in GET /parent/{parentId}/students response so we can call the location API.
 */
export function getAssignedBusIdFromStudents(students: ParentStudent[]): number | null {
  for (const s of students) {
    const id =
      s?.assignedBus?.id ??
      (s?.assignedBus as { busId?: number })?.busId ??
      s?.busId ??
      (s?.bus as { id?: number })?.id;
    if (typeof id === 'number' && id > 0) return id;
  }
  return null;
}

/** GET /parent/bus/{busId}/location – live location of the bus (parent must have a child on this bus). */
export async function parentGetBusLocation(busId: number | string): Promise<ParentBusLocationResponse> {
  const res = await fetchWithTimeout(`${PARENT_BASE_URL}/parent/bus/${busId}/location`, {
    headers: { ...requireAuthHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as ParentBusLocationResponse;
}

/** Parent profile for settings – from GET /parent/{parentId} or inferred from userData + students. */
export interface ParentProfile {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  childNames?: string;
}

/** GET /parent/{parentId} – optional; returns parent profile. If 404, use userData + students. */
export async function getParentProfile(parentId: number | string): Promise<ParentProfile | null> {
  const res = await fetchWithTimeout(`${PARENT_BASE_URL}/parent/${parentId}`, {
    headers: { ...requireAuthHeaders() },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as Record<string, unknown>;
  return {
    name: String(data?.name ?? data?.fullName ?? data?.parentName ?? '').trim() || undefined,
    email: String(data?.email ?? '').trim() || undefined,
    phone: String(data?.phone ?? data?.phoneNumber ?? '').trim() || undefined,
    address: String(data?.address ?? data?.homeAddress ?? '').trim() || undefined,
  };
}

export async function adminGetTrackingStatus(busId: number | string): Promise<AdminTrackingStatusResponse> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/admin/buses/${busId}/tracking-status`, {
    headers: { ...requireAuthHeaders() },
  });

  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AdminTrackingStatusResponse;
}

export async function adminGetBusLocations(
  busId: number | string,
  params?: { from?: string; to?: string }
): Promise<AdminBusLocationPoint[]> {
  const query = new URLSearchParams();
  if (params?.from) query.set('from', params.from);
  if (params?.to) query.set('to', params.to);

  const url = `${API_BASE_URL}/admin/buses/${busId}/locations${query.toString() ? `?${query.toString()}` : ''}`;

  const res = await fetchWithTimeout(url, {
    headers: { ...requireAuthHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  return (await res.json()) as AdminBusLocationPoint[];
}

/** Assigned bus object from API (snake_case). */
export interface DriverAssignedBus {
  id?: number;
  bus_name?: string;
  bus_number?: string;
  route?: string;
  capacity?: number;
  status?: string;
}

/** Student on bus from driver profile API. */
export interface StudentOnBus {
  id?: number;
  student_name?: string;
  age?: number;
  parent_name?: string;
  parent_phone?: string;
}

/** Driver profile from GET /api/drivers/{id} – for logged-in driver. API uses snake_case. */
export interface DriverProfile {
  id: number;
  name?: string;
  fullName?: string;
  full_name?: string;
  email?: string;
  phone?: string;
  phone_number?: string;
  license_number?: string;
  bus?: string | { id?: number; busName?: string; busNumber?: string; bus_name?: string; bus_number?: string; route?: string };
  assigned_bus_id?: number | null;
  assigned_bus?: DriverAssignedBus;
  students_on_bus?: StudentOnBus[];
  status?: string;
  [key: string]: unknown;
}

/** GET /api/drivers/{id} – returns driver by id (use logged-in driver id). */
export async function getDriverById(driverId: number | string): Promise<DriverProfile> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/drivers/${driverId}`, {
    headers: { ...requireAuthHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  const raw = (await res.json()) as DriverProfile | { data?: DriverProfile; success?: boolean };
  const driver = (raw && typeof raw === 'object' && raw.data) ? raw.data : (raw as DriverProfile);
  if (!driver || typeof (driver as DriverProfile).id === 'undefined') {
    throw new Error('Invalid driver response from server');
  }
  return driver as DriverProfile;
}

/** Single emergency from GET /api/driver/emergencies/{id}. */
export interface DriverEmergency {
  id: number;
  type?: string;
  description?: string;
  status?: string;
  bus?: string;
  busNumber?: string;
  driver?: string;
  driverName?: string;
  time?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  reportedAt?: string;
  driverContact?: string;
  parentsNotified?: boolean;
  resolutionNotes?: string | null;
  resolvedBy?: string | null;
  resolvedByAdminName?: string | null;
  resolvedAt?: string | null;
  [key: string]: unknown;
}

/** GET /api/driver/emergencies/{id} – emergencies for driver (id = driver id). Backend may return single object or array. */
export async function getDriverEmergencies(driverId: number | string): Promise<DriverEmergency[]> {
  const res = await fetchWithTimeout(`${API_BASE_URL}/driver/emergencies/${driverId}`, {
    headers: { ...requireAuthHeaders() },
  });
  if (!res.ok) throw new Error(await parseError(res));
  const data = await res.json();
  if (Array.isArray(data)) return data;
  const list = data?.data ?? data?.emergencies;
  if (Array.isArray(list)) return list;
  if (data && typeof data === 'object' && typeof (data as DriverEmergency).id !== 'undefined') {
    return [data as DriverEmergency];
  }
  return [];
}

