'use client';

const BusInformationCard = () => {
  return (
    <div className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
      <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Bus Information</h2>
      
      <div className="space-y-3 sm:space-y-4 md:space-y-5">
        {/* Your Child's Bus Section */}
        <div className="bg-sky-100 border border-sky-100 rounded-md sm:rounded-lg p-2 sm:p-3 mb-2">
          <div className="flex items-start">
            <div className="mr-2 sm:mr-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-600 rounded-md sm:rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4a1 1 0 00-.293-.707l-2-2A1 1 0 0018 7h-3V4a1 1 0 00-1-1H3zm11 3h3.586l1 1H14V7zm-6 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-700 text-xs sm:text-sm md:text-base mb-1">Your Childs Bus</span>
              <span className="bg-blue-100 text-blue-800 text-xs sm:text-xs md:text-sm font-bold py-0.5 px-1.5 sm:py-1 sm:px-2 md:py-1 md:px-3 rounded-full self-start">
                Bus 01
              </span>
            </div>
          </div>
        </div>

        {/* Driver Section */}
        <div className="border border-gray-200 rounded-md sm:rounded-lg p-2 sm:p-3 mb-2">
          <div className="flex items-start">
            <div 
              className="mr-2 sm:mr-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 rounded-full bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: 'url(/image.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <div className="flex flex-col">
              <span className="text-gray-700 text-xs sm:text-sm md:text-base mb-1">Driver</span>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">
                Michael Johnson
              </span>
            </div>
          </div>
        </div>

        {/* School Section */}
        <div className="border border-gray-200 rounded-md sm:rounded-lg p-2 sm:p-3 mb-2">
          <div className="flex items-start">
            <div className="mr-2 sm:mr-3 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 bg-blue-100 rounded-md sm:rounded-lg flex items-center justify-center">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 3L2 12H5V20H19V12H22L12 3ZM7 18V10.5L12 6L17 10.5V18H15V13H9V18H7Z"/>
                <rect x="10" y="14" width="1" height="2" fill="currentColor"/>
                <rect x="13" y="14" width="1" height="2" fill="currentColor"/>
                <rect x="10" y="7" width="4" height="1" fill="currentColor"/>
                <rect x="10" y="9" width="4" height="1" fill="currentColor"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-700 text-xs sm:text-sm md:text-base mb-1">School</span>
              <span className="font-semibold text-gray-800 text-xs sm:text-sm md:text-base">
                Lincoln Elementary School
              </span>
            </div>
          </div>
        </div>

        <hr className="my-3 md:my-4 border-gray-200" />

        {/* Status Section - Green background area */}
        <div className="bg-[#10B981] rounded-md sm:rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 mb-2 sm:mb-3 md:mb-4 text-center">
          {/* Status row */}
          <div className="flex items-center mb-2 sm:mb-3 md:mb-4">
            <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 bg-white rounded-full mr-1.5 sm:mr-2"></span>
            <span className="text-white font-bold mr-1.5 sm:mr-2 text-xs sm:text-sm md:text-base">Status:</span>
            <span className="text-white font-bold text-xs sm:text-xs md:text-sm">On Route</span>
          </div>
          
          {/* Updated Time */}
          <div className="bg-white/40 rounded-md sm:rounded-lg p-1.5 sm:p-2 mb-1.5 sm:mb-2 md:mb-3 flex items-center justify-center">
            <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span className="text-white text-xs md:text-sm font-medium">Updated 2:13:00 PM</span>
          </div>
          
          {/* Location */}
          <div className="bg-white/40  rounded-lg p-2 flex items-center justify-center">
            <svg className="w-3 h-3 md:w-4 md:h-4 mr-2 md:mr-3 text-white flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2a6 6 0 00-6 6c0 1.887-.454 3.665-1.257 5.234a.75.75 0 00.515 1.076 32.91 32.91 0 003.256.508 3.5 3.5 0 006.972 0 32.903 32.903 0 003.256-.508.75.75 0 00.515-1.076A11.448 11.448 0 0116 8a6 6 0 00-6-6zM8.05 14.943a33.54 33.54 0 003.9 0 2 2 0 01-3.9 0z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-medium text-xs md:text-sm">5th Ave & Park St</span>
          </div>
        </div>

        {/* Estimated Arrival Card */}
        <div className="bg-gray-100 border border-gray-300 rounded-md sm:rounded-lg md:rounded-xl p-2 sm:p-3 md:p-4 text-center">
          <div className="flex items-center justify-center text-blue-700 mb-1 md:mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">ESTIMATED ARRIVAL</span>
          </div>
          <div className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-0.5 md:mb-1">3:45 PM</div>
          <div className="text-gray-600 text-xs md:text-sm">Arriving in approximately 15 minutes</div>
        </div>
      </div>
    </div>
  );
};

export default BusInformationCard;