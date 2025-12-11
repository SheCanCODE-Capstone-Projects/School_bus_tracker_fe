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
        <div className="mb-6">
          <DriverHeaderCard />
        </div>
        
        {/* Two cards responsive layout */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-center items-center lg:items-stretch gap-4 sm:gap-6">
            {/* GPS Tracking Card */}
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:w-[500px] h-96">
              <GpsTrackingCard />
            </div>
            
            {/* Emergency Card */}
            <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl xl:w-[500px] h-96">
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