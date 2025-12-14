import { Pencil, Trash2, Phone, Bus } from "lucide-react";

// Define the type directly inside this file
type Driver = {
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
};

export default function DriverRow({ driver }: { driver: Driver }) {
  return (
    <tr className="border-b last:border-none">
      <td className="p-4 flex gap-3">
        <span className="text-2xl">🧑‍✈️</span>
        <div>
          <p className="text-black">{driver.name}</p>
        </div>
      </td>

      <td className="p-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Phone size={14} className="text-blue-500" />
            <span className="text-black text-xs">{driver.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span className="text-black text-xs">{driver.email}</span>
          </div>
        </div>
      </td>

      <td className="p-4 flex items-center gap-2">
        <Bus size={14} className="text-blue-500" />
        <span className="text-black">{driver.bus ?? "Not assigned"}</span>
      </td>

      <td className="p-4">
        <span
          className={`px-3 py-1 rounded-full text-xs ${
            driver.status === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {driver.status}
        </span>
      </td>

      <td className="p-4 flex gap-3">
        <Pencil size={18} className="text-blue-500 cursor-pointer hover:text-blue-700" />
        <Trash2 size={18} className="text-red-500 cursor-pointer hover:text-red-700" />
      </td>
    </tr>
  );
}
