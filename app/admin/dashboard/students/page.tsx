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
              className="w-full text-gray-700 pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Dropdown */}
          <select className="px-4 py-3 text-gray-700 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Bus Stops</option>
            <option>Bus Stop 1</option>
            <option>Bus Stop 2</option>
            <option>Bus Stop 3</option>
          </select>

          {/* Assign to Bus Button */}
          <button className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Bus className="w-5 h-5" />
            Assign to Bus
          </button>

          {/* Add Student Button */}
          <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
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

       
      </div>
    </div>
  );
}