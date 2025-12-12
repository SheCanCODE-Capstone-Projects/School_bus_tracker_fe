import DriverFooter from '@/components/navigation/DriverFooter'
import DriverNavbar from '@/components/navigation/DriverNavbar'
import DriverHeaderCard from '../../../components/DriverHeaderCard'
import GpsTrackingCard from '../../../components/GPSTrackingCard'
import EmergencyCard from '../../../components/EmergenceCard'
import React from 'react'

function DriverTracker() {
  return (
    <div>
        <main className='flex-1 min-h-screen bg-white'>
            <DriverNavbar/>

               {/* Header Card at the top */}
        <div className="mb-4 sm:mb-6 px-2 sm:px-4">
          <DriverHeaderCard />
        </div>
        
        {/* Two cards responsive layout */}
        <div className="w-full px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-4 sm:gap-6 max-w-7xl mx-auto">
            {/* GPS Tracking Card */}
            <div className="w-[500px] max-w-full">
              <GpsTrackingCard />
            </div>
            
            {/* Emergency Card */}
            <div className="w-[500px] max-w-full">
              <EmergencyCard />
            </div>
          </div>
        </div>
        </main>
        
        <DriverFooter/>
    </div>
  )
}

export default DriverTracker