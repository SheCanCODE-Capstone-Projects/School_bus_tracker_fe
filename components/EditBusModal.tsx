import React, { useState, useEffect } from 'react';
import { X, Bus } from 'lucide-react';
import { getAuthToken } from '@/lib/auth';

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

interface Driver {
  id: number;
  fullName: string;
}

interface EditBusModalProps {
  bus: Bus;
  onClose: () => void;
  onSave: (bus: Bus) => void;
}

const EditBusModal: React.FC<EditBusModalProps> = ({ bus, onClose, onSave }) => {
  const [formData, setFormData] = useState(bus);

  const [schools, setSchools] = useState<School[]>([]);
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState<number | "">("");

  const [schoolOpen, setSchoolOpen] = useState(false);
  const [driverOpen, setDriverOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const API_BASE_URL = 'https://school-bus-tracker-be.onrender.com/api';

  useEffect(() => {
    const fetchData = async () => {
      const token = getAuthToken();
      if (!token) return;

      const schoolsRes = await fetch(`${API_BASE_URL}/schools`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (schoolsRes.ok) {
        const data = await schoolsRes.json();
        const list = Array.isArray(data) ? data : data?.data || [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSchools(list.map((s: any) => ({
          id: s.id,
          schoolName: s.schoolName || s.name,
        })));
      }

      const driversRes = await fetch(`${API_BASE_URL}/drivers`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (driversRes.ok) {
        const data = await driversRes.json();
        const list = data?.data || data;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setDrivers(list.map((d: any) => ({
          id: d.id,
          fullName: d.full_name || d.fullName,
        })));
      }
    };

    fetchData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 z-10 max-h-[90vh] overflow-y-auto">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <div className="flex gap-2 items-center">
            <Bus className="text-blue-400" />
            <h3 className="font-bold text-gray-700">Edit Bus</h3>
          </div>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* BUS NAME */}
          <div>
            <label className="text-xs text-black">Bus Name</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-sm text-gray-400
                         focus:ring-1 focus:outline-none focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* BUS NUMBER */}
          <div>
            <label className="text-xs text-black">Bus Number</label>
            <input
              name="code"
              value={formData.code}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded-lg text-sm text-gray-400
                         focus:ring-1 focus:outline-none focus:ring-blue-400 focus:border-blue-400"
            />
          </div>

          {/* SCHOOL */}
          <div className="relative">
            <label className="text-xs text-black mb-1 block">School</label>

            <button
              type="button"
              onClick={() => setSchoolOpen(!schoolOpen)}
              className="w-full border px-3 py-2 rounded-lg text-left text-sm
                         text-gray-400 focus:ring-1 focus:outline-none focus:ring-blue-400"
            >
              {selectedSchoolId
                ? schools.find(s => s.id === selectedSchoolId)?.schoolName
                : "Select school"}
            </button>

            {schoolOpen && (
              <ul className="mt-2 rounded-lg shadow border bg-blue-400 border-blue-400">
                {schools.map(s => (
                  <li
                    key={s.id}
                    onClick={() => {
                      setSelectedSchoolId(s.id);
                      setSchoolOpen(false);
                    }}
                    className="px-3 py-2 text-white cursor-pointer
                               hover:bg-blue-400"
                  >
                    {s.schoolName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* DRIVER */}
          <div className="relative">
            <label className="text-xs text-black mb-1 block">Assign Driver</label>

            <button
              type="button"
              onClick={() => setDriverOpen(!driverOpen)}
              className="w-full border px-3 py-2 rounded-lg text-left text-sm
                         text-gray-400 truncate
                         focus:ring-1 focus:outline-none focus:ring-blue-400"
            >
              {formData.driver || "No Assignment"}
            </button>

            {driverOpen && (
              <ul className="mt-2 rounded-lg shadow border bg-white border-blue-500">

                <li
                  onClick={() => {
                    setFormData(prev => ({ ...prev, driver: "" }));
                    setDriverOpen(false);
                  }}
                  className="px-3 py-2 text-gray-400 cursor-pointer hover:bg-blue-400  hover:text-white"
                >
                  No Assignment
                </li>

                {drivers.map(d => (
                  <li
                    key={d.id}
                    onClick={() => {
                      setFormData(prev => ({ ...prev, driver: d.fullName }));
                      setDriverOpen(false);
                    }}
                    className="px-3 py-2 text-gray-400 cursor-pointer hover:bg-blue-400 hover:text-white"
                  >
                    {d.fullName}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* STATUS */}
          <div className="relative">
            <label className="text-xs text-black mb-1 block">Status</label>

            <button
              type="button"
              onClick={() => setStatusOpen(!statusOpen)}
              className="w-full border px-3 py-2 rounded-lg text-left text-sm
                         text-gray-400 focus:ring-1 focus:outline-none focus:ring-blue-400"
            >
              {formData.active ? "Active" : "Inactive"}
            </button>

            {statusOpen && (
              <ul className="mt-2 rounded-lg shadow border bg-white border-blue-500">
                <li
                  onClick={() => {
                    setFormData(prev => ({ ...prev, active: true }));
                    setStatusOpen(false);
                  }}
                  className="px-3 py-2 text-gray-400 cursor-pointer hover:bg-blue-400 hover:text-white"
                >
                  Active
                </li>

                <li
                  onClick={() => {
                    setFormData(prev => ({ ...prev, active: false }));
                    setStatusOpen(false);
                  }}
                  className="px-3 py-2 text-gray-400 cursor-pointer hover:bg-blue-400  hover:text-white"
                >
                  Inactive
                </li>
              </ul>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-4">
            <button className="flex-1 bg-blue-400 text-white py-2 rounded-lg hover:bg-blue-500">
              Save Changes
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-500 py-2 rounded-lg hover:bg-gray-300"
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
