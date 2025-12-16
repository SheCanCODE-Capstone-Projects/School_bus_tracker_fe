"use client";
import React, { useState } from 'react';
import { X, Save, BusFront, Route, User, DollarSign, Users } from 'lucide-react';

// Define the Bus type for consistency
interface Bus {
  id: number;
  name: string;
  code: string;
  route: string;
  driver: string;
  capacity: number;
  maxCapacity: number;
  active: boolean;
}

interface EditBusModalProps {
  bus: Bus;
  onClose: () => void;
  onSave: (bus: Bus) => void;
}

const EditBusModal: React.FC<EditBusModalProps> = ({ bus, onClose, onSave }) => {
  // Use state to manage the form data
  const [formData, setFormData] = useState(bus);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <BusFront className="text-blue-600" /> Edit Bus: {bus.name}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Bus Name & Code */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <BusFront size={16} className="mr-1 text-gray-500" /> Bus Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <DollarSign size={16} className="mr-1 text-gray-500" /> Bus Code
              </label>
              <input
                type="text"
                id="code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Route & Driver */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="route" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <Route size={16} className="mr-1 text-gray-500" /> Route
              </label>
              <input
                type="text"
                id="route"
                name="route"
                value={formData.route}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="driver" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <User size={16} className="mr-1 text-gray-500" /> Driver
              </label>
              {/* This would ideally be a select/autocomplete fetching from a drivers list */}
              <input
                type="text"
                id="driver"
                name="driver"
                value={formData.driver}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>
          
          {/* Capacity */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <Users size={16} className="mr-1 text-gray-500" /> Current Students
              </label>
              <input
                type="number"
                id="capacity"
                name="capacity"
                value={formData.capacity}
                onChange={handleChange}
                min="0"
                max={formData.maxCapacity}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
                <Users size={16} className="mr-1 text-gray-500" /> Max Capacity
              </label>
              <input
                type="number"
                id="maxCapacity"
                name="maxCapacity"
                value={formData.maxCapacity}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="active" className="block text-sm font-medium text-gray-700 flex items-center mb-1">
              Status
            </label>
            <select
              id="active"
              name="active"
              value={formData.active.toString()} // Select expects string or number, convert boolean
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2 font-medium hover:bg-blue-700 transition-colors"
            >
              <Save size={20} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusModal;