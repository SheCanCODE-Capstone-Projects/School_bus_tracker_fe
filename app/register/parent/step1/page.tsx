import React from "react";
import { Trash2, Users, Bus, UserPlus } from "lucide-react";
import Link from "next/link";


export default function ParentRegistration() {
  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <div className="text-center mt-5">
        <div className="flex justify-center mt-5">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
            <Bus className="w-12 h-12 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <h1 className="mt-3 text-22px text-black font-semibold">
          Parent Registration
        </h1>
        <p className="text-gray-500 text-sm">
          Create your account to track your children's bus
        </p>
      </div>

    <div className="flex justify-center gap-8 mt-5">
  
<div className="flex items-center gap-3">
  {/* Circle */}
  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
    <UserPlus className="text-white w-5 h-5" />
  </div>

  {/* Right side: Step 1 + Parent Info */}
  <div className="flex flex-col">
    <p className="text-xs font-semibold text-blue-600">Step 1</p>
    <p className="text-sm text-gray-600 font-medium">Parent Info</p>
  </div>
</div>

<div className="w-10 h-1 mt-4 bg-gray-400"></div>

  <div className="flex items-center gap-3">
  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
    <Users className="text-white w-5 h-5" />
  </div>

  <div className="flex flex-col">
    <p className="text-xs font-semibold text-gray-400">Step 2</p>
    <p className="text-sm text-gray-400 font-medium">Children Info</p>
  </div>
</div>
</div>
                

<div className="bg-white mt-8 mx-auto p-5 rounded-lg max-w-xl shadow-md">
  <h2 className="text-lg font-semibold mb-4 text-black">Parent Information</h2>

  <form className="flex flex-col gap-4">
    <div>
      <label className="text-black">Full Name *</label>
      <input
        type="text"
        placeholder="Enter your full name"
        className="w-full p-2 border text-gray-500 border-gray-300 rounded-md"
      />
    </div>

    <div>
  <label className="text-black">Phone Number *</label>
  <input
    type="text"
    placeholder="(+250) 123-4567"
    className="w-full p-2 border border-gray-300 rounded-md placeholder-gray-400"
  />
</div>


    <div>
      <label className="text-black">Email Address *</label>
      <input
        type="email"
        placeholder="your.email@example.com"
        className="w-full p-2 border border-gray-300 rounded-md placeholder-gray-400"
      />
    </div>

    <div>
      <label className="text-black">Password *</label>
      <input
        type="password"
        placeholder="Enter a secure password"
        className="w-full p-2 border border-gray-200 rounded-md placeholder-gray-400"
      />
    </div>

    <div>
      <label className="text-black">Home Address *</label>
      <textarea
        placeholder="Enter your complete home address"
        className="w-full p-2 h-20 border  border-gray-300 rounded-md placeholder-gray-400"
      ></textarea>
    </div>

    <div className="flex justify-between text-black mt-3">
      <button
        type="button"
        className="px-10 py-2 border border-gray-300 rounded-full  "
      >
        ← Back to Login
      </button>

<Link href="/register/parent/step1/step2">
  <button
    type="button"
    className="px-22 py-2 bg-blue-600 text-white rounded-full"
  >
    Next: Add Children →
  </button>
</Link>

    </div>
  </form>
</div>


        
    </div>
  );
}
