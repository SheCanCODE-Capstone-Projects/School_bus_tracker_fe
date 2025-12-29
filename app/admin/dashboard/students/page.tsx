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
    {
      id: "4",
      name: "Michael Johnson",
      address: "321 Birch Lane",
      age: "10 years",
      parent: "David Johnson",
      phone: "+1 (555) 456-7890",
      busStop: "Birch Lane Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "5",
      name: "Isabella Garcia",
      address: "654 Cedar Drive",
      age: "6 years",
      parent: "Maria Garcia",
      phone: "+1 (555) 567-8901",
      busStop: "Cedar Drive Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "6",
      name: "Ethan Brown",
      address: "987 Willow Street",
      age: "11 years",
      parent: "Lisa Brown",
      phone: "+1 (555) 678-9012",
      busStop: "Willow Street Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "7",
      name: "Ava Wilson",
      address: "147 Spruce Avenue",
      age: "8 years",
      parent: "James Wilson",
      phone: "+1 (555) 789-0123",
      busStop: "Spruce Avenue Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "8",
      name: "Noah Davis",
      address: "258 Poplar Road",
      age: "9 years",
      parent: "Amanda Davis",
      phone: "+1 (555) 890-1234",
      busStop: "Poplar Road Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "9",
      name: "Olivia Miller",
      address: "369 Ash Boulevard",
      age: "7 years",
      parent: "Kevin Miller",
      phone: "+1 (555) 901-2345",
      busStop: "Ash Boulevard Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "10",
      name: "Liam Taylor",
      address: "741 Hickory Place",
      age: "10 years",
      parent: "Rachel Taylor",
      phone: "+1 (555) 012-3456",
      busStop: "Hickory Place Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "11",
      name: "Emma Thompson",
      address: "852 Magnolia Court",
      age: "6 years",
      parent: "Steven Thompson",
      phone: "+1 (555) 123-4567",
      busStop: "Magnolia Court Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "12",
      name: "William Clark",
      address: "963 Dogwood Lane",
      age: "11 years",
      parent: "Michelle Clark",
      phone: "+1 (555) 234-5678",
      busStop: "Dogwood Lane Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "13",
      name: "Charlotte Rodriguez",
      address: "159 Sycamore Street",
      age: "8 years",
      parent: "Carlos Rodriguez",
      phone: "+1 (555) 345-6789",
      busStop: "Sycamore Street Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "14",
      name: "Benjamin Lewis",
      address: "357 Chestnut Avenue",
      age: "9 years",
      parent: "Nicole Lewis",
      phone: "+1 (555) 456-7890",
      busStop: "Chestnut Avenue Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "15",
      name: "Amelia Walker",
      address: "468 Walnut Drive",
      age: "7 years",
      parent: "Brian Walker",
      phone: "+1 (555) 567-8901",
      busStop: "Walnut Drive Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "16",
      name: "Lucas Hall",
      address: "579 Pecan Road",
      age: "10 years",
      parent: "Jessica Hall",
      phone: "+1 (555) 678-9012",
      busStop: "Pecan Road Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "17",
      name: "Harper Allen",
      address: "680 Beech Boulevard",
      age: "6 years",
      parent: "Daniel Allen",
      phone: "+1 (555) 789-0123",
      busStop: "Beech Boulevard Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "18",
      name: "Mason Young",
      address: "791 Fir Place",
      age: "11 years",
      parent: "Stephanie Young",
      phone: "+1 (555) 890-1234",
      busStop: "Fir Place Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "19",
      name: "Evelyn King",
      address: "802 Redwood Court",
      age: "8 years",
      parent: "Matthew King",
      phone: "+1 (555) 901-2345",
      busStop: "Redwood Court Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "20",
      name: "Logan Wright",
      address: "913 Sequoia Lane",
      age: "9 years",
      parent: "Ashley Wright",
      phone: "+1 (555) 012-3456",
      busStop: "Sequoia Lane Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "21",
      name: "Abigail Lopez",
      address: "024 Cypress Street",
      age: "7 years",
      parent: "Christopher Lopez",
      phone: "+1 (555) 123-4567",
      busStop: "Cypress Street Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "22",
      name: "Jackson Hill",
      address: "135 Juniper Avenue",
      age: "10 years",
      parent: "Melissa Hill",
      phone: "+1 (555) 234-5678",
      busStop: "Juniper Avenue Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "23",
      name: "Ella Scott",
      address: "246 Palm Drive",
      age: "6 years",
      parent: "Joshua Scott",
      phone: "+1 (555) 345-6789",
      busStop: "Palm Drive Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "24",
      name: "Aiden Green",
      address: "357 Bamboo Road",
      age: "11 years",
      parent: "Sarah Green",
      phone: "+1 (555) 456-7890",
      busStop: "Bamboo Road Stop",
      assignedBus: "Bus 02",
    },
    {
      id: "25",
      name: "Scarlett Adams",
      address: "468 Eucalyptus Boulevard",
      age: "8 years",
      parent: "Ryan Adams",
      phone: "+1 (555) 567-8901",
      busStop: "Eucalyptus Boulevard Stop",
      assignedBus: "Bus 03",
    },
    {
      id: "26",
      name: "Carter Baker",
      address: "579 Olive Place",
      age: "9 years",
      parent: "Jennifer Baker",
      phone: "+1 (555) 678-9012",
      busStop: "Olive Place Stop",
      assignedBus: "Bus 01",
    },
    {
      id: "27",
      name: "Grace Gonzalez",
      address: "680 Laurel Court",
      age: "7 years",
      parent: "Michael Gonzalez",
      phone: "+1 (555) 789-0123",
      busStop: "Laurel Court Stop",
      assignedBus: "Bus 02",
    },
  ];

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
    busStop: "",
    assignedBus: "",
  });

  // Delete confirmation modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);

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

  // Calculate total pages
  const totalPages = Math.ceil(students.length / studentsPerPage);

  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(
    indexOfFirstStudent,
    indexOfLastStudent
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
  const handleEditClick = (student: any) => {
    setEditStudent({
      id: student.id,
      name: student.name,
      age: student.age,
      parentName: student.parent,
      parentPhone: student.phone,
      address: student.address,
      busStop: student.busStop,
      assignedBus: student.assignedBus,
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
  const handleSaveEdit = () => {
    console.log("Saving edited student:", editStudent);
    closeEditModal();
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
      console.log("Deleting student:", studentToDelete);
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting student:", error);
    }
  };

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-4 lg:p-8">
        <div className="max-w-full   mx-auto px-2 md:px-4">
          <div className="flex flex-col lg:flex-row gap-3 mb-6 md:mb-8">
            <div className="flex-1">
              <div className="flex items-center border border-gray-300 rounded-2xl focus-within:ring-2 focus-within:ring-blue-500">
                <Search className="ml-4 text-gray-500 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search students by name, parent, or bus stop"
                  className="w-full pl-3 pr-4 py-3 text-gray-600 rounded-2xl focus:outline-none text-sm md:text-base"
                />
              </div>
            </div>

            <select className="lg:w-40 px-4 py-3 border border-gray-300 text-gray-600 text-sm md:text-base rounded-2xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Stops</option>
              <option>Stop 1</option>
              <option>Stop 2</option>
              <option>Stop 3</option>
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

          {/* Cards Section - Responsive Grid: 1 column on mobile, 2 on tablet, 4 on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300  hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                Total Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                25
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300  hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                Bus 01 Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                5
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300  hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                Bus 02 Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                4
              </div>
            </div>
            <div className="bg-white p-4 md:p-6 rounded-2xl shadow-lg transition-all duration-300  hover:shadow-xl hover:-translate-y-2 cursor-pointer">
              <div className="text-gray-600 text-xs md:text-sm mb-1 md:mb-2">
                Bus 03 Students
              </div>
              <div className="text-2xl md:text-3xl font-semibold text-gray-900">
                3
              </div>
            </div>
          </div>

          {/* Students Table - Horizontal Scroll on Small Screens */}
          <div
            className={`bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 transition-all duration-300 ${
              isTransitioning
                ? "opacity-50 transform translate-x-2"
                : "opacity-100 transform translate-x-0"
            }`}
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">
                <thead className="bg-gray-50 border-b  border-gray-200">
                  <tr>
                    <th className="text-left px-4 md:px-6  py-3 md:py-4 text-xs md:text-sm font-bold text-gray-600">
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
                  {currentStudents.map((student, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="text-gray-900  text-sm md:text-base">
                          {student.name}
                        </div>
                        <div className="text-gray-500 text-xs md:text-sm">
                          {student.address}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4 text-gray-700 text-sm md:text-base">
                        {student.age}
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="text-gray-900 text-sm md:text-base">
                          {student.parent}
                        </div>
                        <div className="text-gray-500 text-xs md:text-sm">
                          {student.phone}
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2 text-gray-700 text-sm md:text-base">
                          <MapPin className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{student.busStop}</span>
                        </div>
                      </td>
                      <td className="px-4 md:px-6 py-3 md:py-4">
                        <div className="flex items-center gap-2">
                          <Bus className="w-3 h-3 md:w-4 md:h-4 text-blue-500 flex-shrink-0" />
                          <span className="text-gray-600 text-sm md:text-base">
                            {student.assignedBus}
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

            {/* Pagination - Responsive */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 md:px-6 py-3 md:py-4 border-t border-gray-200">
              <div className="text-xs md:text-sm text-gray-600">
                Showing {indexOfFirstStudent + 1} to{" "}
                {Math.min(indexOfLastStudent, students.length)} of{" "}
                {students.length} students
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

        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-gray-700/40 backdrop-blur-md"
              onClick={closeAssignModal}
            />

            {/* Modal */}
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
                  Select Students
                </label>
                <div className="border border-gray-300 rounded-2xl max-h-48 md:max-h-64 overflow-y-auto p-2">
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
                      <span className="text-sm md:text-base text-gray-700">
                        {student.name}
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
                  <option value="Bus 01">Bus 01</option>
                  <option value="Bus 02">Bus 02</option>
                  <option value="Bus 03">Bus 03</option>
                </select>
              </div>

              <hr className="w-full border-t  border-gray-300 my-4" />

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleAssignToBus}
                  className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-purple-600 text-white rounded-2xl hover:bg-purple-700 transition font-medium"
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

        {/* Add New Student Modal - Responsive */}
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
                    value={newStudent.busStop}
                    onChange={(e) =>
                      handleInputChange("busStop", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select a bus stop</option>
                    <option value="Oak Street Stop">Oak Street Stop</option>
                    <option value="Maple Avenue Stop">Maple Avenue Stop</option>
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
                    className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  >
                    <option value="">Select a bus</option>
                    <option value="Bus 01">Bus 01</option>
                    <option value="Bus 02">Bus 02</option>
                    <option value="Bus 03">Bus 03</option>
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

        {/* Delete Confirmation Modal - Responsive */}
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
                  {studentToDelete?.name}
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

        {/* Edit Student Modal - Responsive */}
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
                  <select
                    value={editStudent.busStop}
                    onChange={(e) =>
                      handleEditInputChange("busStop", e.target.value)
                    }
                    className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base"
                  >
                    <option
                      value=""
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Select a bus stop
                    </option>
                    <option
                      value="Oak Street Stop"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Oak Street Stop
                    </option>
                    <option
                      value="Maple Avenue Stop"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Maple Avenue Stop
                    </option>
                    <option
                      value="Pine Road Stop"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Pine Road Stop
                    </option>
                    <option
                      value="Elm Street Stop"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Elm Street Stop
                    </option>
                  </select>
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
                    <option
                      value=""
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Select a bus
                    </option>
                    <option
                      value="Bus 01"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Bus 01
                    </option>
                    <option
                      value="Bus 02"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Bus 02
                    </option>
                    <option
                      value="Bus 03"
                      className="text-xs sm:text-sm md:text-base truncate"
                    >
                      Bus 03
                    </option>
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
