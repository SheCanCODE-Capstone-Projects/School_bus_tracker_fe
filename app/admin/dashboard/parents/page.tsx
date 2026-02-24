"use client";
import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Mail,
  Phone,
  Users,
  Bus,
  SquarePen,
  Trash2,
  X,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import AdminNavbar from "@/components/navigation/AdminNavbar";
import AdminFooter from "@/components/navigation/AdminFooter";
import { getAuthToken, getUserRole } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface BusStop {
  id: number;
  stopName: string;
  address: string;
}

interface BusStopOption {
  id: number;
  name: string;
  address: string;
}

interface AssignedBus {
  id: number;
  busName: string;
  busNumber: string;
}

interface Student {
  id: number;
  studentName: string;
  age: number;
  parentName: string;
  parentPhone: string;
  address: string;
  busStop: BusStop;
  assignedBus: AssignedBus;
  school_id: number;
}

interface ParentData {
  parentId: number;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  schoolId: number;
  schoolName: string;
  students: Student[];
}

interface ApiResponse {
  success: boolean;
  message: string;
  data: ParentData[];
}

export default function ParentsPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Notification states
  const [apiSuccess, setApiSuccess] = useState("");
  const [apiError, setApiError] = useState("");

  // Bus stops state
  const [busStops, setBusStops] = useState<BusStopOption[]>([]);
  const [loadingBusStops, setLoadingBusStops] = useState(false);

  // Form states
  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [homeAddress, setHomeAddress] = useState("");
  const [schoolId, setSchoolId] = useState(1);
  const [children, setChildren] = useState([
    { id: 1, fullName: "", age: "", gender: "Not Specified", busStopId: "" },
  ]);

  const [editParent, setEditParent] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    childName: "",
    assignedBus: "",
  });

  const [parents, setParents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch bus stops
  const fetchBusStops = async () => {
    try {
      setLoadingBusStops(true);
      const token = getAuthToken();
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/bus-stops",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch bus stops");
      }

      const result = await response.json();
      
      if (result.success && Array.isArray(result.data)) {
        setBusStops(result.data);
      } else if (Array.isArray(result)) {
        setBusStops(result);
      } else {
        console.warn("Unexpected bus stops data format:", result);
        setBusStops([]);
      }
    } catch (err) {
      console.error("Error fetching bus stops:", err);
      setBusStops([
        { id: 1, name: "Oak Street Stop", address: "Oak Street" },
        { id: 2, name: "Maple Avenue Stop", address: "Maple Avenue" },
        { id: 3, name: "Pine Road Stop", address: "Pine Road" },
        { id: 4, name: "Elm Street Stop", address: "Elm Street" },
      ]);
    } finally {
      setLoadingBusStops(false);
    }
  };

  // Check authorization
  useEffect(() => {
    const token = getAuthToken();
    const userRole = getUserRole();

    if (!token || userRole !== "admin") {
      router.push("/login");
      return;
    }

    setIsAuthorized(true);
  }, [router]);

  // Fetch parents data - UPDATED to use correct endpoint
  const fetchParents = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      console.log("Fetching parents from /api/admin/parents");

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/admin/parents",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        }
      );

      console.log("Response status:", response.status);

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("Access forbidden. Please check your admin permissions.");
        } else if (response.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }
        throw new Error(`Failed to fetch parents: ${response.status}`);
      }

      const result: ApiResponse = await response.json();
      console.log("API Response:", result);

      // Transform the API data according to the documentation
      let transformedParents = [];

      if (result.success && Array.isArray(result.data)) {
        console.log("Processing result.data array, length:", result.data.length);

        transformedParents = result.data
          .map((parentData: ParentData) => {
            if (!parentData || !Array.isArray(parentData.students)) {
              console.log("Skipping parent data without students:", parentData);
              return null;
            }

            try {
              // Get all children names
              const childrenNames = parentData.students
                .map((s) => s?.studentName)
                .filter((name) => name && name.trim() !== "")
                .join(", ");

              // Get unique bus numbers from all children
              const buses = [
                ...new Set(
                  parentData.students
                    .map((s) => s?.assignedBus?.busNumber)
                    .filter((bus) => bus && bus.trim() !== "")
                ),
              ].join(", ");

              // Get address from first student or use parent's address
              const firstStudent = parentData.students[0];
              const address = firstStudent?.address || "No address";

              console.log("Parent:", parentData.parentName, "Children:", childrenNames);

              return {
                id: parentData.parentId,
                name: parentData.parentName || "Unknown Parent",
                address: address,
                email: parentData.parentEmail || "No email",
                phone: parentData.parentPhone || "No phone",
                childName: childrenNames || "No children",
                assignedBus: buses || "No bus assigned",
                childrenCount: parentData.students.length,
              };
            } catch (err) {
              console.error("Error transforming parent:", parentData, err);
              return null;
            }
          })
          .filter(Boolean);
      }

      console.log("Transformed parents:", transformedParents);
      console.log("Number of parents:", transformedParents.length);
      setParents(transformedParents);
      setError("");
    } catch (err: any) {
      setError(err.message);
      console.error("Error fetching parents:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    fetchParents();
  }, [isAuthorized]);

  // Fetch bus stops when modal opens
  useEffect(() => {
    if (showAddParentModal && isAuthorized) {
      fetchBusStops();
    }
  }, [showAddParentModal, isAuthorized]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const parentsPerPage = 9;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Count parents by bus
  const totalParents = parents.length;
  const bus01Parents = parents.filter((p) =>
    p.assignedBus?.includes("Bus 01"),
  ).length;
  const bus02Parents = parents.filter((p) =>
    p.assignedBus?.includes("Bus 02"),
  ).length;
  const bus03Parents = parents.filter((p) =>
    p.assignedBus?.includes("Bus 03"),
  ).length;

  // Filter parents based on search
  const filteredParents = parents.filter((parent) => {
    const query = searchQuery.toLowerCase();
    return (
      parent.name.toLowerCase().includes(query) ||
      parent.childName.toLowerCase().includes(query) ||
      parent.assignedBus.toLowerCase().includes(query)
    );
  });

  // Calculate total pages
  const totalPages = Math.ceil(filteredParents.length / parentsPerPage);

  // Get current parents
  const indexOfLastParent = currentPage * parentsPerPage;
  const indexOfFirstParent = indexOfLastParent - parentsPerPage;
  const currentParents = filteredParents.slice(
    indexOfFirstParent,
    indexOfLastParent,
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

  const handleAddChild = () => {
    setChildren([
      ...children,
      { 
        id: children.length + 1, 
        fullName: "", 
        age: "", 
        gender: "Not Specified", 
        busStopId: "" 
      },
    ]);
  };

  const handleRemoveChild = (id: number) => {
    if (children.length > 1)
      setChildren(children.filter((child) => child.id !== id));
  };

  const handleChildChange = (id: number, field: string, value: string) => {
    setChildren(
      children.map((child) =>
        child.id === id ? { ...child, [field]: value } : child,
      ),
    );
  };

  const handleSubmitParent = async () => {
    try {
      // Clear previous notifications
      setApiError("");
      setApiSuccess("");

      // Validate required fields
      if (!parentName || !email || !phone || !homeAddress) {
        setApiError("Please fill in all parent information fields");
        return;
      }

      // Validate at least one child
      const hasValidChild = children.some(
        (child) => child.fullName && child.age && child.busStopId
      );
      
      if (!hasValidChild) {
        setApiError("Please add at least one child with complete information (name, age, and bus stop)");
        return;
      }

      setIsSubmitting(true);

      const token = getAuthToken();

      // Clean the token (remove "Bearer " if already included)
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      // Prepare the data according to the API specification for /api/admin/add-parent
      const parentData = {
        schoolId: schoolId,
        name: parentName,
        email: email,
        password: "DefaultPass123!",
        phone: phone,
        homeAddress: homeAddress,
        children: children.map((child) => ({
          fullName: child.fullName,
          studentNumber: `STU${Date.now()}${child.id}`,
          age: parseInt(child.age) || 0,
          gender: child.gender || "Not Specified",
          busStopId: parseInt(child.busStopId) || 0,
        })),
      };

      console.log("Submitting parent data to /api/admin/add-parent:", parentData);

      const response = await fetch(
        "https://school-bus-tracker-be.onrender.com/api/admin/add-parent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
          body: JSON.stringify(parentData),
        }
      );

      // Better error handling
      let responseData;
      let errorMessage = '';
      
      if (!response.ok) {
        try {
          const responseClone = response.clone();
          const errorText = await responseClone.text();
          
          try {
            responseData = JSON.parse(errorText);
            errorMessage = responseData.message || responseData.error || `Error ${response.status}: ${response.statusText}`;
          } catch {
            errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
          }
        } catch (e) {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        
        throw new Error(errorMessage);
      }

      // Success handling
      responseData = await response.json();
      console.log("Parent added successfully:", responseData);

      // Wait a moment for the backend to process
      await new Promise(resolve => setTimeout(resolve, 1000));
      await fetchParents();

      setApiSuccess("Parent added successfully!");

      // Reset form and close modal after 2 seconds
      setTimeout(() => {
        setShowAddParentModal(false);
        setParentName("");
        setEmail("");
        setPhone("");
        setHomeAddress("");
        setSchoolId(1);
        setChildren([{ id: 1, fullName: "", age: "", gender: "Not Specified", busStopId: "" }]);
        setApiSuccess("");
      }, 2000);

    } catch (err: any) {
      console.error("Error adding parent:", err);
      
      if (err.message.includes("403") || err.message.includes("Forbidden")) {
        setApiError("Access denied. You need admin privileges to add parents.");
      } else if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        setApiError("Your session has expired. Please log in again.");
      } else if (err.message.includes("already exists")) {
        setApiError("A parent with this email already exists.");
      } else {
        setApiError(err.message || "Failed to add parent. Please try again.");
      }
    } finally {
      setIsSubmitting(false);

      // Reset form and close modal
      setShowAddParentModal(false);
      setParentName("");
      setEmail("");
      setPhone("");
      setHomeAddress("");
      setChildren([{ id: 1, fullName: "", age: "", gender: "Not Specified", busStopId: "" }]);
    }
  };

  const handleEdit = (parent: any) => {
    setEditParent({
      id: parent.id,
      name: parent.name,
      email: parent.email,
      phone: parent.phone,
      address: parent.address,
      childName: parent.childName,
      assignedBus: parent.assignedBus,
    });
    setShowEditModal(true);
  };

  const handleEditInputChange = (field: string, value: string) => {
    setEditParent({ ...editParent, [field]: value });
  };

  // UPDATED: handleSaveEdit function with correct endpoint and better error handling
  const handleSaveEdit = async () => {
    try {
      setApiError("");
      setApiSuccess("");

      const token = getAuthToken();
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      // Prepare the data according to API specification
      const updateData = {
        name: editParent.name,
        email: editParent.email,
        phone: editParent.phone,
        homeAddress: editParent.address,
        parentName: editParent.name,
        parentEmail: editParent.email,
        parentPhone: editParent.phone,
      };

      console.log("Updating parent:", editParent.id, updateData);

      const response = await fetch(
        `https://school-bus-tracker-be.onrender.com/api/admin/parents/${editParent.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
          body: JSON.stringify(updateData),
        }
      );

      console.log("Update response status:", response.status);

      // Try to get the response body even if it's not OK
      const responseText = await response.text();
      console.log("Update response body:", responseText);

      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : null;
      } catch (e) {
        console.log("Response is not JSON:", responseText);
      }

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("You don't have permission to update this parent.");
        } else if (response.status === 404) {
          throw new Error("Parent not found. It may have been deleted.");
        } else if (response.status === 400) {
          throw new Error(responseData?.message || "Invalid data provided.");
        } else {
          throw new Error(responseData?.message || `Failed to update parent (${response.status})`);
        }
      }

      console.log("Parent updated successfully:", responseData);

      await fetchParents();

      setApiSuccess("Parent updated successfully!");

      // Close modal after 2 seconds
      setTimeout(() => {
        setShowEditModal(false);
        setEditParent({
          id: "",
          name: "",
          email: "",
          phone: "",
          address: "",
          childName: "",
          assignedBus: "",
        });
        setApiSuccess("");
      }, 2000);

    } catch (err: unknown) {
      console.error("Error updating parent:", err);
      setApiError(err instanceof Error ? err.message : "Failed to update parent. Please try again.");
      setShowEditModal(false);
    }
  };

  const handleDeleteClick = (parent: any) => {
    setParentToDelete(parent);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setApiError("");
      setApiSuccess("");

      const token = getAuthToken();
      const cleanToken = token.replace(/^Bearer\s+/i, '');

      console.log("Deleting parent:", parentToDelete.id);

      const response = await fetch(
        `https://school-bus-tracker-be.onrender.com/api/admin/parents/${parentToDelete.id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${cleanToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Delete failed:', response.status, errorText);
        throw new Error(`Failed to delete parent: ${response.status}`);
      }

      const result = await response.json();
      console.log("Parent deleted successfully:", result);

      await fetchParents();

      setApiSuccess("Parent deleted successfully!");

      setTimeout(() => {
        setShowDeleteModal(false);
        setParentToDelete(null);
        setApiSuccess("");
      }, 2000);

    } catch (err: unknown) {
      console.error("Error deleting parent:", err);
      setApiError(err instanceof Error ? err.message : "Error deleting parent");
      setShowDeleteModal(false);
      setParentToDelete(null);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Verifying access...</span>
      </div>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-4 lg:p-8">
        <div className="max-w-full mx-auto px-2 md:px-4">
          {/* Header with Search and Add Button */}
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="flex-1">
              <div className="flex items-center border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="ml-4 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search parents by name, child, or bus..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-3 pr-4 py-3 text-gray-600 rounded-2xl focus:outline-none"
                />
              </div>
            </div>

            {/* Buttons - Stack vertically on mobile, horizontal on larger screens */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <button
                onClick={() => {
                  setApiError("");
                  setApiSuccess("");
                  setShowAddParentModal(true);
                }}
                className="flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-blue-400 text-white rounded-2xl hover:bg-blue-500 transition w-full sm:w-auto"
              >
                <Plus className="w-5 h-5" />
                <span>Add Parent</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-3 sm:p-4 md:p-6 border border-blue-200 rounded-2xl sm:rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <div className="text-gray-600 text-xs sm:text-sm md:text-sm mb-1 md:mb-2 truncate">
                Total Parents
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                {totalParents}
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 md:p-6 border border-green-200 rounded-2xl sm:rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <div className="text-gray-600 text-xs sm:text-sm md:text-sm mb-1 md:mb-2 truncate">
                Bus 01 Parents
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                {bus01Parents}
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 md:p-6 border border-amber-200 rounded-2xl sm:rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <div className="text-gray-600 text-xs sm:text-sm md:text-sm mb-1 md:mb-2 truncate">
                Bus 02 Parents
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                {bus02Parents}
              </div>
            </div>
            <div className="bg-white p-3 sm:p-4 md:p-6 border border-purple-200 rounded-2xl sm:rounded-2xl shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1">
              <div className="text-gray-600 text-xs sm:text-sm md:text-sm mb-1 md:mb-2 truncate">
                Bus 03 Parents
              </div>
              <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-900">
                {bus03Parents}
              </div>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2 text-gray-600">Loading parents...</span>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
              <p className="text-red-600 text-sm font-medium">Error: {error}</p>
              <p className="text-red-500 text-xs mt-1">
                Please check the console for more details or try logging in
                again.
              </p>
            </div>
          )}

          {/* Parents Table */}
          {!loading && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
              {/* Mobile/Tablet Scrollable Table */}
              <div className="lg:hidden overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Mobile Table Header */}
                  <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                    <div className="col-span-2">Parent</div>
                    <div className="col-span-3">Contact</div>
                    <div className="col-span-3">Children</div>
                    <div className="col-span-2">Assigned Bus</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {/* Mobile Table Body */}
                  <div
                    className={`divide-y divide-gray-200 transition-all duration-300 ${
                      isTransitioning
                        ? "opacity-50 transform translate-x-2"
                        : "opacity-100 transform translate-x-0"
                    }`}
                  >
                    {currentParents.map((parent) => (
                      <div
                        key={parent.id}
                        className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition"
                      >
                        {/* Parent Info */}
                        <div className="col-span-2">
                          <div className="text-gray-900 text-sm font-medium">
                            {parent.name}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {parent.address}
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="col-span-3 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{parent.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{parent.phone}</span>
                          </div>
                        </div>

                        {/* Child Info */}
                        <div className="col-span-3">
                          <div className="flex items-start gap-2 text-xs text-gray-600">
                            <Users className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span className="break-words">
                              {parent.childName}
                            </span>
                          </div>
                        </div>

                        {/* Assigned Bus */}
                        <div className="col-span-2">
                          <div className="flex items-center gap-2">
                            <Bus className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            <span className="text-gray-700 text-xs">
                              {parent.assignedBus}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center gap-1">
                          <button
                            onClick={() => handleEdit(parent)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                          >
                            <SquarePen className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(parent)}
                            className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-hidden">
                {/* Desktop Table Header */}
                <div className="grid grid-cols-12 gap-29 px-4 md:px-6 py-3 md:py-4 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                  <div className="col-span-2">Parent</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-3">Children</div>
                  <div className="col-span-2">Assigned Bus</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {/* Desktop Table Body */}
                <div
                  className={`divide-y divide-gray-200 transition-all duration-300 ${
                    isTransitioning
                      ? "opacity-50 transform translate-x-2"
                      : "opacity-100 transform translate-x-0"
                  }`}
                >
                  {currentParents.map((parent) => (
                    <div
                      key={parent.id}
                      className="grid grid-cols-12 gap-29 px-4 md:px-6 py-3 md:py-4 hover:bg-gray-50 transition"
                    >
                      {/* Parent Info */}
                      <div className="col-span-2">
                        <div className="text-gray-900">{parent.name}</div>
                        <div className="text-sm text-gray-500">
                          {parent.address}
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="col-span-3 space-y-1">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-blue-500" />
                          {parent.email}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4 text-blue-500" />
                          {parent.phone}
                        </div>
                      </div>

                      {/* Child Info */}
                      <div className="col-span-3 space-y-1">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <Users className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                          <span className="break-words">
                            {parent.childName}
                          </span>
                        </div>
                      </div>

                      {/* Assigned Bus */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-2">
                          <Bus className="w-4 h-4 text-blue-500" />
                          <span className="text-gray-700">
                            {parent.assignedBus}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-2 flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(parent)}
                          className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(parent)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pagination */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
                <div className="text-xs md:text-sm text-gray-600">
                  Showing {indexOfFirstParent + 1} to{" "}
                  {Math.min(indexOfLastParent, filteredParents.length)} of{" "}
                  {filteredParents.length} parents
                </div>

                <div className="flex items-center gap-1 md:gap-2">
                  <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="w-8 h-8 md:w-9 md:h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                  </button>

                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, index) => {
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
                    },
                  )}

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
          )}

          {/* No Results Message */}
          {!loading && !error && filteredParents.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No parents found matching your search.
            </div>
          )}
        </div>

        {/* Add Parent Modal */}
        {showAddParentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={() => {
                if (!isSubmitting) {
                  setShowAddParentModal(false);
                  setApiError("");
                  setApiSuccess("");
                }
              }}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-blue-100 p-2 rounded-2xl">
                    <Users className="w-6 h-6 text-blue-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Add New Parent
                  </h2>
                </div>

                {/* Success/Error Messages */}
                {apiSuccess && (
                  <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    {apiSuccess}
                  </div>
                )}
                
                {apiError && (
                  <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    {apiError}
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Parent Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Parent Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        value={parentName}
                        onChange={(e) => setParentName(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        placeholder="john.doe@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Home Address
                      </label>
                      <input
                        type="text"
                        placeholder="123 Main Street"
                        value={homeAddress}
                        onChange={(e) => setHomeAddress(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        disabled={isSubmitting}
                      />
                    </div>
                    {/* Optional: Add school selection if needed */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        School ID
                      </label>
                      <input
                        type="number"
                        placeholder="1"
                        value={schoolId}
                        onChange={(e) => setSchoolId(parseInt(e.target.value) || 1)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                        disabled={isSubmitting}
                      />
                      <p className="text-xs text-gray-500 mt-1">Default: 1 (you may need to adjust based on your school)</p>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Children Information
                    </h3>
                    <button
                      onClick={handleAddChild}
                      disabled={isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-2xl shadow-sm hover:shadow-md hover:bg-blue-200 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      Add Child
                    </button>
                  </div>
                  <div className="space-y-4">
                    {children.map((child, index) => (
                      <div
                        key={child.id}
                        className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-semibold text-gray-700">
                            Child {index + 1}
                          </h4>
                          {children.length > 1 && (
                            <button
                              onClick={() => handleRemoveChild(child.id)}
                              disabled={isSubmitting}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition disabled:opacity-50"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Child s Full Name
                            </label>
                            <input
                              type="text"
                              placeholder="Jane Doe"
                              value={child.fullName}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "fullName",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Age
                            </label>
                            <input
                              type="number"
                              placeholder="8"
                              value={child.age}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "age",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                              disabled={isSubmitting}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Gender
                            </label>
                            <select
                              value={child.gender}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "gender",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                              disabled={isSubmitting}
                            >
                              <option value="Not Specified">Not Specified</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Bus Stop
                            </label>
                            <select
                              value={child.busStopId}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "busStopId",
                                  e.target.value,
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                              disabled={isSubmitting || loadingBusStops}
                            >
                              <option value="">Select a bus stop</option>
                              {loadingBusStops ? (
                                <option value="" disabled>Loading bus stops...</option>
                              ) : (
                                busStops.map((stop) => (
                                  <option key={stop.id} value={stop.id}>
                                    {stop.name} {stop.address ? `- ${stop.address}` : ''}
                                  </option>
                                ))
                              )}
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-gray-300 my-4" />

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSubmitParent}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Adding...</span>
                      </>
                    ) : (
                      "Add Parent"
                    )}
                  </button>
                  <button
                    onClick={() => {
                      if (!isSubmitting) {
                        setShowAddParentModal(false);
                        setApiError("");
                        setApiSuccess("");
                      }
                    }}
                    disabled={isSubmitting}
                    className="w-full sm:flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Parent Modal */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={() => {
                setShowEditModal(false);
                setApiError("");
                setApiSuccess("");
              }}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-green-100 p-2 rounded-2xl">
                  <SquarePen className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Edit Parent
                </h2>
              </div>

              {/* Success/Error Messages */}
              {apiSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {apiSuccess}
                </div>
              )}
              
              {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {apiError}
                </div>
              )}

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Parent Name
                  </label>
                  <input
                    type="text"
                    value={editParent.name}
                    onChange={(e) =>
                      handleEditInputChange("name", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editParent.email}
                    onChange={(e) =>
                      handleEditInputChange("email", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editParent.phone}
                    onChange={(e) =>
                      handleEditInputChange("phone", e.target.value)
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
                    value={editParent.address}
                    onChange={(e) =>
                      handleEditInputChange("address", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Child Name
                  </label>
                  <input
                    type="text"
                    value={editParent.childName}
                    onChange={(e) =>
                      handleEditInputChange("childName", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assigned Bus
                  </label>
                  <select
                    value={editParent.assignedBus}
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

              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition font-medium text-sm md:text-base"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setApiError("");
                    setApiSuccess("");
                  }}
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
              onClick={() => {
                setShowDeleteModal(false);
                setApiError("");
                setApiSuccess("");
              }}
            />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="bg-red-100 p-2 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                  Delete Parent
                </h2>
              </div>

              {/* Success/Error Messages */}
              {apiSuccess && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                  {apiSuccess}
                </div>
              )}
              
              {apiError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {apiError}
                </div>
              )}

              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {parentToDelete?.name}
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
                  onClick={() => {
                    setShowDeleteModal(false);
                    setApiError("");
                    setApiSuccess("");
                  }}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-white text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50 transition font-medium text-sm md:text-base"
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