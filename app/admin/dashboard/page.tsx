import AdminFooter from '@/components/navigation/AdminFooter'
import AdminNavbar from '@/components/navigation/AdminNavbar'

import React from 'react'

export default function AdminDashboard() {
  return (
    <div>
        <main className='flex-1 min-h-screen bg-white'>
            <AdminNavbar/>
        </main>
        
        <AdminFooter/>
    </div>
  )
}

