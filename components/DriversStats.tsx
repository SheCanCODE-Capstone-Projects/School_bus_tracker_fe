interface Stat {
  title: string;
  value: number;
  border: string;
}

export default function DriversStats() {
  const stats: Stat[] = [
    { title: "Total Drivers", value: 5, border: "border-blue-300" },
    { title: "Active Drivers", value: 4, border: "border-green-300" },
    { title: "Unassigned", value: 1, border: "border-yellow-300" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`bg-white border ${stat.border} rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95`}
        >
          <p className="text-gray-500 text-sm sm:text-base">{stat.title}</p>
          <h2 className="text-lg sm:text-xl lg:text-md  mt-1 sm:mt-2 text-gray-800">{stat.value}</h2>
        </div>
      ))}
    </div>
  );
}
