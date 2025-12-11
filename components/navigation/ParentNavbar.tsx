'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useState } from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
import { LuBus } from 'react-icons/lu'
import { HiMenu, HiX } from 'react-icons/hi'

function ParentNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div>
        <nav className='font-sans bg-white flex items-center justify-between py-4 sm:py-6 px-4 sm:px-8 shadow-xs border-b border-gray-200'>
        <div className='flex items-center gap-3'>
        <LuBus className='bg-blue-500 rounded-lg p-2 h-10 w-10 text-white'/>
        <h1 className='text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800'>My Dashboard</h1>
          </div>
        
        <button 
          className='sm:hidden'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
        
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} sm:flex flex-col sm:flex-row absolute sm:relative top-full sm:top-auto left-0 sm:left-auto w-full sm:w-auto bg-white sm:bg-transparent shadow-lg sm:shadow-none items-center justify-center font-medium text-xs sm:text-sm gap-3 sm:gap-6 py-4 sm:py-0`}>
        <Link href='/parent/dashboard' className={pathname === '/parent/dashboard' ? 'text-blue-600 bg-blue-100 border border-blue-200 rounded-lg py-1 px-3 sm:py-2 sm:px-4' : 'text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4'}>Dashboard</Link>
        
        <Link href='/parent/dashboard/settings' className={pathname === '/parent/dashboard/settings' ? 'text-blue-600 bg-blue-100 border border-blue-200 rounded-lg py-1 px-3 sm:py-2 sm:px-4' : 'text-gray-600 hover:text-black rounded-lg py-1 px-3 sm:py-2 sm:px-4'}>Settings</Link>
        
        <div className='h-6 w-px bg-gray-300'></div>
        
        <Link href='/login' className='flex items-center gap-2 text-gray-600 hover:text-red-500 border border-transparent transition-all duration-300 hover:bg-red-100 rounded-lg py-1 px-3 sm:py-2 sm:px-5'>
        <FaSignOutAlt/>
        Logout
        
        </Link>
        </div>
       
        </nav>
    </div>
  )
}

export default ParentNavbar