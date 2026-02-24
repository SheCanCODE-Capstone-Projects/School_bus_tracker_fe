"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminFooter from "@/components/navigation/AdminFooter";
import { getAuthToken, getUserRole } from "@/lib/auth";

export default function ParentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;
  const [parent, setParent] = useState<{
    name?: string;
    parentName?: string;
    email?: string;
    phone?: string;
    parentPhone?: string;
    homeAddress?: string;
    address?: string;
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
    fetch(`https://school-bus-tracker-be.onrender.com/api/admin/parents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setParent({
            name: data.name ?? data.parentName,
            parentName: data.parentName ?? data.name,
            email: data.email ?? data.parentEmail,
            phone: data.phone ?? data.parentPhone,
            parentPhone: data.parentPhone ?? data.phone,
            homeAddress: data.homeAddress ?? data.address,
            address: data.address ?? data.homeAddress,
          });
        }
      })
      .catch(() => setError("Failed to load parent"))
      .finally(() => setLoading(false));
  }, [id, router]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminNavbar />
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link
              href="/admin/dashboard/parents"
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft size={24} className="text-gray-600" />
            </Link>
            <h1 className="text-2xl font-bold text-black">Parent Details</h1>
          </div>
          {loading && <p className="text-gray-600">Loading...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {!loading && !error && parent && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <p className="text-gray-700 font-medium">{parent.name ?? parent.parentName ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">{parent.email ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">{parent.phone ?? parent.parentPhone ?? "—"}</p>
              <p className="text-gray-600 text-sm mt-1">{parent.homeAddress ?? parent.address ?? "—"}</p>
            </div>
          )}
        </div>
      </main>
      <AdminFooter />
    </div>
  );
}
