import { Search, UserPlus, Plus } from "lucide-react";

export default function DriversToolbar() {
  return (
    <div className="flex flex-col lg:flex-row justify-between gap-4">
      
      <div className="flex items-center gap-2 bg-white border rounded-xl px-4 py-3 w-full lg:w-2/3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search drivers by name or bus..."
          className="w-full outline-none text-sm placeholder-gray-500"
        />
      </div>

      <div className="flex gap-3">
        <button className="flex items-center gap-2 bg-purple-600 text-white px-5 py-3 rounded-xl">
          <UserPlus size={18} />
          Assign to Bus
        </button>

        <button className="flex items-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-xl">
          <Plus size={18} />
          Add Driver
        </button>
      </div>
    </div>
  );
}
