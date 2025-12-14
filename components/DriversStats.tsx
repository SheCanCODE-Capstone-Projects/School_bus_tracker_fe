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
    <div className="grid md:grid-cols-3 gap-6">
      {stats.map((stat) => (
        <div
          key={stat.title}
          className={`bg-white border ${stat.border} rounded-2xl p-6 shadow-lg`}
        >
          <p className="text-gray-500">{stat.title}</p>
          <h2 className="text-sm mt-2 text-gray-500">{stat.value}</h2>
        </div>
      ))}
    </div>
  );
}
