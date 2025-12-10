"use client";
import { Trash2, Users, Bus, UserPlus } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";

export default function ChildrenRegistration() {
  const [children, setChildren] = useState([{ id: 1 }]);

  const addChild = () => {
    setChildren([...children, { id: children.length + 1 }]);
  };

  const deleteChild = (id: number) => {
    setChildren(children.filter((child) => child.id !== id));
  };

  return (
    <div className="p-3 sm:p-5 bg-gray-100 min-h-screen">
      <div className="text-center mt-3 sm:mt-5">
        <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-blue-500 rounded-2xl shadow-lg mb-4">
          <Bus className="w-8 h-8 sm:w-12 sm:h-12 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <h1 className="text-gray-900 text-xl sm:text-2xl md:text-3xl font-bold">
            SCHOOL BUS TRACKER
          </h1>
        </div>
        <h1 className="mt-3 text-lg sm:text-xl md:text-2xl text-black font-semibold">
          Parent Registration
        </h1>
        <p className="text-gray-500 text-sm px-4">
          Create your account to track your children&apos;s bus
        </p>
      </div>
      <div className="flex justify-center items-center gap-8 mt-5">
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

        <div className="w-10 h-1 mb-4 bg-blue-500"></div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <Users className="text-white w-5 h-5" />
          </div>

          <div className="flex flex-col">
            <p className="text-xs font-semibold text-blue-600">Step 2</p>
            <p className="text-sm text-gray-600 font-medium">Children Info</p>
          </div>
        </div>
      </div>

      <div className="bg-white mt-6 sm:mt-8 mx-3 sm:mx-auto p-4 sm:p-5 rounded-lg max-w-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-black">
            Children Information
          </h2>
          <button
            className="bg-blue-100 text-blue-600 text-xs sm:text-sm flex items-center gap-1 px-2 sm:px-3 py-2 rounded-md w-full sm:w-auto justify-center"
            type="button"
            onClick={addChild}
          >
            <span className="text-sm sm:text-lg font-bold">+</span> Add Another Child
          </button>
        </div>

        <form className="flex flex-col gap-4">
          {children.map((child, index) => (
            <div
              key={child.id}
              className="bg-gray-50 p-3 sm:p-4 rounded-lg shadow-sm relative"
            >
              {children.length > 1 && (
                <button
                  type="button"
                  onClick={() => deleteChild(child.id)}
                  className="absolute top-2 sm:top-3 right-2 sm:right-3 text-red-500 text-lg sm:text-xl"
                >
                  <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}

              <h3 className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Child {index + 1}
              </h3>

              <div className="mb-3">
                <label className="text-xs sm:text-sm text-gray-700">Full Name *</label>
                <input
                  type="text"
                  placeholder="Child's full name"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md placeholder-gray-400 text-black"
                />
              </div>

              <div className="mb-3">
                <label className="text-xs sm:text-sm text-gray-700">
                  Student Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g., STU12345"
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md placeholder-gray-400 text-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="text-xs sm:text-sm text-gray-700">Age *</label>
                  <input
                    type="number"
                    placeholder="Age"
                    className="w-full p-2 mt-1 border border-gray-300 rounded-md placeholder-gray-400 text-gray-700"
                  />
                </div>

                <div>
                  <label className="text-xs sm:text-sm text-gray-700">Bus Stop *</label>
                  <select className="w-full p-2 mt-1 border border-gray-300 rounded-md text-gray-700">
                    <option>Select bus stop</option>
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 text-black mt-4">
            <Link href="/register/parent/step1" className="w-full sm:w-auto">
              <button
                type="button"
                className="w-full sm:w-auto px-4 sm:px-10 py-2 border border-gray-300 rounded-full text-sm sm:text-base"
              >
                ← Back
              </button>
            </Link>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 sm:px-25 py-2 bg-green-600 text-white rounded-full flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              ✓ Complete Registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
