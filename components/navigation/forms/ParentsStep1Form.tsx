import React from "react";

export default function ParentRegistration() {
  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <div className="text-center mt-5">
        <div className="flex justify-center mt-5">
          <div className="bg-blue-500 w-14 h-14 rounded-lg flex items-center justify-center">
            <span className="text-2xl text-blue-600">🚌</span>
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
  <div className="text-center">
  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
    <span className="text-white text-lg font-bold">1</span>
  </div>
  <p className="text-xs text-blue-600">Parent Info</p>
</div>


  <div className="w-10 h-1 mt-5 bg-gray-400"></div>

  <div className="text-center opacity-50">
    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-900">
      2
    </div>
    <p className="text-xs text-gray-900">Children Info</p>
  </div>
</div>
                

{/* Form Card */}
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
        className="px-4 py-2 border border-gray-300 rounded-md  "
      >
        ← Back to Login
      </button>

      <button
        type="submit"
        className="px-25 py-2 bg-blue-600 text-white rounded-md"
      >
        Next: Add Children →
      </button>
    </div>
  </form>
</div>


        
    </div>
  );
}
