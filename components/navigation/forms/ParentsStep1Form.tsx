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

        <h1 className="mt-3 text-[22px] text-black font-semibold">
          Parent Registration
        </h1>
        <p className="text-gray-500 text-sm">
          Create your account to track your children's bus
        </p>
      </div>

     
    </div>
  );
}
