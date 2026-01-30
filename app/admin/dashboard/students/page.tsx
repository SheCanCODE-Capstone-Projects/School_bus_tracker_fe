"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Bus,
  UserPlus,
  MapPin,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SquarePen,
  AlertTriangle,
} from "lucide-react";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminFooter from "@/components/navigation/AdminFooter";

// Types
interface BusStop {
  stopName: string;
  address: string;
}

interface AssignedBus {
  busName: string;
  busNumber: string;
}

interface Student {
  id: number;
  studentName: string;
  age: number;
  parentName?: string;
  parentPhone?: string;
  address?: string;
  busStop?: BusStop;
  assignedBus?: AssignedBus;
  school_id?: number;
}

export default function StudentBusDashboard() {
  const router = useRouter();

  // State for students data
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for bus stops and buses
  const [busStops, setBusStops] = useState<Array<{ id: number; stopName: string; address: string }>>([]);
  const [buses, setBuses] = useState<Array<{ id: number; busName: string; busNumber: string }>>([]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 9;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [selectedBus, setSelectedBus] = useState("");

  // Add Student Modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    parentName: "",
    parentPhone: "",
    address: "",
    busStopId: "",
    assignedBusId: "",
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  // Edit Student Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editStudent, setEditStudent] = useState({
    id: "",
    name: "",
    age: "",
    parentName: "",
    parentPhone: "",
    address: "",
    busStop: "",
    assignedBus: "",
  });

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStop, setSelectedStop] = useState("All Stops");

  // Get authentication token from localStorage or cookies
  const getAuthToken = () => {
    // Try to get token from localStorage first
    if (typeof window !== "undefined") {
      // IMPORTANT: Clear any old/expired tokens first
      const authToken = localStorage.getItem("authToken");
      const token = localStorage.getItem("token");
      const adminToken = localStorage.getItem("adminToken");
      
      // Check and use authToken first (most recent from your login)
      let foundToken = authToken || token || adminToken;
      
      console.log("Token found:", foundToken ? "Yes" : "No");
      
      // Check if token is expired
      if (foundToken) {
        try {
          const parts = foundToken.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(atob(parts[1]));
            if (payload.exp) {
              const expirationDate = new Date(payload.exp * 1000);
              const now = new Date();
              
              console.log("Token expires:", expirationDate);
              console.log("Current time:", now);
              
              if (now > expirationDate) {
                console.warn("Token has expired! Clearing...");
                // Clear ALL tokens
                localStorage.removeItem("authToken");
                localStorage.removeItem("token");
                localStorage.removeItem("adminToken");
                localStorage.removeItem("userRole");
                return null;
              }
            }
          }
        } catch (e) {
          console.error("Error checking token expiration:", e);
        }
      }
      
      return foundToken;
    }
    return null;
  };

  // Test connection to backend
  const testConnection = async () => {
    const token = getAuthToken();
    console.log("=== Testing Connection ===");
    console.log("Token:", token);
    console.log("API URL:", "https://school-bus-tracker-be.onrender.com/api/students");
    
    try {
      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/students",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );
      
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);
      
      const text = await response.text();
      console.log("Response Body:", text);
      
      return response;
    } catch (error) {
      console.error("Connection Error:", error);
      throw error;
    }
  };

  // Fetch students from backend
  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = getAuthToken();

      console.log("Fetching students with token:", token ? "Token exists" : "No token");

      if (!token) {
        setError("Authentication token not found. Please login again.");
        router.push("/login"); // Redirect to login if no token
        return;
      }

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/students",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          mode: "cors", // Enable CORS
          credentials: "include", // Include credentials if needed
        }
      );

      console.log("Response status:", response.status);

      if (response.status === 403) {
        setError("Access forbidden. You don't have permission to view students.");
        return;
      }

      if (response.status === 401) {
        setError("Session expired. Please login again.");
        localStorage.removeItem("authToken");
        localStorage.removeItem("token");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      
      // Handle the response structure: {success, message, data: [...]}
      const studentsData = data.data || data.students || (Array.isArray(data) ? data : []);
      console.log("Students count:", studentsData.length);
      console.log("First student sample:", studentsData[0]); // Log first student to see structure
      setStudents(studentsData);
    } catch (err) {
      console.error("Error fetching students:", err);
      
      // Check if it's a network error
      if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Network error. Please check your internet connection or the API server might be down.");
      } else {
        setError(err instanceof Error ? err.message : "Failed to fetch students");
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch students on component mount
  useEffect(() => {
    fetchStudents();
    fetchBusStops();
    fetchBuses();
  }, []);

  // Fetch bus stops
  const fetchBusStops = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/bus-stops",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const busStopsData = data.data || data.busStops || (Array.isArray(data) ? data : []);
        setBusStops(busStopsData);
        console.log("Bus stops loaded:", busStopsData);
      }
    } catch (error) {
      console.error("Error fetching bus stops:", error);
    }
  };

  // Fetch buses
  const fetchBuses = async () => {
    try {
      const token = getAuthToken();
      if (!token) return;

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/buses",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const busesData = data.data || data.buses || (Array.isArray(data) ? data : []);
        setBuses(busesData);
        console.log("Buses loaded:", busesData);
      }
    } catch (error) {
      console.error("Error fetching buses:", error);
    }
  };

  // Helper function to get bus stop name
  const getBusStopName = (busStop?: BusStop): string => {
    if (!busStop) return "";
    return busStop.stopName || "";
  };

  // Helper function to get bus name
  const getBusName = (assignedBus?: AssignedBus): string => {
    if (!assignedBus) return "";
    return assignedBus.busName || assignedBus.busNumber || "";
  };

  // Filter students based on search and stop selection
  const filteredStudents = students.filter((student) => {
    const busStopName = getBusStopName(student.busStop);
    const matchesSearch =
      (student.studentName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (student.parentName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      busStopName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStop =
      selectedStop === "All Stops" || busStopName === selectedStop;

    return matchesSearch && matchesStop;
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Get unique bus stops
  const uniqueBusStops = Array.from(
    new Set(students.map((student) => getBusStopName(student.busStop)).filter(Boolean))
  );

  // Change page with transition
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage + 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentPage(currentPage - 1);
        setIsTransitioning(false);
      }, 150);
    }
  };

  // Handle student selection
  const toggleStudentSelection = (studentId: number) => {
    const idString = studentId.toString();
    if (selectedStudents.includes(idString)) {
      setSelectedStudents(
        selectedStudents.filter((id) => id !== idString)
      );
    } else {
      setSelectedStudents([...selectedStudents, idString]);
    }
  };

  // Open modal
  const openAssignModal = () => {
    if (selectedStudents.length === 0) {
      alert("Please select at least one student");
      return;
    }
    setShowAssignModal(true);
  };

  // Close modal
  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedStudents([]);
    setSelectedBus("");
  };

  // Assign students to bus
  const handleAssignToBus = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      if (!selectedBus) {
        alert("Please select a bus to assign students to.");
        return;
      }

      // Convert selected student IDs to integers
      const studentIds = selectedStudents.map(id => parseInt(id));
      const busId = parseInt(selectedBus);

      console.log("=== ASSIGNING STUDENTS TO BUS ===");
      console.log("Student IDs:", studentIds);
      console.log("Bus ID:", busId);

      const requestBody = {
        busId: busId,
        studentIds: studentIds
      };

      console.log("Request body:", requestBody);

      // API call to assign students to bus using admin endpoint
      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/admin/assign-students-to-bus",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        let errorData;
        const contentType = response.headers.get("content-type");
        
        if (contentType && contentType.includes("application/json")) {
          errorData = await response.json();
        } else {
          const text = await response.text();
          errorData = { message: text || `HTTP ${response.status}` };
        }
        
        console.error("Error response:", errorData);
        throw new Error(errorData.message || "Failed to assign students to bus");
      }

      const data = await response.json();
      console.log("Success response:", data);

      alert(`Successfully assigned ${studentIds.length} student(s) to the bus!`);
      closeAssignModal();
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error assigning students:", error);
      alert(`Failed to assign students: ${error instanceof Error ? error.message : "Please try again."}`);
    }
  };

  // Open Add Student Modal
  const openAddStudentModal = () => {
    setShowAddStudentModal(true);
  };

  // Close Add Student Modal
  const closeAddStudentModal = () => {
    setShowAddStudentModal(false);
    setNewStudent({
      name: "",
      age: "",
      parentName: "",
      parentPhone: "",
      address: "",
      busStopId: "",
      assignedBusId: "",
    });
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setNewStudent({
      ...newStudent,
      [field]: value,
    });
  };

  // Add new student
  const handleAddStudent = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      // Validate required fields
      if (!newStudent.name || !newStudent.age) {
        alert("Please fill in at least the student name and age.");
        return;
      }

      const requestBody: any = {
        studentName: newStudent.name,
        age: parseInt(newStudent.age),
      };

      // Add optional fields if provided
      if (newStudent.parentName) requestBody.parentName = newStudent.parentName;
      if (newStudent.parentPhone) requestBody.parentPhone = newStudent.parentPhone;
      if (newStudent.address) requestBody.address = newStudent.address;
      if (newStudent.busStopId) requestBody.busStopId = parseInt(newStudent.busStopId);
      if (newStudent.assignedBusId) requestBody.assignedBusId = parseInt(newStudent.assignedBusId);

      console.log("=== ADD STUDENT REQUEST ===");
      console.log("Token (first 50 chars):", token.substring(0, 50) + "...");
      console.log("Token (last 50 chars):", "..." + token.substring(token.length - 50));
      console.log("Token length:", token.length);
      
      // Decode token to verify
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log("Token payload:", payload);
        console.log("  - User ID:", payload.userId || payload.id);
        console.log("  - Email:", payload.sub || payload.email);
        console.log("  - Role:", payload.role);
        console.log("  - Expires:", new Date(payload.exp * 1000));
      } catch (e) {
        console.error("Could not decode token:", e);
      }
      
      console.log("Request body:", requestBody);
      console.log("URL:", "https://school-bus-tracker-be.onrender.com/api/students");

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log("=== RESPONSE ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));

      // Try to read response body
      const responseText = await response.text();
      console.log("Response body (raw):", responseText);

      if (!response.ok) {
        let errorData;
        
        try {
          // Try to parse as JSON
          errorData = JSON.parse(responseText);
        } catch (e) {
          // If not JSON, use text
          errorData = { message: responseText || `HTTP ${response.status}: ${response.statusText}` };
        }
        
        console.error("=== ERROR DATA ===");
        console.error("Parsed error:", errorData);
        
        // Check for specific errors
        if (response.status === 403) {
          let errorMessage = "Access Forbidden.\n\n";
          
          if (errorData.message) {
            errorMessage += `Server says: ${errorData.message}\n\n`;
          }
          
          errorMessage += "Possible reasons:\n";
          errorMessage += "1. Your session has expired - Please login again\n";
          errorMessage += "2. You don't have permission to add students\n";
          errorMessage += "3. Invalid bus stop or bus ID\n";
          errorMessage += "4. School ID mismatch\n\n";
          errorMessage += "Check browser console for more details.";
          
          alert(errorMessage);
          return;
        }
        
        throw new Error(errorData.message || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse success response
      const data = JSON.parse(responseText);
      console.log("=== SUCCESS ===");
      console.log("Success response:", data);

      alert("Student added successfully!");
      closeAddStudentModal();
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("=== EXCEPTION ===");
      console.error("Error adding student:", error);
      console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
      alert(`Failed to add student: ${error instanceof Error ? error.message : "Please try again."}`);
    }
  };

  // Handle edit click
  const handleEditClick = (student: Student) => {
    setEditStudent({
      id: student.id.toString(),
      name: student.studentName,
      age: student.age.toString(),
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      address: student.address || "",
      busStop: getBusStopName(student.busStop),
      assignedBus: getBusName(student.assignedBus),
    });
    setShowEditModal(true);
  };

  // Close Edit Modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditStudent({
      id: "",
      name: "",
      age: "",
      parentName: "",
      parentPhone: "",
      address: "",
      busStop: "",
      assignedBus: "",
    });
  };

  // Handle edit input change
  const handleEditInputChange = (field: string, value: string) => {
    setEditStudent({
      ...editStudent,
      [field]: value,
    });
  };

  // Save edited student
  const handleSaveEdit = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      const response = await fetch(
        `https://school-bus-tracker-be.onrender.com/api/students/${editStudent.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            studentName: editStudent.name,
            age: parseInt(editStudent.age),
            parentName: editStudent.parentName,
            parentPhone: editStudent.parentPhone,
            address: editStudent.address,
            busStop: editStudent.busStop,
            assignedBus: editStudent.assignedBus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update student");
      }

      alert("Student updated successfully!");
      closeEditModal();
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error updating student:", error);
      alert("Failed to update student. Please try again.");
    }
  };

  // Handle delete click
  const handleDeleteClick = (student: Student) => {
    setStudentToDelete(student);
    setShowDeleteModal(true);
  };

  // Close delete modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setStudentToDelete(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const token = getAuthToken();

      if (!token) {
        alert("Authentication token not found. Please login again.");
        return;
      }

      if (!studentToDelete) return;

      const response = await fetch(
        `https://school-bus-tracker-be.onrender.com/api/students/${studentToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      alert("Student deleted successfully!");
      closeDeleteModal();
      fetchStudents(); // Refresh the list
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student. Please try again.");
    }
  };

  // Calculate bus statistics
  const getBusStatistics = () => {
    const stats: { [key: string]: number } = {};
    students.forEach((student) => {
      if (student.assignedBus) {
        const busName = getBusName(student.assignedBus);
        if (busName) {
          stats[busName] = (stats[busName] || 0) + 1;
        }
      }
    });
    return stats;
  };

  const busStats = getBusStatistics();

  // Loading state
  if (loading) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading students...</p>
          </div>
        </div>
        <AdminFooter />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto p-6">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={fetchStudents}
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Retry
            </button>
          </div>
        </div>
        <AdminFooter />
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-4 lg:p-8">
        <div className="max-w-full mx-auto px-2 md:px-4">
          <div className="flex flex-col lg:flex-row gap-3 mb-6 md:mb-8">
            <div className="flex-1">
              <div className="flex items-center border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="ml-4 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name, parent, or bus stop"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-4 py-3 text-gray-600 rounded-2xl focus:outline-none text-sm md:text-base"
                />
              </div>
            </div>

            <select
              value={selectedStop}
              onChange={(e) => setSelectedStop(e.target.value)}
              className="lg:w-40 px-4 py-3 border border-gray-300 text-gray-600 text-sm md:text-base rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option>All Stops</option>
              {uniqueBusStops.map((stop) => (
                <option key={stop} value={stop}>
                  {stop}
                </option>
              ))}
            </select>

            <button
              onClick={openAssignModal}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition text-sm md:text-base whitespace-nowrap"
            >
              <Bus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Assign to Bus</span>
            </button>

            <button
              onClick={openAddStudentModal}
              className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition text-sm md:text-base whitespace-nowrap"
            >
              <UserPlus className="w-4 h-4 md:w-5 md:h-5" />
              <span>Add Student</span>
            </button>
          </div>

          {/* Cards Section - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                Total Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                {students.length}
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                School Bus A Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                {busStats["School Bus A"] || 0}
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                School Bus B Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                {busStats["School Bus B"] || 0}
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                School Bus C Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                {busStats["School Bus C"] || 0}
              </div>
            </div>
          </div>

          {/* Students Table */}
          <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 ${
              isTransitioning
                ? "opacity-50 transform translate-x-2"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      <input
                        type="checkbox"
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedStudents(
                              currentStudents.map((s) => s.id.toString())
                            );
                          } else {
                            setSelectedStudents([]);
                          }
                        }}
                        checked={
                          selectedStudents.length === currentStudents.length &&
                          currentStudents.length > 0
                        }
                        className="w-4 h-4"
                      />
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      Student
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      Age
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      Parent
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      Bus Stop
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      Assigned Bus
                    </th>
                    <th className="text-left px-4 md:px-6 py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <input
                          type="checkbox"
                          checked={selectedStudents.includes(student.id.toString())}
                          onChange={() => toggleStudentSelection(student.id)}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="text-gray-900 text-sm md:text-base">
                          {student.studentName || "No name"}
                        </div>
                        <div className="text-gray-500 text-xs md:text-sm">
                          {student.address || "No address"}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700 text-sm md:text-base">
                        {student.age ? `${student.age} years` : "N/A"}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="text-gray-900 text-sm md:text-base">
                          {student.parentName || "N/A"}
                        </div>
                        <div className="text-gray-500 text-xs md:text-sm">
                          {student.parentPhone || "No phone"}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate">
                            {getBusStopName(student.busStop) || "No stop assigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2">
                          <Bus className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm md:text-base">
                            {getBusName(student.assignedBus) || "Not Assigned"}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2 md:gap-3">
                          <button
                            onClick={() => handleEditClick(student)}
                            className="text-blue-500 hover:text-blue-700 transition"
                          >
                            <SquarePen className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(student)}
                            className="text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5 md:w-4 md:h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
              <div className="text-xs md:text-sm text-gray-600">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, filteredStudents.length)} of{" "}
                {filteredStudents.length} students
              </div>

              <div className="flex items-center gap-1 md:gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                </button>

                {Array.from({ length: Math.min(totalPages, 5) }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 md:w-9 md:h-9 rounded-lg text-xs md:text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}

                <button
                  onClick={goToNextPage}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assign to Bus Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={closeAssignModal}
            />

            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-gray-100 p-2 rounded-2xl">
                  <Bus className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Assign Students to Bus
                </h2>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                  Selected Students ({selectedStudents.length})
                </label>
                <div className="border border-gray-300 rounded-2xl max-h-48 md:max-h-64 overflow-y-auto p-2">
                  {students
                    .filter((s) => selectedStudents.includes(s.id.toString()))
                    .map((student) => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-2 bg-gray-50 rounded mb-1"
                      >
                        <span className="text-sm md:text-base text-gray-700">
                          {student.studentName}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="mb-4 md:mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 md:mb-3">
                  Assign to Bus
                </label>
                <select
                  value={selectedBus}
                  onChange={(e) => setSelectedBus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-600"
                >
                  <option value="">Select a bus</option>
                  {buses.map((bus) => (
                    <option key={bus.id} value={bus.id}>
                      {bus.busName} ({bus.busNumber})
                    </option>
                  ))}
                </select>
              </div>

              <hr className="w-full border-t border-gray-300 my-4" />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAssignToBus}
                  disabled={!selectedBus}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Assign to Bus
                </button>

                <button
                  onClick={closeAssignModal}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={closeAddStudentModal}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-blue-100 p-2 rounded-2xl">
                  <UserPlus className="w-5 h-5 md:w-6 md:h-6 text-blue-500" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Add New Student
                </h2>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newStudent.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="number"
                    placeholder="8"
                    value={newStudent.age}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    placeholder="Jane Doe"
                    value={newStudent.parentName}
                    onChange={(e) =>
                      handleInputChange("parentName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={newStudent.parentPhone}
                    onChange={(e) =>
                      handleInputChange("parentPhone", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main Street"
                    value={newStudent.address}
                    onChange={(e) =>
                      handleInputChange("address", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus Stop
                  </label>
                  <select
                    value={newStudent.busStopId}
                    onChange={(e) =>
                      handleInputChange("busStopId", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select a bus stop</option>
                    {busStops.map((stop) => (
                      <option key={stop.id} value={stop.id}>
                        {stop.stopName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Bus
                  </label>
                  <select
                    value={newStudent.assignedBusId}
                    onChange={(e) =>
                      handleInputChange("assignedBusId", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select a bus</option>
                    {buses.map((bus) => (
                      <option key={bus.id} value={bus.id}>
                        {bus.busName} ({bus.busNumber})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className="w-full border-t border-gray-300 my-4" />

              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
                <button
                  onClick={handleAddStudent}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition font-medium text-sm md:text-base"
                >
                  Add Student
                </button>

                <button
                  onClick={closeAddStudentModal}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-300 transition font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={closeDeleteModal}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="bg-red-100 p-2 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Delete Student
                </h2>
              </div>

              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {studentToDelete?.studentName}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={confirmDelete}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition font-medium text-sm md:text-base"
                >
                  Delete
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="w-full sm:w-auto px-4 md:px-6 py-2.5 md:py-3 bg-white text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50 transition font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Student Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={closeEditModal}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-green-100 p-2 rounded-2xl">
                  <SquarePen className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Edit Student
                </h2>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    value={editStudent.name}
                    onChange={(e) =>
                      handleEditInputChange("name", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <input
                    type="text"
                    value={editStudent.age}
                    onChange={(e) =>
                      handleEditInputChange("age", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    value={editStudent.parentName}
                    onChange={(e) =>
                      handleEditInputChange("parentName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Phone
                  </label>
                  <input
                    type="tel"
                    value={editStudent.parentPhone}
                    onChange={(e) =>
                      handleEditInputChange("parentPhone", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={editStudent.address}
                    onChange={(e) =>
                      handleEditInputChange("address", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus Stop
                  </label>
                  <input
                    type="text"
                    value={editStudent.busStop}
                    onChange={(e) =>
                      handleEditInputChange("busStop", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Bus
                  </label>
                  <select
                    value={editStudent.assignedBus}
                    onChange={(e) =>
                      handleEditInputChange("assignedBus", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  >
                    <option value="">Select a bus</option>
                    <option value="Bus 01">Bus 01</option>
                    <option value="Bus 02">Bus 02</option>
                    <option value="Bus 03">Bus 03</option>
                  </select>
                </div>
              </div>

              <div className="w-full h-px bg-gray-300 my-4" />

              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition font-medium text-sm md:text-base"
                >
                  Save Changes
                </button>

                <button
                  onClick={closeEditModal}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-300 transition font-medium text-sm md:text-base"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminFooter />
    </>
  );
}