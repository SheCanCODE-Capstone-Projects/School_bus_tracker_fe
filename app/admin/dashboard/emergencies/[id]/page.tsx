"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminFooter from "@/components/navigation/AdminFooter";
import { getAuthToken, getUserRole } from "@/lib/auth";

export default function EmergencyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [emergency, setEmergency] = useState<{
    type?: string;
    description?: string;
    status?: string;
    busNumber?: string;
    driverName?: string;
    reportedAt?: string;
    resolvedAt?: string;
    resolutionNotes?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getAuthToken() || getUserRole() !== "admin") {
      router.push("/login");
      return;
    }
    if (!id || typeof id !== "string") {
      setLoading(false);
      return;
    }
    const token = getAuthToken();
    if (!token) {
      setLoading(false);
      return;
    }
    fetch(`https://school-bus-tracker-be.onrender.com/api/admin/emergencies/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setEmergency({
            type: data.type,
            description: data.description,
            status: data.status,
            busNumber: data.busNumber,
            driverName: data.driverName,
            reportedAt: data.reportedAt,
            resolvedAt: data.resolvedAt,
            resolutionNotes: data.resolutionNotes,
          });
        }
      })
      .catch(() => setError("Failed to load emergency"))
      .finally(() => setLoading(false));
  }, [id, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin/dashboard/emergencies"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-black">Emergency Details</h1>
          </div>
          {loading && <p className="text-gray-600">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && emergency && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <p className="text-gray-700 font-medium">{emergency.type ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-2">{emergency.description ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">Status: {emergency.status ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">Bus: {emergency.busNumber ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">Driver: {emergency.driverName ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">Reported: {emergency.reportedAt ?? "—"}</p>
              {emergency.resolvedAt && <p className="text-gray-600 text-sm mt-1">Resolved: {emergency.resolvedAt}</p>}
              {emergency.resolutionNotes && <p className="text-gray-600 text-sm mt-2">{emergency.resolutionNotes}</p>}
            </div>
          )}
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}
