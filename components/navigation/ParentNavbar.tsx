'use client';

import Link from 'next/link'
import React, { useState } from 'react'
import { FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa'

function ParentNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="w-full">
      <nav className='bg-white flex items-center justify-between py-4 px-4 md:px-6 lg:px-8 shadow-lg'>
        {/* Logo/Brand */}
        <h1 className='text-xl md:text-2xl lg:text-3xl font-bold text-gray-800'>
          My Dashboard
        </h1>
        
        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center font-medium text-sm lg:text-base gap-4 lg:gap-6'>
          <Link 
            href='/Dashboard' 
            className='text-gray-600 hover:text-black transition-colors duration-200'
          >
            Dashboard
          </Link>
          <Link 
            href='/Setting' 
            className='text-gray-600 hover:text-black transition-colors duration-200'
          >
            Setting
          </Link>
          <Link 
            href='/Logout' 
            className='flex items-center gap-2 text-gray-600 hover:text-red-500 border border-transparent transition-all duration-300 hover:bg-red-100 rounded-lg py-2 px-4 lg:px-5'
          >
            <FaSignOutAlt className="text-sm" />
            <span className="hidden lg:inline">Logout</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className='md:hidden text-gray-600 hover:text-black focus:outline-none'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className='absolute top-full left-0 right-0 bg-white shadow-lg md:hidden z-50'>
            <div className='flex flex-col px-4 py-6 space-y-4'>
              <Link 
                href='/Dashboard' 
                className='text-gray-600 hover:text-black py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                href='/Setting' 
                className='text-gray-600 hover:text-black py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors duration-200'
                onClick={() => setIsMenuOpen(false)}
              >
                Setting
              </Link>
              <Link 
                href='/Logout' 
                className='flex items-center justify-between text-gray-600 hover:text-red-500 py-3 px-4 hover:bg-red-50 rounded-lg transition-all duration-200'
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Logout</span>
                <FaSignOutAlt />
              </Link>
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}

export default ParentNavbar