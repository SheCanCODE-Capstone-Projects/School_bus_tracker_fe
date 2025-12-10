'use client';

import Link from 'next/link'
import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa'
function ParentNavbar() {
  return (
    <div>
        <nav className='text-sans bg-white flex items-center justify-around gap-6 py-6 px-8 shadow-lg'>
        <h1 className=' text-3xl font-bold text-gray-800'>My Dashboard</h1>
        <div className='flex items-center font-medium text-sm gap-6'>
        <Link href='Dashboard'className='text-gray-600 hover:text-black'>Dashboard</Link>
        <Link href='/Setting' className='text-gray-600 hover:text-black'>Setting</Link>
        <Link href='/Logout'  className='flex items-center gap-2  text-gray-600  hover:text-red-500  border border-transparent transition-all duration-300 hover:bg-red-100 rounded-lg py-2 px-5'>
        <FaSignOutAlt/>
        Logout
        </Link>
        </div>
        </nav>
    </div>
  )
}
export default ParentNavbar
