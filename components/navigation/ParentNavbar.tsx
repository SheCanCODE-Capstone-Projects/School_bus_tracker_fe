import Link from 'next/link'
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
import { LuBus } from 'react-icons/lu'

function ParentNavbar() {
  return (
    <div>
        <nav className='font-sans bg-white flex sm:flex-row flex-col items-center justify-between gap-4 sm:gap-6 py-4 sm:py-6 px-4 sm:px-8 shadow-xs'>
        <div className='flex items-center gap-3'>
        <LuBus className='bg-blue-500 rounded-lg p-2 h-10 w-10 text-white'/>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800'>My Dashboard</h1>
          </div>
        <div className='flex flex-wrap items-center justify-center font-medium text-xs sm:text-sm gap-3 sm:gap-6'>
        <Link href='/dashboard' className='text-gray-600 hover:text-black'>Dashboard</Link>
        
        <Link href='/Setting' className='text-gray-600 hover:text-black'>Setting</Link>
        
        <div className='h-6 w-px bg-gray-300'></div>
        
        <Link href='/Logout' className='flex items-center gap-2 text-gray-600 hover:text-red-500 border border-transparent transition-all duration-300 hover:bg-red-100 rounded-lg py-1 px-3 sm:py-2 sm:px-5'>
        <FaSignOutAlt/>
        Logout
        
        </Link>
        </div>
       
        </nav>
    </div>
  )
}

export default ParentNavbar