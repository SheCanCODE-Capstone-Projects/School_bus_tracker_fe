import DriverFooter from '@/components/navigation/DriverFooter'
import DriverNavbar from '@/components/navigation/DriverNavbar'
import React from 'react'

function DriverTracker() {
  return (
    <div>
        <main className='flex-1 min-h-screen bg-white'>
            <DriverNavbar/>
        </main>
        
        <DriverFooter/>
    </div>
  )
}

export default DriverTracker