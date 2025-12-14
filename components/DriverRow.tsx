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
          <p className="font-medium">{driver.name}</p>
          <p className="text-gray-500 text-xs">{driver.email}</p>
        </div>
      </td>

      <td className="p-4 flex items-center gap-2">
        <Phone size={14} className="text-blue-500" />
        {driver.phone}
      </td>

      <td className="p-4 flex items-center gap-2">
        <Bus size={14} className="text-blue-500" />
        {driver.bus ?? "Not assigned"}
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
        <Pencil size={18} className="text-blue-500 cursor-pointer" />
        <Trash2 size={18} className="text-red-500 cursor-pointer" />
      </td>
    </tr>
  );
}
