import DriverRow from "./DriverRow";


type Driver = {
  name: string;
  email: string;
  phone: string;
  bus: string | null;
  status: "Active" | "Inactive";
};

const drivers: Driver[] = [
  {
    name: "Michael Johnson",
    email: "michael.j@school.com",
    phone: "+1 (555) 987-6543",
    bus: "Bus 01",
    status: "Active",
  },
  {
    name: "Sarah Williams",
    email: "sarah.w@school.com",
    phone: "+1 (555) 123-4567",
    bus: "Bus 02",
    status: "Active",
  },
  {
    name: "David Brown",
    email: "david.b@school.com",
    phone: "+1 (555) 789-0123",
    bus: "Bus 03",
    status: "Active",
  },
  {
    name: "Emily Davis",
    email: "emily.d@school.com",
    phone: "+1 (555) 456-7890",
    bus: "Bus 04",
    status: "Active",
  },
  {
    name: "James Wilson",
    email: "james.w@school.com",
    phone: "+1 (555) 234-5678",
    bus: null,
    status: "Inactive",
  },
];

export default function DriversTable() {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px]">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Driver</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Contact</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Assigned Bus</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Status</th>
              <th className="p-2 sm:p-4 text-left text-black font-bold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((driver) => (
              <DriverRow key={driver.email} driver={driver} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
