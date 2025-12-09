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

    </div>
  );
}
