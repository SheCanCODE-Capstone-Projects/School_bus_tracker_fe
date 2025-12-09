import ParentNavbar from '@/components/navigation/ParentNavbar'
import React from 'react'
import Footer from '@/components/Footer'
import Notifications from '@/components/notifications'
import ParentDashboardMap from '@/components/navigation/maps/parentDashboardMap'

function ParentDashboard() {
  return (
    <div className="bg-white flex flex-col min-h-screen">
        <ParentNavbar/>
        <main>
          <div className='lg:flex-1'>
           <Notifications /> 
          </div>
          <div className='lg:flex-1'>
           <ParentDashboardMap />
          </div>
        </main>
        <Footer/>
    </div>
  )
}

export default  ParentDashboard 