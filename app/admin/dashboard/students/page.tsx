'use client';

import React, { useState } from 'react';
import { Search, Bus, UserPlus, MapPin, Edit2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudentBusDashboard() {
  // Sample student data
  const students = [
    {
      name: "Emily Anderson",
      address: "123 Oak Street",
      age: "8 years",
      parent: "Sarah Anderson",
      phone: "+1 (555) 123-4567",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Carlos Martinez",
      address: "456 Elm Avenue",
      age: "9 years",
      parent: "Robert Martinez",
      phone: "+1 (555) 234-5678",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Sophie Lee",
      address: "789 Pine Road",
      age: "7 years",
      parent: "Jennifer Lee",
      phone: "+1 (555) 345-6789",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Alex Thompson",
      address: "321 Maple Drive",
      age: "10 years",
      parent: "Michael Thompson",
      phone: "+1 (555) 456-7890",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Maria Garcia",
      address: "654 Birch Lane",
      age: "8 years",
      parent: "Lisa Garcia",
      phone: "+1 (555) 567-8901",
      busStop: "Pine Road Stop",
      assignedBus: "Bus 03"
    },
    {
      name: "James Wilson",
      address: "987 Cedar Court",
      age: "9 years",
      parent: "David Wilson",
      phone: "+1 (555) 678-9012",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Emma Davis",
      address: "147 Elm Street",
      age: "7 years",
      parent: "Amanda Davis",
      phone: "+1 (555) 789-0123",
      busStop: "Elm Street Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Noah Johnson",
      address: "258 Pine Road",
      age: "10 years",
      parent: "Tom Johnson",
      phone: "+1 (555) 890-1234",
      busStop: "Pine Road Stop",
      assignedBus: "Bus 03"
    },
    {
      name: "Olivia Brown",
      address: "369 Oak Avenue",
      age: "8 years",
      parent: "Jessica Brown",
      phone: "+1 (555) 901-2345",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Liam Smith",
      address: "741 Birch Street",
      age: "9 years",
      parent: "John Smith",
      phone: "+1 (555) 111-2222",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Ava Johnson",
      address: "852 Cedar Lane",
      age: "7 years",
      parent: "Emily Johnson",
      phone: "+1 (555) 222-3333",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Ethan Williams",
      address: "963 Pine Court",
      age: "10 years",
      parent: "Daniel Williams",
      phone: "+1 (555) 333-4444",
      busStop: "Pine Road Stop",
      assignedBus: "Bus 03"
    },
    {
      name: "Isabella Davis",
      address: "159 Oak Drive",
      age: "8 years",
      parent: "Michelle Davis",
      phone: "+1 (555) 444-5555",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Mason Miller",
      address: "357 Elm Road",
      age: "9 years",
      parent: "Christopher Miller",
      phone: "+1 (555) 555-6666",
      busStop: "Elm Street Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Sophia Wilson",
      address: "246 Maple Street",
      age: "7 years",
      parent: "Patricia Wilson",
      phone: "+1 (555) 666-7777",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Lucas Moore",
      address: "468 Cedar Avenue",
      age: "10 years",
      parent: "James Moore",
      phone: "+1 (555) 777-8888",
      busStop: "Pine Road Stop",
      assignedBus: "Bus 03"
    },
    {
      name: "Mia Taylor",
      address: "579 Birch Drive",
      age: "8 years",
      parent: "Barbara Taylor",
      phone: "+1 (555) 888-9999",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Benjamin Anderson",
      address: "680 Oak Lane",
      age: "9 years",
      parent: "Richard Anderson",
      phone: "+1 (555) 999-0000",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Charlotte Thomas",
      address: "791 Pine Avenue",
      age: "7 years",
      parent: "Susan Thomas",
      phone: "+1 (555) 000-1111",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Henry Jackson",
      address: "802 Elm Court",
      age: "10 years",
      parent: "Joseph Jackson",
      phone: "+1 (555) 111-2223",
      busStop: "Elm Street Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Amelia White",
      address: "913 Cedar Road",
      age: "8 years",
      parent: "Nancy White",
      phone: "+1 (555) 222-3334",
      busStop: "Pine Road Stop",
      assignedBus: "Bus 03"
    },
    {
      name: "Alexander Harris",
      address: "124 Maple Court",
      age: "9 years",
      parent: "Charles Harris",
      phone: "+1 (555) 333-4445",
      busStop: "Maple Avenue Stop",
      assignedBus: "Bus 02"
    },
    {
      name: "Harper Martin",
      address: "235 Birch Avenue",
      age: "7 years",
      parent: "Lisa Martin",
      phone: "+1 (555) 444-5556",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Sebastian Lee",
      address: "346 Oak Court",
      age: "10 years",
      parent: "Robert Lee",
      phone: "+1 (555) 555-6667",
      busStop: "Oak Street Stop",
      assignedBus: "Bus 01"
    },
    {
      name: "Evelyn Walker",
      address: "457 Pine Lane",
      age: "8 years",
      parent: "Karen Walker",
      phone: "+1 (555) 666-7778",
      busStop: "Pine Road Stop",
      assignedBus: "Bus 03"
    }
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 9;
  
  // Modal state
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedBus, setSelectedBus] = useState('');
  
  // Add Student Modal state
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    age: '',
    parentName: '',
    parentPhone: '',
    address: '',
    busStop: '',
    assignedBus: ''
  });
  
  // Calculate total pages
  const totalPages = Math.ceil(students.length / studentsPerPage);
  
  // Get current students
  const indexOfLastStudent = currentPage * studentsPerPage;
  const indexOfFirstStudent = indexOfLastStudent - studentsPerPage;
  const currentStudents = students.slice(indexOfFirstStudent, indexOfLastStudent);

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
  const toggleStudentSelection = (studentName) => {
    if (selectedStudents.includes(studentName)) {
      setSelectedStudents(selectedStudents.filter(name => name !== studentName));
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
    setSelectedBus('');
  };

  // Assign students to bus
  const handleAssignToBus = () => {
    // Here you would handle the actual assignment
    console.log('Assigning students:', selectedStudents, 'to bus:', selectedBus);
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
      name: '',
      age: '',
      parentName: '',
      parentPhone: '',
      address: '',
      busStop: '',
      assignedBus: ''
    });
  };

  // Handle input change
  const handleInputChange = (field, value) => {
    setNewStudent({
      ...newStudent,
      [field]: value
    });
  };

  // Add new student
  const handleAddStudent = () => {
    // Here you would handle adding the student
    console.log('Adding new student:', newStudent);
    closeAddStudentModal();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Top Bar */}
        <div className="flex gap-4 mb-8">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search students by name, parent, or bus..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dropdown */}
          <select className="px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Bus Stops</option>
            <option>Bus Stop 1</option>
            <option>Bus Stop 2</option>
            <option>Bus Stop 3</option>
          </select>

          {/* Assign to Bus Button */}
          <button 
            onClick={openAssignModal}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Bus className="w-5 h-5" />
            Assign to Bus
          </button>

          {/* Add Student Button */}
          <button 
            onClick={openAddStudentModal}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            <UserPlus className="w-5 h-5" />
            Add Student
          </button>
        </div>

        {/* Cards Section */}
        <div className="flex gap-6 w-full mb-8">
          {/* Total Students Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
            <div className="text-gray-600 text-sm mb-2">Total Students</div>
            <div className="text-3xl font-semibold text-gray-900">25</div>
          </div>

          {/* Bus 01 Students Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
            <div className="text-gray-600 text-sm mb-2">Bus 01 Students</div>
            <div className="text-3xl font-semibold text-gray-900">5</div>
          </div>

          {/* Bus 02 Students Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
            <div className="text-gray-600 text-sm mb-2">Bus 02 Students</div>
            <div className="text-3xl font-semibold text-gray-900">4</div>
          </div>

          {/* Bus 03 Students Card */}
          <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
            <div className="text-gray-600 text-sm mb-2">Bus 03 Students</div>
            <div className="text-3xl font-semibold text-gray-900">3</div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Age</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Parent</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Bus Stop</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Assigned Bus</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-gray-900 font-medium">{student.name}</div>
                    <div className="text-gray-500 text-sm">{student.address}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{student.age}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{student.parent}</div>
                    <div className="text-gray-500 text-sm">{student.phone}</div>
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
                      <button className="text-blue-500 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="text-red-500 hover:text-red-700">
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
              Showing {indexOfFirstStudent + 1} to {Math.min(indexOfLastStudent, students.length)} of {students.length} students
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Assign to Bus Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <Bus className="w-6 h-6 text-purple-600" />
              <h2 className="text-xl font-semibold text-gray-900">Assign Students to Bus</h2>
            </div>

            {/* Select Students Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Students
              </label>
              <div className="border border-gray-300 rounded-lg max-h-64 overflow-y-auto p-2">
                {students.map((student, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
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

            {/* Assign to Bus Section */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Assign to Bus
              </label>
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">Select a bus</option>
                <option value="Bus 01">Bus 01</option>
                <option value="Bus 02">Bus 02</option>
                <option value="Bus 03">Bus 03</option>
              </select>
            </div>

            {/* Modal Actions */}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <UserPlus className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900">Add New Student</h2>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Student Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={newStudent.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Age
                </label>
                <input
                  type="number"
                  placeholder="8"
                  value={newStudent.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Parent Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Name
                </label>
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={newStudent.parentName}
                  onChange={(e) => handleInputChange('parentName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Parent Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parent Phone
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={newStudent.parentPhone}
                  onChange={(e) => handleInputChange('parentPhone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  placeholder="123 Main Street"
                  value={newStudent.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bus Stop */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bus Stop
                </label>
                <select
                  value={newStudent.busStop}
                  onChange={(e) => handleInputChange('busStop', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  value={newStudent.assignedBus}
                  onChange={(e) => handleInputChange('assignedBus', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a bus</option>
                  <option value="Bus 01">Bus 01</option>
                  <option value="Bus 02">Bus 02</option>
                  <option value="Bus 03">Bus 03</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
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
    </div>
  );
}