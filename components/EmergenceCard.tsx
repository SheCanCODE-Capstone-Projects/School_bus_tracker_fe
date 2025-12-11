'use client';

const EmergencyCard = () => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 border border-gray-200 h-96 w-full flex flex-col items-center justify-center">
      {/* Title with red exclamation mark */}
      <div className="text-center mb-4">
        <div className="flex items-center justify-center gap-2">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.786 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="text-xl font-bold text-gray-900">Emergency Response</h2>
        </div>
      </div>
      
      {/* Content wrapper with red transparent background and border */}
      <div className="bg-red-50 bg-opacity-50 border border-red-300 rounded-lg p-6 w-full">
        {/* Paragraph */}
        <p className="text-black text-center mb-6">
          Report any issues or emergencies immediately. This will notify the school administration and all parents instantly.
        </p>
        
        {/* Large Red Button */}
        <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg transition-colors w-full">
          <div className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.786 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <span className="text-base sm:text-lg font-semibold">REPORT ISSUE</span>
          </div>
        </button>
      </div>
      
      {/* Warning text outside red border */}
      <p className="text-gray-600 text-center text-xs sm:text-sm mt-6 italic">
        Only use this button for genuine emergencies
      </p>
    </div>
  );
};

export default EmergencyCard;