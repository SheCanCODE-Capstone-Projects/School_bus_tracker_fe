"use client";
import React, { useState } from "react";
import { Trash2, Users, Bus, UserPlus } from "lucide-react";
import Link from "next/link";

export default function ParentRegistration() {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    address: ""
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.fullName) newErrors.fullName = "Required";
    if (!formData.phone) newErrors.phone = "Required";
    if (!formData.email) newErrors.email = "Required";
    if (!formData.password) newErrors.password = "Required";
    if (!formData.address) newErrors.address = "Required";
    
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      window.location.href = "/register/parent/step1/step2";
    }
  };
  return (
    <div className="p-3 sm:p-5 bg-gray-100 min-h-screen">
      <div className="text-center mt-3 sm:mt-5">
        <div className="flex justify-center mt-3 sm:mt-5">
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
            <Bus className="w-8 h-8 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>
        <div>
          <h1 className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold">
            SCHOOL BUS TRACKER
          </h1>
        </div>
        <h1 className="mt-3 text-lg sm:text-xl text-black font-semibold">
          Parent Registration
        </h1>
        <p className="text-gray-500 text-sm px-4">
          Create your account to track your children's bus
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-8 mt-5 px-4">
        <div className="flex items-center gap-3">
          {/* Circle */}
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <UserPlus className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          {/* Right side: Step 1 + Parent Info */}
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-blue-600">Step 1</p>
            <p className="text-xs sm:text-sm text-gray-600 font-medium">Parent Info</p>
          </div>
        </div>

        <div className="w-1 h-8 sm:w-10 sm:h-1 bg-gray-400"></div>

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gray-300 rounded-full flex items-center justify-center">
            <Users className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-semibold text-gray-400">Step 2</p>
            <p className="text-xs sm:text-sm text-gray-400 font-medium">Children Info</p>
          </div>
        </div>
      </div>

      <div className="bg-white mt-6 sm:mt-8 mx-3 sm:mx-auto p-4 sm:p-5 rounded-lg max-w-xl shadow-md">
        <h2 className="text-lg font-semibold mb-4 text-black">
          Parent Information
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-black">Full Name *</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
              className={`w-full p-2 border text-black rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
          </div>

          <div>
            <label className="text-black">Phone Number *</label>
            <input
              type="text"
              placeholder="(+250) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className={`w-full p-2 border text-black rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>

          <div>
            <label className="text-black">Email Address *</label>
            <input
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className={`w-full p-2 border text-black rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>

          <div>
            <label className="text-black">Password *</label>
            <input
              type="password"
              placeholder="Enter a secure password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className={`w-full p-2 border text-black rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
          </div>

          <div>
            <label className="text-black">Home Address *</label>
            <textarea
              placeholder="Enter your complete home address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className={`w-full p-2 h-20 border text-black rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'}`}
            ></textarea>
            {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
          </div>

          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 text-black mt-4">
            <button
              type="button"
              className="px-6 sm:px-10 py-2 border border-gray-300 rounded-full text-sm sm:text-base"
            >
              ← Back to Login
            </button>

            <button
              type="submit"
              className="px-6 sm:px-22 py-2 bg-blue-600 text-white rounded-full text-sm sm:text-base"
            >
              Next: Add Children →
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
