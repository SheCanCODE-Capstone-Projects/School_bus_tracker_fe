"use client";
import React, { useState } from "react";
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

export default function ParentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [parentToDelete, setParentToDelete] = useState(null);

  const [parentName, setParentName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [children, setChildren] = useState([
    { id: 1, name: "", age: "", busStop: "" },
  ]);
  const [assignedBus, setAssignedBus] = useState("");
  
  const [editParent, setEditParent] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    childName: "",
    assignedBus: "",
  });

  const [parents, setParents] = useState([
    {
      id: 1,
      name: "Sarah Anderson",
      address: "123 Oak Street",
      email: "sarah.anderson@email.com",
      phone: "+1 (555) 123-4567",
      childName: "Emily Anderson",
      assignedBus: "Bus 01",
    },
    {
      id: 2,
      name: "Robert Martinez",
      address: "456 Elm Avenue",
      email: "robert.m@email.com",
      phone: "+1 (555) 234-5678",
      childName: "Carlos Martinez",
      assignedBus: "Bus 01",
    },
    {
      id: 3,
      name: "Jennifer Lee",
      address: "789 Pine Road",
      email: "jennifer.lee@email.com",
      phone: "+1 (555) 345-6789",
      childName: "Sophie Lee",
      assignedBus: "Bus 02",
    },
    {
      id: 4,
      name: "Michael Thompson",
      address: "321 Maple Drive",
      email: "michael.t@email.com",
      phone: "+1 (555) 456-7890",
      childName: "Alex Thompson",
      assignedBus: "Bus 02",
    },
    {
      id: 5,
      name: "Lisa Garcia",
      address: "654 Birch Lane",
      email: "lisa.garcia@email.com",
      phone: "+1 (555) 567-8901",
      childName: "Maria Garcia",
      assignedBus: "Bus 03",
    },
    {
      id: 6,
      name: "David Wilson",
      address: "987 Cedar Avenue",
      email: "david.wilson@email.com",
      phone: "+1 (555) 678-9012",
      childName: "Emma Wilson",
      assignedBus: "Bus 01",
    },
    {
      id: 7,
      name: "Amanda Johnson",
      address: "147 Spruce Lane",
      email: "amanda.j@email.com",
      phone: "+1 (555) 789-0123",
      childName: "Noah Johnson",
      assignedBus: "Bus 02",
    },
    {
      id: 8,
      name: "Kevin Miller",
      address: "258 Poplar Street",
      email: "kevin.miller@email.com",
      phone: "+1 (555) 890-1234",
      childName: "Olivia Miller",
      assignedBus: "Bus 03",
    },
    {
      id: 9,
      name: "Rachel Taylor",
      address: "369 Ash Boulevard",
      email: "rachel.taylor@email.com",
      phone: "+1 (555) 901-2345",
      childName: "Liam Taylor",
      assignedBus: "Bus 01",
    },
    {
      id: 10,
      name: "Steven Brown",
      address: "741 Hickory Place",
      email: "steven.brown@email.com",
      phone: "+1 (555) 012-3456",
      childName: "Ava Brown",
      assignedBus: "Bus 02",
    },
    {
      id: 11,
      name: "Michelle Clark",
      address: "852 Magnolia Court",
      email: "michelle.clark@email.com",
      phone: "+1 (555) 123-7890",
      childName: "William Clark",
      assignedBus: "Bus 03",
    },
    {
      id: 12,
      name: "Carlos Rodriguez",
      address: "963 Dogwood Lane",
      email: "carlos.rodriguez@email.com",
      phone: "+1 (555) 234-8901",
      childName: "Charlotte Rodriguez",
      assignedBus: "Bus 01",
    },
    {
      id: 13,
      name: "Nicole Lewis",
      address: "159 Sycamore Street",
      email: "nicole.lewis@email.com",
      phone: "+1 (555) 345-9012",
      childName: "Benjamin Lewis",
      assignedBus: "Bus 02",
    },
    {
      id: 14,
      name: "Brian Walker",
      address: "357 Chestnut Avenue",
      email: "brian.walker@email.com",
      phone: "+1 (555) 456-0123",
      childName: "Amelia Walker",
      assignedBus: "Bus 03",
    },
    {
      id: 15,
      name: "Jessica Hall",
      address: "468 Walnut Drive",
      email: "jessica.hall@email.com",
      phone: "+1 (555) 567-1234",
      childName: "Lucas Hall",
      assignedBus: "Bus 01",
    },
  ]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const parentsPerPage = 9;
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Count parents by bus
  const totalParents = parents.length;
  const bus01Parents = parents.filter((p) => p.assignedBus === "Bus 01").length;
  const bus02Parents = parents.filter((p) => p.assignedBus === "Bus 02").length;
  const bus03Parents = parents.filter((p) => p.assignedBus === "Bus 03").length;

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
    indexOfLastParent
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
      { id: children.length + 1, name: "", age: "", busStop: "" },
    ]);
  };

  const handleRemoveChild = (id: number) => {
    if (children.length > 1)
      setChildren(children.filter((child) => child.id !== id));
  };

  const handleChildChange = (id: number, field: string, value: string) => {
    setChildren(
      children.map((child) =>
        child.id === id ? { ...child, [field]: value } : child
      )
    );
  };

  const handleSubmitParent = () => {
    console.log({ parentName, email, phone, address, children, assignedBus });
    setShowAddParentModal(false);
    setParentName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setChildren([{ id: 1, name: "", age: "", busStop: "" }]);
    setAssignedBus("");
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

  const handleSaveEdit = () => {
    console.log("Saving edited parent:", editParent);
    setShowEditModal(false);
  };

  const handleDeleteClick = (parent: any) => {
    setParentToDelete(parent);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setParents(parents.filter((p) => p.id !== parentToDelete.id));
    setShowDeleteModal(false);
    setParentToDelete(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this parent?")) {
      setParents(parents.filter((p) => p.id !== id));
    }
  };

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
                onClick={() => setShowAddParentModal(true)}
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

          {/* Parents Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            {/* Mobile/Tablet Scrollable Table */}
            <div className="lg:hidden overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Mobile Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-200 text-sm font-bold text-gray-700">
                  <div className="col-span-2">Parent</div>
                  <div className="col-span-3">Contact</div>
                  <div className="col-span-3">Child</div>
                  <div className="col-span-2">Assigned Bus</div>
                  <div className="col-span-2">Actions</div>
                </div>

                {/* Mobile Table Body */}
                <div className={`divide-y divide-gray-200 transition-all duration-300 ${
                  isTransitioning
                    ? "opacity-50 transform translate-x-2"
                    : "opacity-100 transform translate-x-0"
                }`}>
                  {currentParents.map((parent) => (
                    <div
                      key={parent.id}
                      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition"
                    >
                      {/* Parent Info */}
                      <div className="col-span-2">
                        <div className="text-gray-900 text-sm font-medium">{parent.name}</div>
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
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Users className="w-3 h-3 text-blue-500 flex-shrink-0" />
                          <span className="truncate">{parent.childName}</span>
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
                <div className="col-span-3">Child</div>
                <div className="col-span-2">Assigned Bus</div>
                <div className="col-span-2">Actions</div>
              </div>

              {/* Desktop Table Body */}
              <div className={`divide-y divide-gray-200 transition-all duration-300 ${
                isTransitioning
                  ? "opacity-50 transform translate-x-2"
                  : "opacity-100 transform translate-x-0"
              }`}>
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
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4 text-blue-500" />
                        {parent.childName}
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

          {/* No Results Message */}
          {filteredParents.length === 0 && (
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
              onClick={() => setShowAddParentModal(false)}
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
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        placeholder="123 Main Street"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                      />
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
                      className="flex items-center gap-2 px-4 py-2 bg-blue-100  text-blue-600 rounded-2xl shadow-sm hover:shadow-md hover:bg-blue-200 transition text-sm font-medium"
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
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Child's Name
                            </label>
                            <input
                              type="text"
                              placeholder="Jane Doe"
                              value={child.name}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
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
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Bus Stop
                            </label>
                            <select
                              value={child.busStop}
                              onChange={(e) =>
                                handleChildChange(
                                  child.id,
                                  "busStop",
                                  e.target.value
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-700"
                            >
                              <option value="">Select a bus stop</option>
                              <option value="Oak Street Stop">
                                Oak Street Stop
                              </option>
                              <option value="Maple Avenue Stop">
                                Maple Avenue Stop
                              </option>
                              <option value="Pine Road Stop">
                                Pine Road Stop
                              </option>
                              <option value="Elm Street Stop">
                                Elm Street Stop
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to Bus
                  </label>
                  <select
                    value={assignedBus}
                    onChange={(e) => setAssignedBus(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  >
                    <option value="">Select a bus</option>
                    <option value="Bus 01">Bus 01</option>
                    <option value="Bus 02">Bus 02</option>
                    <option value="Bus 03">Bus 03</option>
                  </select>
                </div>

                <div className="w-full h-px bg-gray-300 my-4" />


                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleSubmitParent}
                    className="w-full sm:flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-medium"
                  >
                    Add Parent
                  </button>
                  <button
                    onClick={() => setShowAddParentModal(false)}
                    className="w-full sm:flex-1 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-medium"
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
            <div className="absolute inset-0 bg-gray-700/40 backdrop-blur-md" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center gap-3 mb-4 md:mb-6">
                <div className="bg-green-100 p-2 rounded-2xl">
                  <SquarePen className="w-5 h-5 md:w-6 md:h-6 text-green-500" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Edit Parent</h2>
              </div>

              <div className="space-y-3 md:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Parent Name</label>
                  <input type="text" value={editParent.name} onChange={(e) => handleEditInputChange("name", e.target.value)} className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input type="email" value={editParent.email} onChange={(e) => handleEditInputChange("email", e.target.value)} className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input type="tel" value={editParent.phone} onChange={(e) => handleEditInputChange("phone", e.target.value)} className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <input type="text" value={editParent.address} onChange={(e) => handleEditInputChange("address", e.target.value)} className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Child Name</label>
                  <input type="text" value={editParent.childName} onChange={(e) => handleEditInputChange("childName", e.target.value)} className="w-full px-4 py-2.5 md:py-3 text-gray-600 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assigned Bus</label>
                  <select value={editParent.assignedBus} onChange={(e) => handleEditInputChange("assignedBus", e.target.value)} className="w-full px-4 py-2.5 md:py-3 border text-gray-600 border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm md:text-base">
                    <option value="">Select a bus</option>
                    <option value="Bus 01">Bus 01</option>
                    <option value="Bus 02">Bus 02</option>
                    <option value="Bus 03">Bus 03</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-6">
                <button onClick={handleSaveEdit} className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-green-500 text-white rounded-2xl hover:bg-green-600 transition font-medium text-sm md:text-base">Save Changes</button>
                <button onClick={() => setShowEditModal(false)} className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-gray-200 text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-300 transition font-medium text-sm md:text-base">Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-700/40 backdrop-blur-md" onClick={() => setShowDeleteModal(false)} />
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-4 md:p-6">
              <div className="flex items-center gap-3 mb-3 md:mb-4">
                <div className="bg-red-100 p-2 rounded-2xl">
                  <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                </div>
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Delete Parent</h2>
              </div>

              <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6">
                Are you sure you want to delete <span className="font-semibold text-gray-900">{parentToDelete?.name}</span>? This action cannot be undone.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button onClick={confirmDelete} className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-red-600 text-white rounded-2xl hover:bg-red-700 transition font-medium text-sm md:text-base">Delete</button>
                <button onClick={() => setShowDeleteModal(false)} className="w-full sm:flex-1 px-4 md:px-6 py-2.5 md:py-3 bg-white text-gray-700 border border-gray-300 rounded-2xl hover:bg-gray-50 transition font-medium text-sm md:text-base">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </div>
      <AdminFooter />
    </>
  );
}
