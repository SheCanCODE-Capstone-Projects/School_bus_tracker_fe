'use client';

import type { ParentStudent } from '@/lib/tracking-api';

interface BusInformationCardProps {
  students?: ParentStudent[];
  busName?: string;
  busNumber?: string;
  parentName?: string;
}

const BusInformationCard = ({ students = [], busName, busNumber, parentName }: BusInformationCardProps) => {
  const firstStudent = students[0];
  const busDisplay = busName ?? busNumber ?? '—';
  const busStopName = firstStudent?.busStop?.stopName;
  const busStopAddress = firstStudent?.busStop?.address;

  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-md p-4 md:p-6 mb-4 md:mb-6 min-h-[500px] transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:scale-[1.02]">
      <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4 md:mb-6">Bus Information</h2>

      <div className="space-y-4 md:space-y-5">
        {/* Your Child's Bus */}
        <div className="bg-sky-100 border border-sky-100 rounded-lg p-3 mb-2 transition-all duration-300 hover:bg-sky-200 hover:-translate-y-1">
          <div className="flex items-start">
            <div className="mr-3 w-7 h-7 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h4v1a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1v-4a1 1 0 00-.293-.707l-2-2A1 1 0 0018 7h-3V4a1 1 0 00-1-1H3zm11 3h3.586l1 1H14V7zm-6 5a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm7 0a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-gray-700 text-sm md:text-base mb-1">Your child&apos;s bus</span>
              <span className="bg-blue-100 text-blue-800 text-xs md:text-sm font-bold py-1 px-2 md:py-1 md:px-3 rounded-full self-start">
                {busDisplay}
              </span>
            </div>
          </div>
        </div>

        {/* Students on this bus */}
        {students.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-3 mb-2 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="mr-3 w-7 h-7 md:w-8 md:h-8 bg-amber-100 rounded-lg flex items-center justify-center text-lg">
                👤
              </div>
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm md:text-base mb-1">Student{students.length > 1 ? 's' : ''}</span>
                {students.map((s) => (
                  <span key={s.id ?? s.studentName} className="font-semibold text-gray-800 text-sm md:text-base">
                    {s.studentName ?? '—'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Parent / Contact */}
        <div className="border border-gray-200 rounded-lg p-3 mb-2 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50 hover:-translate-y-1">
          <div className="flex items-start">
            <div
              className="mr-3 w-7 h-7 md:w-8 md:h-8 rounded-full bg-cover bg-center bg-no-repeat bg-gray-200"
              style={{ backgroundImage: 'url(/image.png)' }}
            />
            <div className="flex flex-col">
              <span className="text-gray-700 text-sm md:text-base mb-1">Parent</span>
              <span className="font-semibold text-gray-800 text-sm md:text-base">
                {parentName ?? firstStudent?.parentName ?? '—'}
              </span>
              {firstStudent?.parentPhone && (
                <span className="text-xs text-gray-600 mt-0.5">{firstStudent.parentPhone}</span>
              )}
            </div>
          </div>
        </div>

        {/* Pick-up / Bus stop */}
        {(busStopName || busStopAddress) && (
          <div className="border border-gray-200 rounded-lg p-3 mb-2 transition-all duration-300 hover:border-gray-300 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="mr-3 w-7 h-7 md:w-8 md:h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-700 text-sm md:text-base mb-1">Bus stop</span>
                <span className="font-semibold text-gray-800 text-sm">{busStopName ?? '—'}</span>
                {busStopAddress && <span className="text-xs text-gray-600 mt-0.5">{busStopAddress}</span>}
              </div>
            </div>
          </div>
        )}

        <hr className="my-3 md:my-4 border-gray-200" />

        {/* Status – live map shows real location; here we keep a short note */}
        <div className="bg-[#10B981] rounded-lg md:rounded-xl p-3 md:p-4 mb-3 md:mb-4 text-center transition-all duration-300 hover:bg-[#059669] hover:-translate-y-1">
          <div className="flex items-center justify-center mb-2">
            <span className="w-2.5 h-2.5 md:w-3 md:h-3 bg-white rounded-full mr-2" />
            <span className="text-white font-bold text-sm md:text-base">Live tracking</span>
          </div>
          <p className="text-white/90 text-xs md:text-sm">See the map on the right for real-time bus location.</p>
        </div>

        {/* Estimated Arrival – placeholder (backend could add ETA later) */}
        <div className="bg-gray-100 border border-gray-300 rounded-lg md:rounded-xl p-3 md:p-4 text-center transition-all duration-300 hover:bg-gray-200 hover:border-gray-400 hover:-translate-y-1">
          <div className="text-blue-700 mb-1 md:mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-900">Live on map</span>
          </div>
          <div className="text-gray-600 text-xs md:text-sm">Open the map to see where the bus is now.</div>
        </div>
      </div>
    </div>
  );
};

export default BusInformationCard;
