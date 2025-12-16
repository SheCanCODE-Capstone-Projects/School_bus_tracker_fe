"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminFooter from "@/components/navigation/AdminFooter";

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.id;

  const [student, setStudent] = useState({
    name: "",
    age: "",
    parentName: "",
    parentPhone: "",
    address: "",
    busStop: "",
    assignedBus: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch student data based on ID
    // Replace this with your actual API call
    const fetchStudent = async () => {
      try {
        // Example: const response = await fetch(`/api/students/${studentId}`);
        // const data = await response.json();
        
        // For now, using mock data - replace with actual API call
        const mockStudent = {
          name: "Emily Anderson",
          age: "8",
          parentName: "Sarah Anderson",
          parentPhone: "+1 (555) 123-4567",
          address: "123 Oak Street",
          busStop: "Oak Street Stop",
          assignedBus: "Bus 01",
        };
        
        setStudent(mockStudent);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching student:", error);
        setLoading(false);
      }
    };

    fetchStudent();
  }, [studentId]);

  const handleInputChange = (field: string, value: string) => {
    setStudent({
      ...student,
      [field]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Replace with your actual API call
      // const response = await fetch(`/api/students/${studentId}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(student),
      // });
      
      console.log("Updating student:", student);
      
      // Navigate back to students list
      router.push("/admin/dashboard/students");
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-gray-600">Loading...</div>
        </div>
        <AdminFooter />
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => router.push("/admin/dashboard/students")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Students
            </button>
            <h1 className="text-3xl font-semibold text-gray-900">
              Edit Student
            </h1>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  value={student.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  value={student.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name
                </label>
                <input
                  type="text"
                  value={student.parentName}
                  onChange={(e) =>
                    handleInputChange("parentName", e.target.value)
                  }
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Parent Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Phone
                </label>
                <input
                  type="tel"
                  value={student.parentPhone}
                  onChange={(e) =>
                    handleInputChange("parentPhone", e.target.value)
                  }
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={student.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Bus Stop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Stop
                </label>
                <select
                  value={student.busStop}
                  onChange={(e) => handleInputChange("busStop", e.target.value)}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a bus stop</option>
                  <option value="Oak Street Stop">Oak Street Stop</option>
                  <option value="Maple Avenue Stop">Maple Avenue Stop</option>
                  <option value="Pine Road Stop">Pine Road Stop</option>
                  <option value="Elm Street Stop">Elm Street Stop</option>
                </select>
              </div>

              {/* Assign to Bus */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Assign to Bus
                </label>
                <select
                  value={student.assignedBus}
                  onChange={(e) =>
                    handleInputChange("assignedBus", e.target.value)
                  }
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a bus</option>
                  <option value="Bus 01">Bus 01</option>
                  <option value="Bus 02">Bus 02</option>
                  <option value="Bus 03">Bus 03</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  <Save className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/admin/dashboard/students")}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AdminFooter />
    </>
  );
}