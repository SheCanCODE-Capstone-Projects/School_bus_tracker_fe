'use client';

const BusInformationCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Bus Information</h2>
      
      <div className="space-y-5">
        {/* Your Child's Bus Section */}
        <div>
         <div className="bg-blue-50 border border-gray-300 rounded-lg p-3 mb-2">
  <div className="">
    <div className="flex items-center">
      <div className="mr-3 w-8 h-8 flex items-center justify-center">
        <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4a1 1 0 00-.293-.707l-2-2A1 1 0 0018 7h-3V4a1 1 0 00-1-1H3zm11 3h3.586l1 1H14V7zm-6 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
        </svg>
      </div>
      <span className="text-gray-700">Your Child s Bus</span>
    </div>
    <span className="bg-blue-100 text-blue-800 text-sm font-bold py-1 px-3 rounded-full">Bus 01</span>
  </div>
</div>
        </div>

        {/* Driver Section */}
  <div className="border border-gray-300 rounded-lg p-3 mb-2">
  <div className="flex items-center justify-between">
    <div className="flex items-center">
      <div className="mr-3 w-8 h-8 flex items-center justify-center bg-blue-100 rounded-full">
        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      </div>
      <span className="text-gray-700">Driver</span>
    </div>
    <span className="font-semibold text-gray-800">Michael Johnson</span>
  </div>
</div>

        {/* School Section */}
        <div className="border border-gray-300 rounded-lg p-3 mb-2">
          <div className="">
            <div className="flex items-center">
              <div className="mr-3 w-8 h-8 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <span className="text-gray-700">School</span>
            </div>
            <span className="font-semibold text-gray-800">Lincoln Elementary School</span>
          </div>
        </div>

        <hr className="my-4 border-gray-200" />

        {/* Status Section - Green background area */}
        <div className="bg-[#10B981] rounded-xl p-4 mb-4">
          {/* Status row */}
          <div className="flex items-center mb-2">
            <span className="text-white font-bold mr-2">Status:</span>
            <div className="inline-flex items-center">
              <span className="w-3 h-3 bg-white rounded-full mr-2"></span>
              <span className="text-white font-bold text-sm">On Route</span>
            </div>
          </div>
          
          {/* Updated Time */}
          <div className="text-white text-sm font-medium mb-1 ">
            Updated 2:13:00 PM
          </div>
          
          {/* Location */}
          <div className="flex items-center text-white">
            <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">5th Ave & Park St</span>
          </div>
        </div>

        {/* Estimated Arrival Card */}
       <div className="bg-gray-100 border border-gray-300 rounded-xl p-4 text-center">
  <div className="flex items-center justify-center text-blue-700 mb-2">
    <svg className="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
    </svg>
    <span className="text-xs font-bold uppercase tracking-wider text-gray-900">ESTIMATED ARRIVAL</span>
  </div>
  <div className="text-xl  text-gray-900 mb-1">3:45 PM</div>
  <div className="text-gray-600 text-sm">Arriving in approximately 15 minutes</div>
</div>
      </div>
    </div>
  );
};

export default BusInformationCard;