"use client";

import React, { useState } from "react";
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

export default function StudentBusDashboard() {
  const router = useRouter();

  // Sample student data
  const students = [
    {
      id: "1",
      name: "Emily Anderson",
      address: "123 Oak Street",
      age: "8 years",
      parent: "Sarah Anderson",
      phone: "+1 (555) 123-4567",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "2",
      name: "Carlos Martinez",
      address: "456 Elm Avenue",
      age: "9 years",
      parent: "Robert Martinez",
      phone: "+1 (555) 234-5678",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "3",
      name: "Sophie Lee",
      address: "789 Pine Road",
      age: "7 years",
      parent: "Jennifer Lee",
      phone: "+1 (555) 345-6789",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02",
    },
    // ... rest of your students data with IDs
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 9;

  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBus, setSelectedBus] = useState("");

  // Add Student Modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: "",
    age: "",
    parentName: "",
    parentPhone: "",
    address: "",
    busStop: "",
    assignedBus: "",
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);

  // Calculate total pages
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // Change page
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Handle student selection
  const toggleStudentSelection = (studentName: string) => {
    if (selectedStudents.includes(studentName)) {
      setSelectedStudents(
        selectedStudents.filter((name) => name !== studentName)
      );
    } else {
      setSelectedStudents([...selectedStudents, studentName]);
    }
  };

  // Open modal
  const openAssignModal = () => {
    setShowAssignModal(true);
  };

  // Close modal
  const closeAssignModal = () => {
    setShowAssignModal(false);
    setSelectedStudents([]);
    setSelectedBus("");
  };

  // Assign students to bus
  const handleAssignToBus = () => {
    console.log(
      "Assigning students:",
      selectedStudents,
      "to bus:",
      selectedBus
    );
    closeAssignModal();
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
      busStop: "",
      assignedBus: "",
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
  const handleAddStudent = () => {
    console.log("Adding new student:", newStudent);
    closeAddStudentModal();
  };

  // Handle edit click
  const handleEditClick = (studentId: string) => {
    router.push(`/admin/dashboard/students/${studentId}`);
  };

  // Handle delete click
  const handleDeleteClick = (student: any) => {
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
      // Replace with your actual API call
      // await fetch(`/api/students/${studentToDelete.id}`, {
      //   method: 'DELETE',
      // });
      
      console.log("Deleting student:", studentToDelete);
      
      // Here you would typically refresh the student list or remove from state
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-full mx-auto px-4">
          {/* Top Bar */}
          <div className="flex gap-4 mb-8">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search students by name, parent, or bus..."
                className="w-full pl-12 pr-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Dropdown */}
            <select className="px-4 py-3 border border-gray-300 text-gray-600 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Bus Stops</option>
              <option>Bus Stop 1</option>
              <option>Bus Stop 2</option>
              <option>Bus Stop 3</option>
            </select>

            {/* Assign to Bus Button */}
            <button
              onClick={openAssignModal}
              className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              <Bus className="w-5 h-5" />
              Assign to Bus
            </button>

            {/* Add Student Button */}
            <button
              onClick={openAddStudentModal}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <UserPlus className="w-5 h-5" />
              Add Student
            </button>
          </div>

          {/* Cards Section */}
          <div className="flex gap-6 w-full mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm flex-1 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
              <div className="text-gray-600 text-sm mb-2">Total Students</div>
              <div className="text-3xl font-semibold text-gray-900">25</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex-1 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
              <div className="text-gray-600 text-sm mb-2">Bus 01 Students</div>
              <div className="text-3xl font-semibold text-gray-900">5</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex-1 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
              <div className="text-gray-600 text-sm mb-2">Bus 02 Students</div>
              <div className="text-3xl font-semibold text-gray-900">4</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm flex-1 transition-all duration-300 ease-in-out hover:shadow-md hover:-translate-y-1">
              <div className="text-gray-600 text-sm mb-2">Bus 03 Students</div>
              <div className="text-3xl font-semibold text-gray-900">3</div>
            </div>
          </div>

          {/* Students Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Student
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Age
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Parent
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Bus Stop
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Assigned Bus
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentStudents.map((student, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="px-6 py-4">
                      <div className="text-gray-900 font-medium">
                        {student.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        {student.address}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{student.age}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{student.parent}</div>
                      <div className="text-gray-500 text-sm">
                        {student.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        {student.busStop}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-blue-600">
                        <Bus className="w-4 h-4" />
                        {student.assignedBus}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEditClick(student.id)}
                          className="text-blue-500 hover:text-blue-700 transition"
                        >
                          <SquarePen className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(student)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, students.length)} of{" "}
                {students.length} students
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={goToPreviousPage}
                  disabled={currentPage === 1}
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                {Array.from({ length: totalPages }, (_, index) => {
                  const page = index + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-9 h-9 rounded-lg text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
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
                  className="w-9 h-9 flex items-center justify-center border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Assign to Bus Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-6">
                <Bus className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Assign Students to Bus
                </h2>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Select Students
                </label>
                <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto p-2">
                  {students.map((student, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.name)}
                        onChange={() => toggleStudentSelection(student.name)}
                        className="w-4 h-4 text-purple-600 rounded"
                      />
                      <span className="text-gray-700">{student.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Assign to Bus
                </label>
                <select
                  value={selectedBus}
                  onChange={(e) => setSelectedBus(e.target.value)}
                  className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select a bus</option>
                  <option value="Bus 01">Bus 01</option>
                  <option value="Bus 02">Bus 02</option>
                  <option value="Bus 03">Bus 03</option>
                </select>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAssignToBus}
                  className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium"
                >
                  Assign to Bus
                </button>
                <button
                  onClick={closeAssignModal}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add New Student Modal */}
        {showAddStudentModal && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Add New Student
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={newStudent.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus Stop
                  </label>
                  <select
                    value={newStudent.busStop}
                    onChange={(e) =>
                      handleInputChange("busStop", e.target.value)
                    }
                    className="w-full px-4 py-3 text-gray-600 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a bus stop</option>
                    <option value="Oak Street Stop">Oak Street Stop</option>
                    <option value="Maple Avenue Stop">
                      Maple Avenue Stop
                    </option>
                    <option value="Pine Road Stop">Pine Road Stop</option>
                    <option value="Elm Street Stop">Elm Street Stop</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Bus
                  </label>
                  <select
                    value={newStudent.assignedBus}
                    onChange={(e) =>
                      handleInputChange("assignedBus", e.target.value)
                    }
                    className="w-full px-4 py-3 border text-gray-600 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a bus</option>
                    <option value="Bus 01">Bus 01</option>
                    <option value="Bus 02">Bus 02</option>
                    <option value="Bus 03">Bus 03</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleAddStudent}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  Add Student
                </button>
                <button
                  onClick={closeAddStudentModal}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-red-100 p-2 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Delete Student
                </h2>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-gray-900">
                  {studentToDelete?.name}
                </span>
                ? This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  Delete
                </button>
                <button
                  onClick={closeDeleteModal}
                  className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
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