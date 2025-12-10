'use client'

import React, { useState } from 'react'
import { AiOutlineExclamationCircle } from 'react-icons/ai'
import { FaTimes } from 'react-icons/fa'
import { FiClock } from 'react-icons/fi'

function Notifications() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className='relative block border pl-10 sm:flex flex-col bg-gradient-to-r from-amber-500 to-amber-600 via-amber-600 w-10/12 mx-auto mt-5 p-6 min-h-20 rounded-lg shadow-amber-600'>
        <button type="button" onClick={() => setIsVisible(false)} aria-label="Close notification" className='absolute top-2 right-2 text-white p-4 hover:text-black transition-colors'>
          <FaTimes size={20} />
        </button>
        <h2 className='flex items-center text-black text-xl font-semibold pt-4 gap-2'>
          <AiOutlineExclamationCircle className="text-white  w-10 h-10 p-2 bg-amber-400  rounded-lg" />
          Bus Approaching Your Stop!</h2>
        <p className='text-xs sm:text-sm  text-gray-700 sm:text-gray-600 pt-2'>The bus is approximately 0.8 km away from Oak Street Stop. Please get ready!</p>
    <div className='pt-4'>
          <p className='flex items-center  gap-2 text-xs text-white w-fit  bg-amber-400 px-4 py-2 rounded-lg'>
             <FiClock size={16} />
             Estimated arrival: 3:45 PM
          </p>
        </div>
    </div>
  )
}

export default Notifications