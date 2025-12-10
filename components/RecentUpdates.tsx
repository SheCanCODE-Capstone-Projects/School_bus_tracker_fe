'use client';

interface Update {
  time: string;
  message: string;
}

const RecentUpdates = () => {
  const updates: Update[] = [
    { time: '2:30 PM', message: 'Bus is on route. Everything is running smoothly.' },
    { time: '2:00 PM', message: 'All students have been picked up successfully.' },
    { time: '1:45 PM', message: 'Bus departed from Lincoln Elementary School.' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 pb-3 ">Recent Updates</h2>
      
      <div className="space-y-6">
        {updates.map((update, index) => (
          <div key={index} className="flex items-start">
            <div className="bg-blue-100 text-black  py-1 px-3 rounded-lg mr-4 min-w-[100px] text-center">
              {update.time}
            </div>
            <div className="border border-gray-300 rounded-lg
            p-4 flex-1">
              <h4 className=" text-gray-800">{update.message}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentUpdates;