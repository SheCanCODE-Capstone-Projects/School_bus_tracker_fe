import React, { useState, useEffect } from 'react';
import { X, Bus } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';

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

interface School {
  id: number;
  schoolName: string;
}

interface EditBusModalProps {
  bus: Bus;
  onClose: () => void;
  onSave: (bus: Bus) => void;
}

const EditBusModal: React.FC<EditBusModalProps> = ({ bus, onClose, onSave }) => {
  // Use state to manage the form data
  const [formData, setFormData] = useState(bus);
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolsLoading, setSchoolsLoading] = useState(false);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | "">("");

  const API_BASE_URL = 'https://school-bus-tracker-be.onrender.com/api';

  // Fetch schools on component mount
  useEffect(() => {
    const fetchSchools = async () => {
      setSchoolsLoading(true);
      try {
        const token = getAuthToken();
        if (!token) {
          setSchools([]);
          return;
        }

        const res = await fetch(`${API_BASE_URL}/schools`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });

        if (!res.ok) {
          console.warn(`Schools API error: ${res.status}`);
          setSchools([]);
          return;
        }

        const data = await res.json();
        const schoolsList = Array.isArray(data) 
          ? data 
          : data?.data && Array.isArray(data.data)
          ? data.data 
          : data?.content && Array.isArray(data.content)
          ? data.content 
          : [];

        const formattedSchools = schoolsList.map((school: any) => ({
          id: school.id || school.schoolId || Date.now(),
          schoolName: school.schoolName || school.name || 'Unknown School'
        }));

        setSchools(formattedSchools);
      } catch (error) {
        console.error("Error fetching schools:", error);
        setSchools([]);
      } finally {
        setSchoolsLoading(false);
      }
    };

    fetchSchools();
  }, []);

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
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Bus className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-bold text-gray-700">Edit Bus: {bus.name}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Bus Name */}
          <div>
            <label htmlFor="name" className="block text-xs text-black mb-1">
              Bus Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              required
            />
          </div>
          
          {/* Bus Number */}
          <div>
            <label htmlFor="code" className="block text-xs text-black mb-1">
              Bus Number
            </label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              required
            />
          </div>

          {/* School */}
          <div>
            <label htmlFor="school" className="block text-xs text-black mb-1">
              School
            </label>
            <select
              id="school"
              disabled={schoolsLoading}
              value={selectedSchoolId}
              onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-700 focus:ring-2 focus:ring-blue-200 focus:border-blue-400 disabled:bg-gray-100"
              required
            >
              <option value="">Select a school</option>
              {schools.map((school) => (
                <option key={school.id} value={school.id}>
                  {school.schoolName}
                </option>
              ))}
            </select>
          </div>
          {/* Max Capacity */}
          <div>
            <label htmlFor="maxCapacity" className="block text-xs text-black mb-1">
              Max Capacity
            </label>
            <input
              type="number"
              id="maxCapacity"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              required
            />
          </div>

          {/* Current Filled */}
          <div>
            <label htmlFor="capacity" className="block text-xs text-black mb-1">
              Current Filled
            </label>
            <input
              type="number"
              id="capacity"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              min="0"
              max={formData.maxCapacity}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              required
            />
          </div>

          {/* Route */}
          <div>
            <label htmlFor="route" className="block text-xs text-black mb-1">
              Route
            </label>
            <input
              type="text"
              id="route"
              name="route"
              value={formData.route}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              required
            />
          </div>
          
          {/* Assign Driver */}
          <div>
            <label htmlFor="driver" className="block text-xs text-black mb-1">
              Assign Driver
            </label>
            <select
              id="driver"
              name="driver"
              value={formData.driver}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
              required
            >
              <option value="">No Assignment</option>
              <option value="Michael Johnson">Michael Johnson (#001)</option>
              <option value="Sarah Williams">Sarah Williams (#002)</option>
              <option value="John Doe">John Doe (#003)</option>
              <option value="Alice Brown">Alice Brown (#004)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label htmlFor="active" className="block text-xs text-black mb-1">
              Status
            </label>
            <select
              id="active"
              name="active"
              value={formData.active.toString()}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.value === 'true' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-400 focus:ring-2 focus:ring-blue-200 focus:border-blue-400"
            >
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors"
            >
              Save Changes
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBusModal;